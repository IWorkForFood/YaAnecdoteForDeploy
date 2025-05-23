import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from './FetchLogic'
import './MusicBar.css'
import { getUserInfo } from './hooks/getUserInfo'
import { deleteLikeUser, addLikeUser } from './hooks/moveLikeUser'
import { usePlayer } from './audio/PlayerContext';
import AudioTracks from './audio/AudioTracks'
import Carousel from './carousel/Carousel'
import TrackBar from './audio/TrackBar'





export default function MisicBar() {

    getUserInfo()
    console.log(localStorage.getItem('userId'))
    let userId = localStorage.getItem('userId')

    const [tracks, setTracks] = useState([])
    const [collections, setCollections] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [reorderedTracks, setReorderedTracks] = useState([])
    const [activeLikes, setActiveLikes] = useState({});

    const { setPlaylist, setTrack } = usePlayer();

    const getReorderedTracksCallback = useCallback(
        () => getReorderedTracks(), []
    )

    const setTracksCallback = useCallback(() => {
        if (reorderedTracks?.tracks?.length > 0) {
          setTrack(reorderedTracks.tracks[0]);
        }
      }, [reorderedTracks, setTrack]);
    

    useEffect(() => {
    if (tracks.length > 0 && userId) {
        const initialLikes = {};
        tracks.forEach(track => {
        initialLikes[track.id] = track.user_of_likes.includes(Number(userId));
        });
        setActiveLikes(initialLikes);
    }
    }, [tracks, userId]);

    console.log(activeLikes)

    async function getTracks(){
        api.get('/v1/music/track/')
        .then(response => {setTracks(response.data)})
        .catch(error => console.log(error));
    }
    async function getCollections(){
        api.get('/v1/music/authors_collection/')
        .then(response => {setCollections(response.data); console.log(response.data)})
        .catch(error => console.log(error));
    }
    async function getPlaylists(){
        api.get('/v1/music/users_collection/')
        .then(response => setPlaylists(response.data))
        .catch(error => console.log(error));
    }

    async function getReorderedTracks(){
        let response = await api.get('/v1/music/reordered_tracks/')
        return response.data
    }

    useEffect(() => {
        getTracks()
        getCollections()
        getPlaylists()
        getReorderedTracks().then(data => setReorderedTracks(data));
    }, [])

    
    const toggleLike = (trackId, endpoint) => {
        const isLiked = activeLikes[trackId] || false;
    
        if (isLiked) {
            deleteLikeUser(trackId, Number(userId), endpoint);
        } else {
            addLikeUser(trackId, Number(userId), endpoint);
        }
    
        setActiveLikes(prev => ({
            ...prev,
            [trackId]: !isLiked
        }));
    };

    const seTrackForSlider = (track) => {
        setTrack(track)
    }
    
    return(
        <div className='MusicBar'>
            <div class="Music-collector container-fluid">
                <div class="main-img-and-tracks row">
                    <AudioTracks getCollection={getReorderedTracksCallback}></AudioTracks>
                    <div class="main-track-img col-12 col-md-7" onClick={ setTracksCallback }> {/*здесь*/}
                     <i class="fa-solid fa-play"></i>
                    </div>
                    

                    <div class="top-track-conteiner col-12 col-md-5">
                        <h2 className='category-title'>Треки</h2>
                        <div className='col-12'>
                            <Carousel>
                                    {
                                    tracks && tracks.length > 0 ?
                                    tracks.reduce((result, curtrack, index) => {
                                        if (index % 3 === 0) result.push([]);

                                        result[result.length - 1].push(curtrack);
                                        return result;
                                    }, []).map((group, groupIndex) => (
                                        <Carousel.Page>
                                        <div className='joiner-3-tracks'
                                            key={`group-${groupIndex}`}
                                            
                                            style={{
                                                minWidth: '100%', // Соответствует ITEM_WIDTH в каруселе
                                                padding: '0 10px'
                                            }}
                                        >
                                            {group.map((track) => (
                                                <div className='top-track-list__repr-wrapper'
                                                key={track.id}
                                                onClick={() => seTrackForSlider(track)}
                                                >
                                                <div 
                                                className='top-track-list__representation'
                                                >
                                                    <div style={
                                                        { background: `url(${track.cover}) 0 0/cover no-repeat`,
                                                            display: 'inline-block',
                                                            padding: '30px',
                                                            borderRadius: '10px'
                                                        }
                                                        } 
                                                    className='top-track-list__img'></div> 
                                                    <div className='top-track-list__track-description'>
                                                        { tracks && tracks.length > 0 && 
                                                        <>
                                                            <p>{track.title}</p>
                                                            <p style={{fontSize:'0.8rem', color: '#555555', }}>{
                                                            
                                                            track.author_names.join(", ")
                                                            
                                                            }</p>
                                                        </> 
                                                        
                                                        }

                                                    </div>
                                                    
                                                </div>
                                                <button
                                                    className={`top-track-list__reaction-button like-button
                                                        ${activeLikes[track.id] ? 'active' : ''}`}
                                                    onClick={() => toggleLike(track.id, '/v1/music/track/')}
                                                >
                                                <i class={`bi bi-heart${activeLikes[track.id] ? "-fill" : ""} like-button__like-heart`} width="24" height="24" style={{color:'rgb(255, 217, 0)'}}></i>
                                                
                                                </button>
                                                </div>
                                            )  
                                            )}
                                            </div> 
                                        </Carousel.Page>      
                                        )
                                    )
                                :
                                
                                <div
                                style = {
                                    {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }
                                }
                                >
                                    Треков нет
                                </div>
                                }
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className='last-collections col-12'>
                    <h2 className='category-title'>Коллекция сборников</h2>
                    <div className='last-collections__swipe-list'>
                        { collections && collections.length > 0 && collections.map(function(collection){
                            let tracks = collection.tracks
                            let albumInfo = { 
                                id: collection.id,
                                cover: collection.cover,
                                description: collection.description,
                                title: collection.title,
                                isLiked: collection.user_of_likes.includes(userId)
                              }
                            return(
                            /*
                            <div className='last-collections__collection-cover' style={
                                { background: `url(${collection.cover}) 50% 50%/cover no-repeat`,
                                    display: 'inline-block',
                                    padding: '76px 76px',
                                    borderRadius: '10px'
                                }}>
                                    <span></span>
                            </div>
                            */
                            
                            <Link to='/tracks_list' className='last-collections__collection-cover' style={
                                { background: `url(${collection.cover}) 50% 50%/cover no-repeat`,
                                    display: 'inline-block',
                                    padding: '76px 76px',
                                    borderRadius: '10px',
                                    marginRight: '20px'
                                }}
                                state={{ tracks, albumInfo }}>
                            </Link>
                            
                            )
                        })
                        }

                    
                    </div>
                </div>
                
                <div className='col-12'>
                    <Carousel>
                        <Carousel.Page>
                            <div className='item item-1' style={{backgroundColor: 'red', width: '100%', height: '100%'}}>item1</div>
                        </Carousel.Page>
                        
                        <Carousel.Page>
                            <div className='item' style={{backgroundColor: 'green', width: '100%', height: '100%'}}>item2</div>
                        </Carousel.Page>

                        <Carousel.Page>
                            <div className='item' style={{backgroundColor: 'blue', width: '100%', height: '100%'}}>item3</div>
                        </Carousel.Page>
                        
                        
                    </Carousel>
                </div>
                <div className = "collection-list">
                    
                </div>
            </div>
        </div>
    )
};