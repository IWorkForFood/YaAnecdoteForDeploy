import api from '../../shared/api/FetchLogic'

api.defaults.headers['Content-Type'] = 'multipart/form-data'

const getLikedUsers = async function(track_id, endpoint){
    try {
        console.log(`endpoint: ${endpoint}${track_id}`)
        const response = await api.get(`${endpoint}${track_id}`);
        console.log(response.data.user_of_likes)
        return response.data.user_of_likes; // предполагаем, что это массив
    } catch (error) {
        console.error('Ошибка при получении лайков:', error);
        return null;
    }
} 

const makePatchRequest = async function(track_id, new_user = null, deleted_user = null, endpoint) {
    let liked_users = await getLikedUsers(track_id, endpoint); // теперь мы дожидаемся массив
    console.log('check:', !Array.isArray(liked_users), liked_users)
    if (liked_users == null) {
        console.error('liked_users не массив:', liked_users);
        return;
    }
    console.log('new_user:', new_user)
    if (new_user) {
        liked_users.push(new_user);
        console.log('like', liked_users)
    } else if (deleted_user) {
        let index = liked_users.indexOf(deleted_user);
        console.log('dislike', liked_users)
        if (index !== -1) liked_users.splice(index, 1);
    }

    console.log('Обновлённый список лайков:', liked_users);



        // передаём FormData
        const formData = new FormData();
        liked_users.forEach(user => {
            formData.append('user_of_likes', Number(user));
        });
        try {
            console.log('r', `${endpoint}${track_id}`)
            const response = await api.patch(`${endpoint}${track_id}`, formData);
            console.log('Обновление успешно:', response);
        }catch (error) {
            console.error('Ошибка при отправке лайков:', error);
        }
/*
    try {
        let response;
        
        if (liked_users.length === 0) {
            // передаём JSON с пустым списком
            response = await api.patch(`${endpoint}${track_id}`, {
                user_of_likes: ''
            });
        } else {
         
            // передаём FormData
            const formData = new FormData();
            liked_users.forEach(user => {
                formData.append('user_of_likes', user);
            });

            response = await api.patch(`${endpoint}${track_id}`, formData);
        }

        console.log('Обновление успешно:', response);
    } catch (error) {
        console.error('Ошибка при отправке лайков:', error);
    }
        */
}

export const addLikeUser = (track_id, new_user, endpoint) => {
    makePatchRequest(track_id, new_user, null, endpoint);
}

export const deleteLikeUser = (track_id, deleted_user, endpoint) => {
    makePatchRequest(track_id, null, deleted_user, endpoint);
}


