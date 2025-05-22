import '../css/App.css'
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

import Registration from './registration/Registration'
import Home from './Home'
import Login from './login/Login'
import Activates from './Activates'
import CollectPage from './CollectPage'
import Profile from './Profile'
import TrackList from './TrackList'
import PlayListPage from './PlaylistPage'
import AudioTracks from './audio/AudioMusic';
import FavouriteTracks from './FavouriteTracks';
import TrackBar from './audio/TrackBar';
import { PlayerProvider } from "./audio/PlayerContext";
import Player from "./audio/Player";
import PlaylistPag from "./TestPlayer"

function App() {

  return (
    <>
    <PlayerProvider>
      <BrowserRouter>
      
        
        <Routes>
          {/*<Route element={<ProtectedRoute />}>*/}
            
            <Route path='/' element={<Home />} />
            <Route path='/collection_page' element={<CollectPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/tracks_list/' element={<TrackList />} />
            <Route path='/playlist_page/:id' element={<PlayListPage />} />
            <Route path='/audio' element={ <AudioTracks />} />
            <Route path='/bff/:id' element={<PlaylistPag />} />
          {/*</Route>*/}
          <Route path='/reg' element={<Registration />} />
          <Route path='/activate/:uid/:token' element={<Activates />} />
          <Route path='/login' element={<Login />} />
          <Route path='/favourite_tracks' element={<FavouriteTracks />} />
          <Route path='/bar' element={<TrackBar />} />
          
              
              
            
        </Routes>

        <Player /> {/*  Всегда отображается (если есть текущий трек) */}
        
      </BrowserRouter>
      </PlayerProvider>
    </>
  )
}

export default App
