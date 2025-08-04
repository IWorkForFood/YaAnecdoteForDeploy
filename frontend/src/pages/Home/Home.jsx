import axios from "axios";

import '../../shared/zero_styles.css'
import '../../../css/Profile.css'
import { useState } from 'react'
import Navbar from '../../widgets/Navbar/Navbar'
import '../../../css/Content.css'
import MusicBar from './MusicBar'
import AdaptiveHeader from '../../widgets/adaptiveHeader/AdaptiveHeader'

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