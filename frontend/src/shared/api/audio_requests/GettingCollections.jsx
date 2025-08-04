import api from '../FetchLogic'

async function getCollections(){
    api.get('/v1/music/authors_collection/')
    .then(response => {setCollections(response.data); console.log(response.data)})
    .catch(error => console.log(error));
}