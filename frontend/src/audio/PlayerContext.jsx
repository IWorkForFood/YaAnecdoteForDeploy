import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');

  const audioRef = useRef(null);
  const progressRef = useRef(null);

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
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('00:00');

    audio.addEventListener('loadeddata', () => {
      setCurrentTrack(prev => ({ ...prev, duration: toMinAndSec(audio.duration) }));
    });

    audio.addEventListener('timeupdate', () => {
      const { currentTime, duration } = audio;
      const percent = (currentTime / duration) * 100;
      setProgress(percent);
      setCurrentTime(toMinAndSec(currentTime));
    });

    audio.addEventListener('ended', handleNext);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!playlist.length || !currentTrack) return;
    const index = playlist.findIndex(t => t.id === currentTrack.id);
    const next = playlist[(index + 1) % playlist.length];
    setTrack(next);
    setTimeout(() => audioRef.current.play(), 50);
    setIsPlaying(true);
  };

  const handlePrev = () => {
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
    progressRef
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
