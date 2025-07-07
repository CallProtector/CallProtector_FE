import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import styled from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import CallLog from "./pages/callLogPage/CallLog";
import CallList from "./pages/callListPage/CallList";
import Chatbot from "./pages/Chatbot";
import TwilioCallReceiver from "./components/TwilioCallReceiver";
import Navbar from "./components/Navbar";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* 화면에 딱 맞게 */
`;

const ContentWrapper = styled.div`
  flex: 1; /* 남은 영역 전부 차지 */
  display: flex; /* 각 페이지에 flex 사용 가능 */
  flex-direction: column;
  height: auto;
`;

function AppRouter() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isLandingPage = location.pathname === "/";

  if (isLandingPage) {
    return (
      <>
        <GlobalStyle />
        <Landing />
      </>
    );
  }

  return (
    <AppWrapper>
      <GlobalStyle />
      <TwilioCallReceiver />
      {!isAuthPage && <Navbar />}
      <ContentWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Main />} />
          <Route path="/callLog" element={<CallLog />} />
          <Route path="/callList" element={<CallList />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </ContentWrapper>
    </AppWrapper>
  );
}

export default AppRouter;
