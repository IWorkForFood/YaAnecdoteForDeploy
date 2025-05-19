import axios from "axios";

import './zero_styles.css'
import './home.css'
import { useState } from 'react'
import Navbar from './Navbar'
import './Content.css'
import Collections from './Collections'
import AdaptiveHeader from './AdaptiveHeader'
import { useLocation } from 'react-router-dom'

export default function CollectPage(){

    const [sign, setSign] = useState('collections');
    const location = useLocation();

    return(
    <div className="page-container">
        <Navbar setSign={setSign} sign={sign} />
        <div className='content'>
            <AdaptiveHeader></AdaptiveHeader>
            <Collections key={location.key}></Collections>
        </div>
    </div>
    )
}