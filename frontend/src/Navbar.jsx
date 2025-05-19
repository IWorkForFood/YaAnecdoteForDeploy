import React from 'react'
import './Navbar.css'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { handleLogout } from './login/Logout'

const menuItems = [
    {
      icons: <img src='/homepage_active_active.png'></img>,
      label: 'Home'
    },
    {
      //icons: <FaProductHunt size={30} />,
      label: 'Products'
    },
    {
      //icons: <MdOutlineDashboard size={30} />,
      label: 'Dashboard'
    },
    {
      //icons: <CiSettings size={30} />,
      label: 'Setting'
    },
    {
      //icons: <IoLogoBuffer size={30} />,
      label: 'Log'
    },
    {
      //icons: <TbReportSearch size={30} />,
      label: 'Report'
    }
  ]


export default function Navbar ({ setSign, sign }) {

    function changeSign(signClass){
      setSign(signClass)
    }

    return(
      <>
        <div id="sidebar" className='navbar d-flex flex-column 
                    flex-shrink-0 
                    text-white offcanvas-md offcanvas-start'>
          <button style={{position: 'absolute', right: '2px', top: '2px'}} type="button" class="btn-close d-md-none text-reset" data-bs-target="#sidebar" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          <div className='navbar__header'>
            <i class="fa-solid fa-face-smile navbar__header-img"></i>
            
          </div>
          
            <ul className='navbar__pagelist'>
                <li>
                    <Link onClick= { () => changeSign('home') } to='/'>
                    {/*<img className={  sign == 'home' ? 'home-img active-nav-btn' : 'home-img'}
                     src={ sign == 'home' ? '/public/house-solid.svg' : '/public/homepage.png'}>
                      </img>*/}
                      <i class={ sign == 'home' ? "fa-solid fa-house active-nav-btn" : 'fa-solid fa-house'}></i>
                      <span class="d-block d-md-none">Домашняя страница</span>
                    </Link>
                </li>
                <li>
                      <Link onClick= { () => changeSign('collections') } to='/collection_page'>

                          <i class={ sign == 'collections' ? "fa-regular fa-folder-open active-nav-btn" : 'fa-regular fa-folder-open'}></i>
                          <span class="d-block d-md-none">Коллекции</span>

                      </Link>
                </li>
            </ul>
            <ul className='navbar__userlist'>
                <li>
                  <Link onClick= { () => changeSign('collections') } to='/profile'>
                      <i class={ sign == 'profile' ? 'fa-solid fa-user active-nav-btn' : 'fa-solid fa-user'}></i>
                      <span class="d-block d-md-none">Профиль</span>
                  </Link>
                </li>
                <li>
                    <a onClick={ handleLogout } style={{cursor: 'pointer'}}>
                      <i class="fa-solid fa-right-from-bracket"></i>
                      <span class="d-block d-md-none">Выйти</span>
                    </a>
                </li>
            </ul>
        </div>
        
        </>
    )
};