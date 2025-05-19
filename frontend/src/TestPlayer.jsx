import React, { useEffect, useState, use } from 'react';
import { usePlayer } from './audio/PlayerContext'; // Импортируем хук usePlayer
import api from './FetchLogic'; // Ваша API для загрузки плейлиста
import { useParams } from 'react-router-dom';

export default function PlaylistPag() {
const { id } = useParams();
const { setPlaylist, setTrack } = usePlayer();  // Используем данные из контекста
const [playlistData, setPlaylistData] = useState(null);

  // Загрузка плейлиста при монтировании компонента
  useEffect(() => {
    async function fetchData() {
      const res = await api.get(`/v1/music/users_collection/${id}`);
      setPlaylistData(res.data);
      setPlaylist(res.data.tracks); // Обновляем плейлист в контексте
      console.log(res.data)
    }
    fetchData();
  }, [setPlaylist]);

  if (!playlistData) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{playlistData.title}</h1>
      &lkkkkkkk
      {playlistData.tracks.map(track => (
        <div key={track.id} onClick={() => setTrack(track)} style={{backgroundColor:'red'}} >
          ▶ {track.title}
          
        </div>
      ))}
    </div>
  );
}
