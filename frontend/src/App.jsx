import '../css/App.css'
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './shared/api/components/ProtectedRoute';

import Registration from './pages/registration/Registration'
import Home from './pages/Home/Home'
import Login from './pages/login/Login'
import Activates from './pages/ActivationPage/Activates'
import CollectPage from './pages/CollectionsPage/CollectPage'
import Profile from './pages/Profile/Profile'
import TrackList from './pages/ListContent/TrackList'
import PlayListPage from './pages/PlaylistPage/PlaylistPage'
import AudioTracks from './widgets/audio/model/ReactAudioMusic';
import FavouriteTracks from './pages/FavoriteContent/FavouriteTracks';
import TrackBar from './widgets/audio/ui/TrackBar';
import { PlayerProvider } from "./widgets/audio/model/PlayerContext";
import Player from "./widgets/audio/ui/Player";

function App() {

  return (
    <>
    <PlayerProvider>
      <BrowserRouter>
      
        
        <Routes>
          <Route element={<ProtectedRoute />}>
            
            <Route path='/' element={<Home />} />
            <Route path='/collection_page' element={<CollectPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/tracks_list/' element={<TrackList />} />
            <Route path='/playlist_page/:id' element={<PlayListPage />} />
            <Route path='/audio' element={ <AudioTracks />} />
          </Route>
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
