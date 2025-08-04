import api from '../api/FetchLogic'

const setLocalUserInfo = async function(){
    api.get('/auth/v1/users/me/')
    .then(response => {
        localStorage.setItem('userId', JSON.stringify(response.data.id))
        localStorage.setItem('userName', JSON.stringify(response.data.username))
    })
    .catch(error => console.log(error))
} 

export const getUserInfo = () => {
    setLocalUserInfo()
}