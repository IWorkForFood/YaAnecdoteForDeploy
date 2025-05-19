import axios from "axios";

import './zero_styles.css'
import './home.css'
import { useState } from 'react'
import Navbar from './Navbar'
import './Content.css'
import MusicBar from './MusicBar'
import AdaptiveHeader from './AdaptiveHeader'

export default function Home(){

    const [sign, setSign] = useState('home');

    return(
    <div className="page-container">
        <Navbar setSign={setSign} sign={sign} />
        
        <div className='content'>
            <AdaptiveHeader></AdaptiveHeader>
            <MusicBar></MusicBar>
        </div>
    </div>
    )
}