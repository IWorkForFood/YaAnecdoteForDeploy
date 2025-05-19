import React from 'react'
import { useEffect, useState } from 'react'
import api from './FetchLogic'
import '../css/Profile.css'
import ProfileContainer from './ProfileContainer'
import './zero_styles.css'
import Navbar from './Navbar'
import './Content.css'
import CategoryTitle from './CategoryTitle'

export default function Profile(){

    

    const [sign, setSign] = useState('profile');
    const [userData, setUserData] = useState('profile');

    const getUserData = async function(){
        api.get('/auth/v1/users/me/').then(response => {setUserData(response.data).catch(error=>console.log(error));
        })
    }
    
    useEffect(() => {
        getUserData()
    }, [])

    return(
    <div className="page-container">
        {<Navbar setSign={setSign} sign={sign} />}
        <div className='content'>
            
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
            <div className='period-stat-container profile-stat-row' >
                <ProfileContainer>Привет</ProfileContainer>
                <span className='period-stat-container__blank-separator'></span>
                <ProfileContainer>Привет</ProfileContainer>
                <span className='period-stat-container__blank-separator'></span>
                <ProfileContainer>Привет</ProfileContainer>
            </div>
            </div>
        </div>
    </div>
    )
}