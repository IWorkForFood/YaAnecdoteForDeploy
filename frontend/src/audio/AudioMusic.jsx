import { doPlaylistReceiving } from '../hooks/PlaylistApi'
import { useState, useEffect } from 'react'
import '../../css/AudioMusic.css'
import { toMinAndSec } from './Utils'







const AudioTracks = function ({collectionId}) {

  const AudioController = {
    state: {
        audios: [],
        current: {},
        playing: false
    },
    init(data) {
        this.initVariables();
        this.data = data;
        this.audioList.innerHTML = ''
        this.initEvents()
        this.renderAudios();
    },
    initVariables() {
      this.audioList = document.querySelector('.items');
      this.currentItem = document.querySelector('.player')
    },
    initEvents(){
      this.audioList.addEventListener('click', this.handleItem.bind(this))
    },

    renderCurrentItem(current){
      return `

          <div class="current-info">
          
            <div class="current-info__top pl-md-1">

              <div class="current-info__titles">
              <div
                class="current-image"
                style="background-image: url(${current.cover});"
              ></div>
                <div class="current-track-info">
                  <h2 class="current-info__group">${current.title}</h2>
                  <p>${current.author.map(author => author.name).join(', ')}</p>
                </div>
              </div>

              <div class="controls">
              <div class="controls-buttons">
                <button class="controls-button controls-prev">
                  <i class="bi bi-skip-start-fill fs-3"></i>
                </button>

                <button class="controls-button controls-play">
                  <i class="bi bi-play-fill fs-1 play-icon"></i>
                  <i class="bi bi-pause-fill fs-1 pause-icon d-none"></i>
                </button>

                <button class="controls-button controls-next">
                  <i class="bi bi-skip-end-fill fs-3"></i>
                </button>
              </div>

              <div class="controls-progress">
                <div class="progress">
                  <div class="progress-current"></div>
                </div>

                <div class="timeline">
                  <span class="timeline-start">00:00</span>
                  <span class="timeline-end">${toMinAndSec(current.audio.duration)}</span>
                </div>
              </div>
              <div class='blank'></div>
            </div>
          </div>

            </div>

            `;
    },

    pauseCurrentAudio() {
      const { current: { audio }} = this.state;
      if (!audio) return;
      audio.pause()
      audio.currentTime = 0;
    },

    audioUpdateHandler({audio, duration}){

      const progress = document.querySelector(".progress-current")
      const timeline = document.querySelector(".timeline-start")
      console.log('progress:', progress)
      
      audio.addEventListener("timeupdate", ({ target }) => {
        //{target} - сокращено от 
        //const target = event.target;
        console.log(target.currentTime)
        const { currentTime } = target 
        const width = currentTime * 100 / target.duration;

        timeline.innerHTML = toMinAndSec(target.currentTime)
        console.log('progress:', progress, " width:", progress.style.width)
        progress.style.width = `${width}%`;

        audio.addEventListener('ended', ({target}) =>  {
          target.currentTime = 0;
          progress.style.width = '0%'
          this.handleNext();
        })
      })
    },

    togglePlaying(){
      const { playing, current } = this.state
      const { audio } = current
      playing ? audio.play() : audio.pause()
    },

    setCurrentItem(itemId){
      const current = this.state.audios.find(({ id }) => +id === +itemId)

      console.log('текущ:', current);
      if (!current) return;

      this.pauseCurrentAudio()

      this.state.current = current
      this.currentItem.innerHTML = this.renderCurrentItem(current);

      console.log('current audio:', current.audio)
      this.handlePlayer()
      this.audioUpdateHandler(current);

      setTimeout(() => {this.togglePlaying()}, 10)
    },

    handleItem({ target }){
      
      const item = target.closest('[data-id]');
      if (!item) return;

      const { id } = item.dataset;
      this.setCurrentItem(id);
    },
    handleNext() {
      const { current } = this.state;
  
      const currentItem = document.querySelector(`[data-id="${current.id}"]`);
      const next = currentItem.nextElementSibling?.dataset;
      const first = this.audioList.firstElementChild?.dataset;
  
      const itemId = next?.id || first?.id;
      console.log('id:', itemId)
      console.log('первый:', first)
  
      if (!itemId) return;
  
      this.setCurrentItem(itemId);
    },
  
    handlePrev() {
      const { current } = this.state;
      console.log('id:', current.id)
      console.log(document.querySelectorAll('.track-info'))
      const currentItem = document.querySelector(`[data-id="${current.id}"]`);
      console.log(currentItem.previousElementSibling)
      const prev = currentItem.previousElementSibling?.dataset;
      const last = this.audioList.lastElementChild?.dataset;
      console.log("последний:", last)
      //console.log("последний:",last)
      const itemId = prev?.id || last?.id;
  
      if (!itemId) return;
  
      this.setCurrentItem(itemId);
    },

    handleAudioPlay(){
      const { playing, current } = this.state
      const { audio } = current

      !playing ? audio.play() : audio.pause()

      this.state.playing = !playing
    },

    handlePlayer(){
      const play = document.querySelector('.controls-play')
      const next = document.querySelector('.controls-next')
      const prev = document.querySelector('.controls-prev')
      play.addEventListener('click', this.handleAudioPlay.bind(this))
      next.addEventListener("click", this.handleNext.bind(this));
      prev.addEventListener("click", this.handlePrev.bind(this));
    },

    renderItem(audio){
        const item = `
          <div class="track-info" data-id="${audio.id}">
          <div class="track-representation">
            <div class="image-button-group">
              <div
                class="track-image"
                style={{
                  background: 'url(${audio.cover}) 0 0 / cover no-repeat',
                  display: 'inline-block',
                  padding: '20px',
                  borderRadius: '10px'
                }}
              >
              </div>
              <button class='like-track-list-button text-decoration-none'
               style={{position: 'relative'}}>
                
                <i class="bi bi-heart" width='22px' height='22px'  style={{position: 'absolute'}}></i>
                
              </button>
            </div>

            <div class="track-description row">
              <div class="col-6 col-md-3">
                ${audio.title}
              </div>
              <div class="col-6 col-md-3">
                ${audio.author.map(a => a.name).join(', ')}
              </div>
              <div class="col-6 col-md-3">
                ${audio.duration}
              </div>
              <div class="col-6 col-md-3">
              <i class="bi bi-three-dots-vertical" width='22px' height='22px'  style={{ color: 'rgb(255, 217, 0)'}}></i>
              </div>
            </div>
          </div>
        </div>
        `
        return item
    },
    loadAudioData(audio){
        
        this.audioList.innerHTML += this.renderItem(audio);
        
    },


/*
    setCurrentItem(){

    },
*/

    renderAudios() {
        this.data.forEach((item) => {
            const audio = new Audio(`${item.audio_file}`);
            console.log(audio);

            audio.addEventListener('loadeddata', () => {
                console.log(audio.duration);
                const newItem = {...item, duration: toMinAndSec(audio.duration), audio}
                this.state.audios = [...this.state.audios, newItem]
                this.loadAudioData(newItem);
                console.log("item:", (newItem))
            });

        });
    }
};


    const [tracks, setTracks] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const playlists = await doPlaylistReceiving(collectionId);
            console.log('1 -', playlists['tracks']);
            setTracks(playlists.tracks);
            AudioController.init(playlists.tracks || []);
        };
        fetchData();
    }, []);

    return (
      <div>
        <div class='items' >
        </div>
        <div class='player' style={{position:'fixed', right: 0, bottom: 0, width: '100%'}}>
          <p class='player-data'></p>
        </div>
      </div>
        

    );
}

export default AudioTracks;
