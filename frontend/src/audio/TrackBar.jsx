
import '../../css/TrackBar.css';
import { deleteLikeUser, addLikeUser } from '../hooks/moveLikeUser';
import { getUserInfo } from '../hooks/getUserInfo';
import { useState, useEffect } from 'react';

export default function TrackBar({ track, setTrack }) {

  getUserInfo()
  console.log(localStorage.getItem('userId'))
  let ifOfUser = localStorage.getItem('userId')
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState(ifOfUser);

  useEffect(() => {
    getUserInfo();
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  useEffect(() => {
    if (track && userId) {
      const likePresence = track?.user_of_likes?.includes(Number(userId)) || false;
      setIsLiked(likePresence);
    }
  }, [track, userId]);

  const toggleLike = (trackId, endpoint) => {
    try {
      console.log('isLiked:', isLiked)
      if (isLiked) {
        console.log(endpoint)
        deleteLikeUser(trackId, Number(userId), endpoint);
        
      } else {
        addLikeUser(trackId, Number(userId), endpoint);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div 
      key={track.id} 
      className="track-info" 
      data-id={track.id}
      onClick={() => setTrack(track)}
    >
      <div className="track-representation">
        <div className="image-button-group">
          <div
            className="track-image"
            style={{
              background: `url(${track.cover}) 0 0 / cover no-repeat`,
              display: 'inline-block',
              padding: '20px',
              borderRadius: '10px'
            }}
          />
          <button 
            className='like-track-list-button text-decoration-none'
            style={{position: 'relative'}}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(track.id, '/v1/music/track/');
            }}
          >
            <i 
              className={`bi bi-heart${isLiked ? '-fill' : ''}`} 
              width='22px' 
              height='22px'  
              style={{position: 'absolute', color: isLiked ? 'rgb(255, 217, 0)' : 'inherit'}}
            />
          </button>
        </div>

        <div className="track-description row">
          <div className="col-6 col-md-3">
            {track.title}
          </div>
          <div className="col-6 col-md-3">
            {track.author.map(a => a.name).join(', ')}
          </div>
          <div className="col-6 col-md-3">
            {track.duration}
          </div>
          <div className="col-6 col-md-3">
            <i 
              className="bi bi-three-dots-vertical" 
              width='22px' 
              height='22px'  
              style={{ color: 'rgb(255, 217, 0)'}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
