import '../../shared/zero_styles.css'
import { useState } from 'react'
import Navbar from '../../widgets/Navbar/Navbar'
import '../../../css/Content.css'
import FavouriteContent from './FavouriteContent'
import AdaptiveHeader from '../../widgets/adaptiveHeader/AdaptiveHeader'


export default function TrackList(){
    const [sign, setSign] = useState('home');
        

    return(
    <div className="page-container">
        <Navbar setSign={setSign} sign={sign} />
        
        <div className='content'>
            <AdaptiveHeader></AdaptiveHeader>
            <FavouriteContent></FavouriteContent>
        </div>
    </div>
    )
}
