import React, { useState, useContext, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { BACKEND_DOMAIN } from '../../shared/config/names'
import axios from 'axios';
//import './registration.css'

export default function Login(){

    const [username, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [hasError, setHasError] = useState({})
    const [errors, setErrors] = useState({
        email: [],
        password: [],
      });


    useEffect(()=>{
        hasError['email'] = false
        hasError['password'] = false
    }, [])
   

    function handleEmailChange(event){
        event.preventDefault();
        setEmail(event.target.value)

        setHasError(prev => (
            {...prev, email: event.target.value.trim().length == 0}
        ))
        
    }
    function handlePasswordChange(event){
        setPassword(event.target.value)
        setHasError(prev => (
            {...prev, password:  event.target.value.trim().length == 0}
        ))
    }

    const navigate = useNavigate()

    async function getToken(event){
        event.preventDefault();
        ////console.log("getToken")

        const tokenResponse = await axios.post(BACKEND_DOMAIN + 'api/token/', {
            username: email,
            password: password
        });

        const accessToken = tokenResponse.data.access;
        const refreshToken = tokenResponse.data.refresh;
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('accessToken', accessToken); // Сохраняем в localStorage

        //console.log(accessToken);
        //console.log(refreshToken);

        navigate('/', {replace: true})

    }
        

    return(
        <div className='reg-enter-wrapper'>
        <div className = "reg-enter-block">
        <h2 id='reg-title'>Вход</h2>
        <p className = "form-left-line" >Добро пожаловать! Мы рады видеть вас снова!</p>
        <form className = "reg-enter-form" onSubmit={getToken}>   
            {/*<input name='email' placeholder='email' value={email} onChange={handleEmailChange}></input>
            <input name='password' placeholder='Пароль' value={password} onChange={handlePasswordChange}></input>*/}

            <div className="mb-3">
            <input
                type="text"
                className="form-control"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder='Логин'
                style={
                    {border: hasError.email ? '1px solid red' : null}
                }
                required
            />
            </div>
            {errors.email && errors.email.join(" ")}

            <div className="input-group mb-3">
            <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder='Пароль'
                style={
                    {border: hasError.password ? '1px solid red' : null}
                }
            />
            </div>
            <button disabled={
                password.length <= 0 || email.length <= 0
             }>Войти</button>
        </form>
        </div>
        <p>Не член? <span><Link to="/reg">Зарегистрируйтесь</Link></span> сейчас</p>
        </div>
    )
}