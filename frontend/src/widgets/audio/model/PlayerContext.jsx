import { createContext, useContext, useState, useRef, useEffect } from 'react';
import api from '../../../shared/api/FetchLogic'

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([])
  const playlistRef = useRef([]);
  //const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [listenStartTime, setListenStartTime] = useState(null);

  const currentTrack = useRef(null)
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
    fetchUserPlaylists();
  }, []);



  const fetchUserPlaylists = async () => {
    try {
      const response = await api.get('/v1/music/users_collection/');
      setUserPlaylists(response.data);
      console.log('In Player Context:', response.data)
    } catch (error) {
      console.error('Ошибка загрузки плейлистов:', error);
    }
  };

  const updatePlaylists = async () => {
    await fetchUserPlaylists();
  };

  useEffect(() => {
    if (currentTrack.current) {
      console.log("Трек обновлён:", currentTrack.current.title, "| ID:", currentTrack.current.id);
    }
  }, [currentTrack.current]);


  //---

  // Установка нового трека
  const setTrack = (track) => {

    const handleTimeUpdate = () => {
      const { currentTime, duration } = audio;
      const percent = (currentTime / duration) * 100;
      setProgress(percent);
      setCurrentTime(toMinAndSec(currentTime));

      if (isPlaying && !listenStartTime) {
        setListenStartTime(Date.now());
      }
    }

    const handleEnded = () => {
      console.log("ENDEDEEDEDEDEDEDED")
      if (listenStartTime) {
        sendListeningData(track, listenStartTime, Date.now());
        setListenStartTime(null);
      }

      handleTrackEnd();
      
    }

    const handleLoadedData = () => {
      //setCurrentTrack(prev => ({ ...prev, duration: toMinAndSec(audio.duration) }));
      currentTrack.current = { ...track, duration: toMinAndSec(audio.duration) }
    }

    if(audioRef.current){
      audioRef.current.pause();
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
      audioRef.current.removeEventListener('ended', handleEnded)
      audioRef.current.removeEventListener('loadeddata', handleLoadedData)
      audioRef.current = null;
    }

    console.log('id after set', track.id)
    console.log('new?', track)
    
    console.log("new track:", track.title)
    
    if (!track?.audio_file) return;

    const audio = new Audio(track.audio_file);
    audioRef.current = audio;

    audio.addEventListener('loadeddata', handleLoadedData);

    audio.addEventListener('timeupdate', handleTimeUpdate);

    audio.addEventListener('ended', handleEnded);

   // setCurrentTrack({ ...track, duration: '00:00' }); // временно
    currentTrack.current = { ...track, duration: '00:00' }
    setProgress(0);
    setCurrentTime('00:00');
    setTimeout(() => audioRef.current.play(), 50)
    setIsPlaying(true);
    setListenStartTime(Date.now());
    console.log(currentTrack.current, audioRef.current, " id", audioRef.current)
  };



  const handlePlayPause = () => {
    if (!audioRef.current) return;
    console.log("A?")
    if (isPlaying) {
      if (listenStartTime) {

        sendListeningData(currentTrack.current, listenStartTime, Date.now());
        setListenStartTime(null);
      }
      audioRef.current.pause();
    } else {
      setListenStartTime(Date.now());
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

/*
  const handleNextClean = () => {

    
    if (!playlist.length || !currentTrack.current) return;

    console.log('Тип currentTrack.id:', typeof currentTrack.current.id);
    playlist.forEach(t => console.log('Тип id в playlist:', typeof t.id, 'id:', t.id));

    console.log("playlist", playlist)
    console.log('id:', currentTrack.current.id)
    const index = playlist.findIndex(t => t.id === currentTrack.current.id);
    console.log('index:', index)
    console.log('length:', playlist.length)
    console.log((0+1)%3)
    const nextIndex = (index + 1) % playlist.length;
    console.log(`1-ый indx${index}`, playlist[index], `2-ой indx${nextIndex}`, playlist[nextIndex])
    console.log('new index:', nextIndex)
    playlist.forEach((track, index) => {
      console.log('cycle id', track.id, "index ", index)
    });
    
    // Проверка на зацикливание
    //if (nextIndex === index) return; 

    const nextTrack = playlist[nextIndex];
    console.log('sled track:', nextTrack)
    console.log(playlist[nextIndex].title)
    setTrack(nextTrack);
    console.log("New id:", currentTrack.current.id)
  };
*/

 const handleNextClean = () => {
    if (!playlistRef.current.length || !currentTrack.current) return;

    const index = playlistRef.current.findIndex(t => t.id === currentTrack.current.id);
    const nextIndex = (index + 1) % playlistRef.current.length;
    const nextTrack = playlistRef.current[nextIndex];

    setTrack(nextTrack);
  };

  const handlePrev = () => {
    if (!playlistRef.current.length || !currentTrack.current) return;

    const index = playlistRef.current.findIndex(t => t.id === currentTrack.current.id);
    const prevIndex = (index - 1 + playlistRef.current.length) % playlistRef.current.length;

    setTrack(playlistRef.current[prevIndex]);
  };

  const handleNext = () => {
    handleNextClean();
  };
/*
  const handlePrev = () => {
    if (!playlist.length || !currentTrack.current) return;
    
    const index = playlist.findIndex(t => t.id === currentTrack.current.id);
    const prevIndex = (index - 1 + playlist.length) % playlist.length;


    
    setTrack(playlist[prevIndex]);


  };
  */

  const handleTrackEnd = () => {
    console.log("current track id:", currentTrack.current.id)
    if (listenStartTime) {
      sendListeningData(currentTrack.current, listenStartTime, Date.now());
    }
    handleNextClean(); // Без повторной отправки статистики
  };

  const value = {
    playlist,
    playlistRef,        // для внутреннего использования (например, в колбэках)
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
