import React, { useCallback } from 'react'
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
import ListeningChart from './chart/chart'


function getListeningStats(history) {

  console.log('history:', history)

  const dailyStats = {};
  const monthlyStats = {};
  const yearlyStats = {};
  const uniqueTracksPerDay = new Set();
  let previousDate = null;

  history.forEach(item => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const day = item.date;

    if (!dailyStats[day]) {
      dailyStats[day] = {
        totalTracks: 0,
        completedTracks: 0,
        totalDuration: 0
      };
    }
    dailyStats[day].totalTracks++;
    dailyStats[day].totalDuration += item.duration_seconds;
    if (item.is_completed) {
      dailyStats[day].completedTracks++;
    }

    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        totalTracks: 0,
        completedTracks: 0,
        totalDuration: 0
      };
    }
    monthlyStats[month].totalTracks++;
    monthlyStats[month].totalDuration += item.duration_seconds;
    if (item.is_completed) {
      monthlyStats[month].completedTracks++;
    }

    if (!yearlyStats[year]) {
      yearlyStats[year] = {
        totalTracks: 0,
        completedTracks: 0,
        totalDuration: 0
      };
    }
    yearlyStats[year].totalTracks++;
    yearlyStats[year].totalDuration += item.duration_seconds;
    if (item.is_completed) {
      yearlyStats[year].completedTracks++;
    }

    if (day !== previousDate) {
      uniqueTracksPerDay.clear();
      previousDate = day;
    }
    uniqueTracksPerDay.add(item.track);
  });

  return {
    daily: dailyStats,
    monthly: monthlyStats,
    yearly: yearlyStats,
    uniqueTracksPerDay: uniqueTracksPerDay.size
  };
}





export default function Profile(){

    

    const [sign, setSign] = useState('profile');
    const [userData, setUserData] = useState('profile');
    const [likedCount, setLikedCount] = useState()
    const [listenHistory, setListenHistory] = useState(null)
    const [stats, setStats] = useState(null)

    const getUserData = async function(){
        api.get('/auth/v1/users/me/').then(response => {setUserData(response.data);
        }).catch(error=>console.log(error))
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

    const getListeningHistory = useCallback(() => {
        api.get('/v1/music/listening-history/')
        .then( response => {
            const history = response.data;
            setListenHistory(history);
            console.log("History:", history);
            setStats(getListeningStats(history))
            console.log(getListeningStats(history))
            console.log(stats);
        } )
        .catch(error => console.log(error));
    }, [])

    useEffect(() => {
        getListeningHistory()
    }, [getListeningHistory])

    function getCurrentDateFormats() {
        const now = new Date();
        
        return {
            day: now.toISOString().split('T')[0],               // "2023-11-15"
            month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, // "2023-11"
            year: now.getFullYear()                             // 2023
        };
    }

    const currentDates = getCurrentDateFormats();
    console.log(currentDates);

    

    return(

    
    <div className="page-container">
        <Navbar setSign={setSign} sign={sign} />
        <div className='content'>
            <AdaptiveHeader>

            </AdaptiveHeader>
            
            <div className='Profile'>
            <ProfileContainer>
                <div style={{ display: 'flex', flexDirection: 'column', height: '106px', justifyContent: 'space-between' }}>
                    
                    <div>
                        <CategoryTitle>{ userData ? userData.username : "Имя не известно" }</CategoryTitle>
                        <h2>{ userData ? userData.email : "Почта не известна" }</h2>
                    </div>
                
                </div>
            </ProfileContainer>
            <CategoryTitle style={{ marginTop: '1rem'}}>Статистика</CategoryTitle>
            <ProfileContainer>
              {listenHistory && <ListeningChart history={listenHistory} />}
            </ProfileContainer>
            
            <CategoryTitle style={{ marginTop: '1rem'}}>Прослушано анекдотов</CategoryTitle>
            <div className='period-stat-container profile-stat-row container-fluid p-0' >
                <div className="row g-2" style ={{width: '100%'}}>
                    <div className="col-sm-4 col-12">
                        <ProfileContainer title='За день'>{stats ? `${stats.daily[currentDates.day].totalDuration} сек` : "..."}</ProfileContainer>
                    </div >
                    
                    <div className="col-sm-4 col-12">
                        <ProfileContainer title='За месяц'>{stats ? `${stats.monthly[currentDates.month].totalDuration} сек` : "..."} </ProfileContainer>
                    </div>

                    <div className="col-sm-4 col-12">
                        <ProfileContainer title='За год'>{ stats ? `${stats.yearly[currentDates.year].totalDuration} сек` : "..."}</ProfileContainer>
                    </div>
                </div>
                
            </div>
            </div>
        </div>
    </div>

    )
}