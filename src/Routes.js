import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle'; 

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import Calling from './pages/Calling';
import CallList from './pages/CallList';
import Chatbot from './pages/Chatbot';

class AppRouter extends React.Component {
  render() {
    return (
      <>
       <GlobalStyle />
       <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
        <Route path="/calling" element={<Calling />} />
        <Route path="/callList" element={<CallList />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
      </>
      
    );
  }
}

export default AppRouter;
