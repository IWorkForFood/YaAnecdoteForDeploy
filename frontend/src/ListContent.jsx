import '../css/ListContent.css'
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from './hooks/getUserInfo';
import { deleteLikeUser, addLikeUser } from './hooks/moveLikeUser'
import { doCollectionReceiving } from './hooks/CollectionApi'
import { useState, useEffect, useCallback } from 'react'
import api from './FetchLogic'
import AudioTracks from './audio/AudioTracks'
import { usePlayer } from './audio/PlayerContext';
import TrackBar from './audio/TrackBar';
import { GoBackButton } from './BackButton/BackButton'

export default function ListContent({tracks, albumInfo}) {
  const navigate = useNavigate();
  const { setPlaylist, setTrack } = usePlayer();

  const [ activeCollectionLike, setActiveCollectionLike ] = useState(albumInfo.isLiked)

  getUserInfo()
  console.log(localStorage.getItem('userId'))
  let userId = localStorage.getItem('userId')

  const doTrackSetting = useCallback(
    (t) => setTrack(t), []
  );

  async function setCurrentCollection(){
    api.get(`/v1/music/authors_collection/${albumInfo.id}`)
    .then(response => {
      console.log('номер:', Number(userId))
      setActiveCollectionLike(response.data.user_of_likes.includes(Number(userId)))
    })
    .catch(error => console.log(error))
  }

  useEffect(() => {
    setCurrentCollection()
  }, []);


  const doCollectionReceivingCallback = useCallback(
      () => doCollectionReceiving(albumInfo.id), [albumInfo]
  )

  const toggleCollectionLike = (collectionId, endpoint) => {
          const isLiked = activeCollectionLike || false;
      
          if (isLiked) {
              deleteLikeUser(collectionId, Number(userId), endpoint);
          } else {
              addLikeUser(collectionId, Number(userId), endpoint);
          }

          setActiveCollectionLike(!isLiked);
      };

  return (
    <>
      <div className="container-fluid py-3">
      <div className="row gy-3">
        <div className="col-md-3">
          <div className="image-block">
            <img src={ albumInfo.cover } className="img-fluid rounded d-block" alt="clim" />
          </div>
        </div>
        <div className="col">
          <div className="content-block">
            <h1 className='track-list-album-title'>
              { albumInfo.title }
              </h1>
            <p>
              { albumInfo.description }
            </p>
            <p>64 анека ~ 16 hrs+</p>
            <div className="button-toolbar">
              <button className="btn btn-secondary rounded-pill" >
                <i class="bi bi-play-fill"></i> Play
              </button>
              <button className="btn btn-secondary rounded-pill"
              onClick={() => toggleCollectionLike(albumInfo.id, '/v1/music/authors_collection/')}>
                <i class={`bi bi-heart${activeCollectionLike ? "-fill" : ""}  text-danger`}></i> Like
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-3 back-button-container">
          <div className="block">
            <button className="btn d-none d-md-block btn-outline-secondary rounded-pill" onClick={ () => navigate(-1) }>Назад</button>
          </div>
        </div>
      </div>

      <div className="row track-list">
      {/*<AudioTracks getCollection = {() => doCollectionReceiving(albumInfo.id)}> </AudioTracks>*/}
      <AudioTracks getCollection={ doCollectionReceivingCallback }></AudioTracks>
      <div>
        {tracks && tracks.map(track => (
          <TrackBar setTrack = {doTrackSetting} track={ track }></TrackBar>
        ))}
      </div>
      
      </div>
      
    </div>


    { !tracks || tracks.length <= 0 && 
          <div className='no-tracks'>треков нет</div>
        }
      
    </>
  )
}
