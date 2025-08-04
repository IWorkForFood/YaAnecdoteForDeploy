
const StackOfTracks = function({tracks}){
    return(
        <>
            { tracks && tracks.length > 0 && tracks.map(track=>{
            return(
              <div className="track-info">
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
                    >
                    </div>
                    <button className='like-track-list-button text-decoration-none'
                     style={{position: 'relative'}}>
                      
                      <i class="bi bi-heart" width='22px' height='22px'  style={{position: 'absolute'}}></i>
                      
                    </button>
                  </div>
      
                  <div className="track-description row">
                    <div className="col-6 col-md-3">
                      {track.title}
                    </div>
                    <div className="col-6 col-md-3">
                      Жанр
                    </div>
                    <div className="col-6 col-md-3">
                      время
                    </div>
                    <div className="col-6 col-md-3">
                    <i class="bi bi-three-dots-vertical" width='22px' height='22px'  style={{ color: 'rgb(255, 217, 0)'}}></i>
                    </div>
                  </div>
                </div>
              </div>
      
              )
            })}
        </>
    )
}

export default StackOfTracks;