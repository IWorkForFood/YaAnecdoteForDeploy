import axios from "axios"
import api from '../api/FetchLogic'

const getCollection = async function(collection_id=''){
    try {
        const response = await api.get(`/v1/music/authors_collection/${collection_id}`)
        console.log(response.data)
        return response.data;
    }catch(error){
        console.log(error);
    }
}

const getFavourite = async function(){
    try{
        const response = await api.get("/v1/music/favourite_tracks/")
        console.log("favourite:", response.data)
        return response.data;
    }catch(error){
        console.log(error);
    }
}

export const doLikedCollectionReceiving = () => {
    return getFavourite()
}
export const doCollectionReceiving = (collection_id) => {
    return getCollection(collection_id)
}
