import { usePlayer } from './PlayerContext';
import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../hooks/useClickOutside"
import { doPlaylistReceiving, doPlaylistDataPatching } from '../hooks/PlaylistApi'
import '../../css/AudioMusic.css'
import '../../css/Player.css'
import '../../css/choiseButton.css'

export default function Player() {

  let [playlists, setPlaylists] = useState({});
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await doPlaylistReceiving();
        console.log("Fetched playlists:", response);

        if (response && response.length > 0) {
          const playlistsMap = {};
          response.forEach(playlist => {
            playlistsMap[playlist.id] = playlist;
          });
          setPlaylists(playlistsMap);
        } else {
          console.log("No playlists found");
          setPlaylists({});
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setPlaylists({});
      }
    };

    fetchPlaylists();
  }, [isOpen]);


  const menuRef = useRef(null)
  useClickOutside(menuRef, ()=>{
    if (isOpen) setTimeout(() => setOpen(false), 50);
  })

  const {
    currentTrack, isPlaying, handlePlayPause, handleNext, handlePrev,
    progress, currentTime, progressRef
  } = usePlayer();

  if (!currentTrack) return null;

  const addCurrentTrackToPlaylist = async function (playlist){
    try {
      // Проверяем, что playlist и currentTrack существуют
      if (!playlist || !currentTrack) {
          throw new Error('Плейлист или текущий трек не предоставлены');
      }
    let usedList = playlist.tracks
    console.log("usedList", usedList)
    let tracks = usedList.map(track => track.id)
    tracks.push(currentTrack.id)
    let trackObj = { track_ids:tracks }
    //doPlaylistDataPatching(playlist.id, trackObj)

    const updatedPlaylist = await doPlaylistDataPatching(playlist.id, trackObj);
    console.log('Track added successfully:', updatedPlaylist);

    // Обновляем состояние playlists
    setPlaylists(prev => ({
      ...prev,
      [playlist.id]: updatedPlaylist
    }));
    }catch(error) {
        console.error('Ошибка при добавлении трека в плейлист:', error);
        throw error; // Или обработать ошибку иным способом
    }
  }

  return (
    <div className="player" style={{ position: 'fixed', bottom: 0, width: '100%', padding: '10px' }}>
      <div className="player-info" style={{ position: 'relative', display: 'flex',
         alignItems: "center", justifyContent: "space-between" }}>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 60, height: 60, backgroundImage: `url(${currentTrack.cover})`, backgroundSize: 'cover', borderRadius: 8 }} />
          <div style={{ marginLeft: 10 }}>
            <h4 style={{ margin: 0 }}>{currentTrack.title}</h4>
            <small>{currentTrack.author?.map(a => a.name).join(', ')}</small>
          </div>
        </div>

        <div className="player-adding">
        <button className="choise-button" onClick={() => setOpen(!isOpen)} style={{display: "inline-block"}}>
        </button>

        <nav className={`choise ${isOpen ? "active" : ""}`} ref={menuRef}>
          <ul className="choise__list ">
            {playlists && Object.values(playlists).map((playlist) => {
              console.log("playlists", playlists)
              return(
                <li 
                className="choise__item"
                 onClick={() => addCurrentTrackToPlaylist(playlist)}
                 key={playlist.id}
                >
                 {playlist.title}
                </li>
              )
            })}

          </ul>
        </nav>

      </div>

      </div>

      

      <div className="player-controls">
      <button  class="controls-button controls-prev" onClick={handleNext}>
        <i class="bi bi-skip-start-fill fs-3"></i>
      </button>
        
      <button onClick={handlePlayPause} class="controls-button controls-play">
        {isPlaying ?
        <i class="bi bi-pause-fill fs-1 pause-icon"></i> :
        <i class="bi bi-play-fill fs-1 play-icon"></i>
        }
      </button>

        <button  class="controls-button controls-next" onClick={handleNext}>
        <i class="bi bi-skip-end-fill fs-3"></i>
        </button>
      </div>

      

      <div className="player-progress" onClick={(e) => {
        const bar = progressRef.current;
        const clickX = e.nativeEvent.offsetX;
        const width = bar.clientWidth;
        const seek = (clickX / width) * audioRef.current.duration;
        audioRef.current.currentTime = seek;
      }}>
        <div ref={progressRef} style={{ height: 4, background: '#555', position: 'relative', marginTop: 10 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#ffc107' }} />
        </div>
        <div style={{ fontSize: 12, color: '#aaa' }}>{currentTime} / {currentTrack.duration}</div>
      </div>
    </div>
    /*

              <div class="current-info">
              
                <div class="current-info__top pl-md-1">
    
                  <div class="current-info__titles">
                  <div
                    class="current-image"
                    style={{backgroundImage: `url(${currentTrack.cover});`}}
                  ></div>
                    <div class="current-track-info">
                      <h2 class="current-info__group">{currentTrack.title}</h2>
                      <p>{currentTrack.author?.map(a => a.name).join(', ')}</p>
                    </div>
                  </div>
    
                  <div class="controls">
                  <div class="controls-buttons">

                  <button  class="controls-button controls-prev" onClick={handleNext}>
                    <i class="bi bi-skip-start-fill fs-3"></i>
                  </button>

                    <button onClick={handlePlayPause} class="controls-button controls-play">
                      {isPlaying ?
                      <i class="bi bi-play-fill fs-1 play-icon"></i> :
                      <i class="bi bi-pause-fill fs-1 pause-icon d-none"></i>
                      }
                    </button>
    
                    <button class="controls-button controls-next" onClick={handlePrev}>
                      <i class="bi bi-skip-end-fill fs-3"></i>
                    </button>
                  </div>
    
                  <div class="controls-progress">
                    <div class="progress">
                      <div class="progress-current"></div>
                    </div>
    
                    <div class="timeline">
                      <span class="timeline-start">{currentTime}</span>
                      <span class="timeline-end">{currentTrack.duration}</span>
                    </div>
                  </div>
                  <div class='blank'></div>
                </div>
              </div>
    
              </div>
              */
  );
}