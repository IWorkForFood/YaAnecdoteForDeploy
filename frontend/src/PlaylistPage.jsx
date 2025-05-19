import { useLocation, useParams } from 'react-router-dom';
import axios from "axios";
import './zero_styles.css'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import './Content.css'
import Playlist from './Playlist'
import AdaptiveHeader from './AdaptiveHeader'
import { doPlaylistReceiving } from './hooks/PlaylistApi'

export default function PlaylistPage(){
    const location = useLocation();
    //const { albumInfo } = location.state
    const [sign, setSign] = useState('collections');
    const { id } = useParams();
        

    return(
    <div className="page-container">
        <Navbar setSign={setSign} sign={sign} />
        
        <div className='content'>
            <AdaptiveHeader></AdaptiveHeader>
            <Playlist albumId={id}></Playlist>
        </div>
    </div>
    )
}
