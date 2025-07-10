import api from '../FetchLogic'

export default async function getTracks(){
    api.get('/v1/music/track/')
    .then(response => {setTracks(response.data)})
    .catch(error => console.log(error));
}

