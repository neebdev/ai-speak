import React from 'react';
import {Route, Routes, BrowserRouter} from 'react-router-dom';
import Chat from './pages/Chat';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { CharacterProvider } from './CharacterContext';


function App() {
  return (
    <BrowserRouter>
    <CharacterProvider>
     <main>
        <Routes>
            <Route index element={<Home/>}/>
            <Route path='/chat/:characterId' element={<Chat/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
     </main>
     </CharacterProvider>
    </BrowserRouter>
  );
}

export default App;