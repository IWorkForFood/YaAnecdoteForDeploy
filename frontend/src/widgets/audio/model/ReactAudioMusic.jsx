import { useState, useEffect, useRef } from 'react'
import '../../../../css/ReactAudioMusic.css'
import { toMinAndSec } from '../libs/FormatTime'
import TrackBar from '../ui/TrackBar'

const AudioTracks = ({ getCollection}) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  
  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      const playlists = await getCollection();
      console.log('playlist-ы:', playlists)
      const tracksWithAudio = await Promise.all(
        playlists.tracks.map(async (track) => {
          const audio = new Audio(track.audio_file);
          await new Promise((resolve) => {
            audio.addEventListener('loadeddata', () => {
              resolve();
            });
          });
          return {
            ...track,
            duration: toMinAndSec(audio.duration),
            audio
          };
        })
      );
      setTracks(tracksWithAudio);
    };
    
    fetchData();
  }, [getCollection]);




  // Обработчик воспроизведения/паузы
  const handlePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Установка текущего трека
  const setTrack = (track) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    setCurrentTrack(track);
    audioRef.current = track.audio;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('00:00');
    
    // Настройка обработчиков для нового аудио
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', handleNext);
  };

  // Обновление прогресса воспроизведения
  const updateProgress = ({ target }) => {
    const { currentTime, duration } = target;
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent);
    setCurrentTime(toMinAndSec(currentTime));
  };

  // Перемотка по клику на прогресс-бар
  const handleProgressClick = (e) => {
    if (!currentTrack || !progressRef.current) return;
    
    const progressBar = progressRef.current;
    const clickPosition = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickPosition / progressBarWidth) * audioRef.current.duration;
    
    audioRef.current.currentTime = seekTime;
  };

  // Следующий трек
  const handleNext = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setTrack(tracks[nextIndex]);
    
    // Автовоспроизведение следующего трека
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 10);
  };

  // Предыдущий трек
  const handlePrev = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setTrack(tracks[prevIndex]);
    
    // Автовоспроизведение предыдущего трека
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 10);
  };

  return (
    <div>
      <div className="items">
        {tracks.map((track) => (
          <TrackBar track={track} setTrack={() => setTrack(track)}></TrackBar>
        ))}
      </div>
      
      {/* Плеер */}
      {currentTrack && (
        <div className='player' style={{position: 'fixed', right: 0, bottom: 0, width: '100%'}}>
          <div className="current-info">
            <div className="current-info__top pl-md-1">
              <div className="current-info__titles">
                <div
                  className="current-image"
                  style={{ backgroundImage: `url(${currentTrack.cover})` }}
                />
                <div className="current-track-info">
                  <h2 className="current-info__group">{currentTrack.title}</h2>
                  <p>{currentTrack.author.map(author => author.name).join(', ')}</p>
                </div>
              </div>

              <div className="controls">
                <div className="controls-buttons">
                  <button className="controls-button controls-prev" onClick={handlePrev}>
                    <i className="bi bi-skip-start-fill fs-3" />
                  </button>

                  <button className="controls-button controls-play" onClick={handlePlayPause}>
                    {isPlaying ? (
                      <i className="bi bi-pause-fill fs-1 pause-icon" />
                    ) : (
                      <i className="bi bi-play-fill fs-1 play-icon" />
                    )}
                  </button>

                  <button className="controls-button controls-next" onClick={handleNext}>
                    <i className="bi bi-skip-end-fill fs-3" />
                  </button>
                </div>

                <div className="controls-progress">
                  <div className="progress" ref={progressRef} onClick={handleProgressClick}>
                    <div 
                      className="progress-current" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="timeline">
                    <span className="timeline-start">{currentTime}</span>
                    <span className="timeline-end">{currentTrack.duration}</span>
                  </div>
                </div>
                <div className='blank'></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioTracks;