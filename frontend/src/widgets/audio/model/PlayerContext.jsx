import { createContext, useContext, useState, useRef, useEffect } from 'react';
import api from '../../../shared/api/FetchLogic'

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [listenStartTime, setListenStartTime] = useState(null);

  const audioRef = useRef(null);
  const progressRef = useRef(null);


  //-- Для статистики

  const sendListeningData = async (track, startTime, endTime) => {
    try {
      const duration = Math.floor((endTime - startTime) / 1000); // в секундах
      
      console.log(
        `Отправляемые дан${endTime} - ${startTime}`
      );

      console.log("new date:", new Date(startTime).toISOString())
      await api.post('/v1/music/listening-history/', {
        track: track.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        duration_seconds: duration
      },{
      
        headers: {
          'Content-Type': 'application/json' // Явно указываем тип контента
        }
      });

      
      
      console.log('Listening data saved successfully');
    } catch (error) {
      console.error('Error saving listening history:', error);
      
      // Дополнительная обработка ошибок
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Status code:', error.response.status);
      }
    }
  };


  //---Для обновления списка добавляемых треков

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await api.get('/v1/music/users_collection/');
      setPlaylists(response.data);
      console.log('In Player Context:', response.data)
    } catch (error) {
      console.error('Ошибка загрузки плейлистов:', error);
    }
  };

  const updatePlaylists = async () => {
    await fetchPlaylists();
  };


  //---

  useEffect(() => {
    console.log("изменение:", playlist)
  }, [playlist])

  // Установка нового трека
  const setTrack = (track) => {
    if (!track?.audio_file) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(track.audio_file);
    audioRef.current = audio;
    setCurrentTrack({ ...track, duration: '00:00' }); // временно
    setProgress(0);
    setCurrentTime('00:00');
    setTimeout(() => audioRef.current.play(), 50)
    setIsPlaying(true);
    setListenStartTime(Date.now());
    

    audio.addEventListener('loadeddata', () => {
      setCurrentTrack(prev => ({ ...prev, duration: toMinAndSec(audio.duration) }));
    });

    audio.addEventListener('timeupdate', () => {
      const { currentTime, duration } = audio;
      const percent = (currentTime / duration) * 100;
      setProgress(percent);
      setCurrentTime(toMinAndSec(currentTime));

      if (isPlaying && !listenStartTime) {
        setListenStartTime(Date.now());
      }
    });

    audio.addEventListener('ended', () => {
      if (listenStartTime) {
        sendListeningData(track, listenStartTime, Date.now());
        setListenStartTime(null);
      }
      handleNext();
    });
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (listenStartTime) {

        sendListeningData(currentTrack, listenStartTime, Date.now());
        setListenStartTime(null);
      }
      audioRef.current.pause();
    } else {
      setListenStartTime(Date.now());
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (listenStartTime) {
        sendListeningData(currentTrack, listenStartTime, Date.now());
        setListenStartTime(Date.now());
      }
    if (!playlist.length || !currentTrack) return;
    const index = playlist.findIndex(t => t.id === currentTrack.id);
    const next = playlist[(index + 1) % playlist.length];
    setTrack(next);
    setTimeout(() => audioRef.current.play(), 50);
    setIsPlaying(true);
    
  };

  const handlePrev = () => {
    if (listenStartTime) {
        sendListeningData(currentTrack, listenStartTime, Date.now());
        setListenStartTime(Date.now());
      }
    if (!playlist.length || !currentTrack) return;
    const index = playlist.findIndex(t => t.id === currentTrack.id);
    const prev = playlist[(index - 1 + playlist.length) % playlist.length];
    setTrack(prev);
    setTimeout(() => audioRef.current.play(), 50);
    setIsPlaying(true);
    
  };

  const value = {
    playlist,
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    setPlaylist,
    setTrack,
    handlePlayPause,
    handleNext,
    handlePrev,
    progressRef,
    updatePlaylists
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}

// Вспомогательная функция
function toMinAndSec(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
