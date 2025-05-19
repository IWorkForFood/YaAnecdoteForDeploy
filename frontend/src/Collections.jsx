import ChooseButton from './ChooseButton/ChooseButton'
import { useEffect, useState } from 'react'
import api from './FetchLogic'
import './Collections.css'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom';
import { doPlayListCreation } from './hooks/PlaylistApi'
import AudioTracks from './audio/ReactAudioMusic'
import FavouriteTracks from './FavouriteTracks'
import { usePlayer } from './audio/PlayerContext';

const CollectionSlide = function(){

    const [chosenButton, setChosenButton] = useState("playlists")
    const [collections, setCollections] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [tab, setTab] = useState('playlists')
    const { setPlaylist, setTrack } = usePlayer();

    

    const location = useLocation();

    async function getCollections(){
        api.get('/v1/music/liked_authors_collections/')
        .then( response => {setCollections(response.data); console.log(response.data)})
        .catch(error => console.log(error));
    }
    async function getPlaylists(){
        api.get('/v1/music/users_collection/')
        .then(response => setPlaylists(response.data))
        .catch(error => console.log(error));
    }
    useEffect(function(){
        getCollections()
        getPlaylists()

        window.history.replaceState({}, document.title);
    }, [location.state?.refresh]);

    useEffect(() => {
    if (location.state?.refresh) {
      getPlaylists(); // Перезапрашиваем плейлисты, если есть флаг refresh
    }
  }, [location.state]);

    

    const makeChosen = (name) =>{
        setChosenButton(name)
        setTab(name)
    }
    console.log(collections)
    console.log(playlists)

    const navigate = useNavigate();

    return(
        <div className="collections-container">
            <div className="button-wrapper">
                <ChooseButton isActive={chosenButton=='playlists'} onClick={() => makeChosen("playlists")}>Плейлисты</ChooseButton>
                <span className='button-wrapper__separator' style={{width: '20px'}}></span>
                <ChooseButton isActive={chosenButton=='collections'} onClick={() => makeChosen("collections")}>Коллекции</ChooseButton>
            </div>
            <div className="slide-container">
                { tab == 'collections' && collections && collections.length > 0 &&  collections.map(function(collection){
                    let tracks = collection.tracks
                    let albumInfo = { 
                        id: collection.id,
                        cover: collection.cover,
                        description: collection.description,
                        title: collection.title,

                      }
                      console.log(albumInfo)
                    return(
                        <Link to="/tracks_list" className='slide-container__collection-cover' style={
                            { background: `url(${collection.cover}) 50% 50%/cover no-repeat`,
                                display: 'inline-block',
                                padding: '117px 106px',
                                borderRadius: '10px',
                                marginLeft: '5px',
                                boxShadow: 'inset 0px -30px 50px #000'
                            }}
                            state={{ tracks, albumInfo }}>
                        </Link>
                    )
                })}
                {tab == 'playlists' && 
                <>
                    <Link to='/favourite_tracks' className='slide-container__favorite'>
                        <span>Любимые</span>
                    </Link>
                    <div className='slide-container__addplaylist' onClick={async () => {
                            try {
                            const playlistData = await doPlayListCreation();
                            const albumInfo = {
                                id: playlistData.id,
                                cover: playlistData.cover,
                                description: playlistData.description,
                                title: playlistData.title,
                            };
                            navigate(`/playlist_page/${albumInfo.id}`, { state: { albumInfo } });
                            } catch (error) {
                            console.error("Ошибка при создании плейлиста", error);
                        }}}>
                        <i class="fa fa-plus-square" aria-hidden="true"></i>
                    </div>
                </>
                }
                
                
                { tab == 'playlists' && playlists && playlists.length > 0 &&  playlists.map(function(playlist){
                    let albumInfo = { 
                        id: playlist.id,
                        cover: playlist.cover,
                        description: playlist.description,
                        title: playlist.title,
                        key: location.key,
                      }
                      console.log(albumInfo)
                    let path = `/playlist_page/${albumInfo.id}`;
                    return(
                        
                        <Link to={path} className='slide-container__collection-cover' style={
                            { background: `url(${playlist.cover}) 50% 50%/cover no-repeat`,
                                display: 'inline-block',
                                padding: '117px 106px',
                                borderRadius: '10px',
                                marginLeft: '5px',
                                boxShadow: 'inset 0px -30px 50px #000'
                            }}
                            state = {{ albumInfo }}>
                        </Link>
                    )
                })}
            </div>
            
        </div>
    )
}

export default CollectionSlide