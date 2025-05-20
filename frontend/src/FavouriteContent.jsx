import '../css/ListContent.css'
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from './hooks/getUserInfo';
import { deleteLikeUser, addLikeUser } from './hooks/moveLikeUser'
import { doLikedCollectionReceiving } from './hooks/CollectionApi'
import { useState, useEffect, useMemo, useCallback } from 'react'
import api from './FetchLogic'
import AudioTracks from './audio/AudioTracks'
import { usePlayer } from './audio/PlayerContext';
import TrackBar from './audio/TrackBar';

export default function ListContent() {
  const { setPlaylist, setTrack } = usePlayer();
  const { trackCount, setTrackCount } = useState();
  const [ tracks, setTracks ] = useState([])
  
  const navigate = useNavigate();

  const fetchTracks = useCallback(() => {
    doLikedCollectionReceiving()
      .then(response => {console.log(response); setTracks(response.tracks)})
      .catch(error => console.log(error));
  }, []);

  const doLikedCollectionReceivingCallback = useCallback(
    () => doLikedCollectionReceiving(), []
  )

  const handleSetTrack = useCallback((t) => {
    setTrack(t);
  }, [setTrack]);

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    console.log("Updated tracks:", tracks);
    //setTrackCount(tracks.length)
  }, [tracks]);


  return (
    
    <>
      <div className="container-fluid py-3">
      <div className="row gy-3">
        <div className="col-md-3">
          <div className="image-block">
            <img src='http://127.0.0.1:8000/api/media/images/covers/tracks/favourite/Like_play.jpg' className="img-fluid rounded d-block" alt="clim" />
          </div>
        </div>
        <div className="col">
          <div className="content-block">
            <h1 className='track-list-album-title'>
              Любимые
              </h1>
            <p>
              Треки, которые вам понравились
            </p>
            <p>{ /* `анеков: ${trackCount}` */ }</p>
            <div className="button-toolbar">
              <button className="btn btn-secondary rounded-pill" >
                <i class="bi bi-play-fill"></i> Play
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
        <AudioTracks getCollection = {doLikedCollectionReceivingCallback}> </AudioTracks>
      <div>
        {tracks && tracks.map(track => (
            <TrackBar setTrack = {handleSetTrack} track={ track }></TrackBar>
        ))}
      </div>
      </div>
      
    </div>
    { (!tracks || tracks.length <= 0) && 
          <div className='no-tracks'>треков нет</div>
      }
      
    </>

  )
}
