import axios from "axios"
import api from '../FetchLogic'

const createPlaylist = async function(title="Новый плейлист",
     description="для хаха"){
        try {
            const response = await api.post('/v1/music/users_collection/', { title, description });
            console.log(title, description);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error; 
        }
    }

const deletePlaylist = async function(collection_id){
    api.delete(`/v1/music/users_collection/${collection_id}`)
    .then(response => {
        console.log(response)
    })
    .catch(error => console.log(error))
}

const getPlaylist = async function(collection_id=''){
    try {
        const response = await api.get(`/v1/music/users_collection/${collection_id}`)
        console.log(response.data)
        return response.data;
    }catch(error){
        console.log(error);
    }
}

const patchPlaylistData = async function(collection_id, dataForForm=null){
    try {
        if (!collection_id) {
            throw new Error("collection_id не указан");
        }
        let formData = new FormData()
        if(dataForForm){
            for(let key in dataForForm){
                
                const value = dataForForm[key];

                if (Array.isArray(value)){
                    value.forEach(item => {
                        formData.append(`${key}`, item)
                        console.log(`${key}`, item)
                    })
                }else{
                    formData.append(`${key}`, dataForForm[key])
                    console.log(`${key}`, value)
                    console.log("key", value)
                }
                
            }
            
        }
        for (let [key, value] of formData.entries()) {
            console.log(`ddd ${key}: ${value}`);
        }
        const response = await api.patch(`/v1/music/users_collection/${collection_id}`, formData)
        console.log("response:", response.data)
        return response.data;
    }catch(error){
        console.log("проблема:", error);
    }
}

export const doPlayListCreation = () => {
    return createPlaylist()
}
export const doPlaylistDeletion = (collection_id) => {
    deletePlaylist(collection_id)
}
export const doPlaylistReceiving = (collection_id) => {
    return getPlaylist(collection_id)
}
export const doPlaylistDataPatching = (collection_id, dataForForm) => {
    return patchPlaylistData(collection_id, dataForForm)
}