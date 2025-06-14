import React from "react";
import { Routes, Route } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import CallLog from "./pages/callLogPage/CallLog";
import CallList from "./pages/CallList";
import Chatbot from "./pages/Chatbot";
import TwilioCallReceiver from "./components/TwilioCallReceiver";

class AppRouter extends React.Component {
  render() {
    return (
      <>
        <GlobalStyle />
        <TwilioCallReceiver />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Main />} />
          <Route path="/callLog" element={<CallLog />} />
          <Route path="/callList" element={<CallList />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </>
    );
  }
}

export default AppRouter;
