import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signin from './pages/Signin';
import Main from './pages/Main';
import CallLog from './pages/callLogPage/CallLog';
import CallList from './pages/CallList';
import Chatbot from './pages/Chatbot';

class AppRouter extends React.Component {
  render() {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/main" element={<Main />} />
        <Route path="/callLog" element={<CallLog />} />
        <Route path="/callList" element={<CallList />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    );
  }
}

export default AppRouter;
