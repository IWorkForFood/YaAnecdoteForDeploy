import { useLocation, useParams } from 'react-router-dom';
import '../../shared/zero_styles.css'
import { useState } from 'react'
import Navbar from '../../widgets/Navbar/Navbar'
import '../../../css/Content.css'
import Playlist from './Playlist'
import AdaptiveHeader from '../../widgets/adaptiveHeader/AdaptiveHeader'

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
