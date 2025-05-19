import React from 'react'

import { useState, useEffect } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';

export default function Activates(){

   
    const { uid, token } = useParams(); // Получаем uid и token из URL
    const [message, setMessage] = useState('');
    console.log('Начинается активация, uid:', uid, 'token:', token);

    useEffect(() => {
        const activateUser = async () => {
            try {
                const response = await fetch('http://127.0.0.1/api/api/v1/accounts/activation/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uid, token }) // Отправляем uid и token
                });

                if (response.ok) {
                    setMessage('Аккаунт успешно активирован!');
                } else {
                    setMessage('Ошибка активации. Возможно, ссылка устарела.');
                }
            } catch (error) {
                setMessage('Произошла ошибка. Попробуйте позже.');
            }
        };

        activateUser();
    }, [uid, token]); // Запускаем запрос при загрузке
    

    return (
        <div>
            <h2 style={{backgroundColor:"red"}}>Активация аккаунта</h2>
                <Link to="/login">ВОЙТИ</Link>
            <p>{message}</p>
        </div>
    );
};

