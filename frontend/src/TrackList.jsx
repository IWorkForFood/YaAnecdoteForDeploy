import { useLocation } from 'react-router-dom';
import axios from "axios";
import './zero_styles.css'
import { useState } from 'react'
import Navbar from './Navbar'
import './Content.css'
import ListContent from './ListContent'
import AdaptiveHeader from './AdaptiveHeader'



export default function TrackList(){
    const location = useLocation();
    const { tracks, albumInfo } = location.state
    console.log(tracks)
    const [sign, setSign] = useState('home');
        

    return(
    <div className="page-container">
        <Navbar setSign={setSign} sign={sign} />
        
        <div className='content'>
            <AdaptiveHeader></AdaptiveHeader>
            <ListContent tracks={tracks} albumInfo={albumInfo}></ListContent>
        </div>
    </div>
    )
}