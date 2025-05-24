import React from 'react'

import { useState, useEffect } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import './Activates.css'

export default function Activates(){

   
    const { uid, token } = useParams(); // Получаем uid и token из URL
    const [message, setMessage] = useState('');
    console.log('Начинается активация, uid:', uid, 'token:', token);

    useEffect(() => {
        const activateUser = async () => {
            try {
                
                const response = await fetch('http://89.111.137.192/api/api/v1/accounts/activation/', {
                    method: 'POST',
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
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
        <div className="activates-body">
            <div className="activates-functional-block">
                <h2>Активация аккаунта</h2>
                <span className="message-span">{message}</span>
                <Link to="/login" className="activation-enter">ВОЙТИ</Link>
            </div>
        </div>
    );
};

