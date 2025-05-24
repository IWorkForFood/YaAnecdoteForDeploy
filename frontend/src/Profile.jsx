import React from 'react'
import { useEffect, useState } from 'react'
import api from './FetchLogic'
import '../css/Profile.css'
import ProfileContainer from './ProfileContainer'
import './zero_styles.css'
import Navbar from './Navbar'
import './Content.css'
import CategoryTitle from './CategoryTitle'
import AdaptiveHeader from './AdaptiveHeader'
import { doLikedCollectionReceiving } from './hooks/CollectionApi'

export default function Profile(){

    

    const [sign, setSign] = useState('profile');
    const [userData, setUserData] = useState('profile');
    const [likedCount, setLikedCount] = useState()

    const getUserData = async function(){
        api.get('/auth/v1/users/me/').then(response => {setUserData(response.data).catch(error=>console.log(error));
        })
    }
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUserData(); 
                const likedData = await doLikedCollectionReceiving(); 
                console.log(likedData)
                setLikedCount(likedData.tracks.length);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

    fetchData();
    }, [])



    return(

    
    <div className="page-container">
        <Navbar setSign={setSign} sign={sign} />
        <div className='content'>
            <AdaptiveHeader></AdaptiveHeader>
            
            <div className='Profile'>
            <ProfileContainer>
                <div style={{ display: 'flex', flexDirection: 'column', height: '106px', justifyContent: 'space-between' }}>
                    
                    <div>
                        <CategoryTitle>{ userData ? userData.username : "Имя не известно" }</CategoryTitle>
                        <h2>{ userData ? userData.email : "Почта не известна" }</h2>
                    </div>
                
                <p>Изменить пароль</p>
                </div>
            </ProfileContainer>
            <CategoryTitle style={{ marginTop: '1rem'}}>Статистика</CategoryTitle>
            <ProfileContainer>Привет</ProfileContainer>
            
            <CategoryTitle style={{ marginTop: '1rem'}}>Прослушано анекдотов</CategoryTitle>
            <div className='period-stat-container profile-stat-row container-fluid p-0' >
                <div className="row g-2" style ={{width: '100%'}}>
                    <div className="col-sm-4 col-12">
                        <ProfileContainer title='Любимых анеков'>{likedCount}</ProfileContainer>
                    </div >
                    
                    <div className="col-sm-4 col-12">
                        <ProfileContainer>{likedCount}</ProfileContainer>
                    </div>

                    <div className="col-sm-4 col-12">
                        <ProfileContainer>{likedCount}</ProfileContainer>
                    </div>
                </div>
                
            </div>
            </div>
        </div>
    </div>

    )
}