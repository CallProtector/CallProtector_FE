import React from "react";
import styled from "styled-components";
import logoImg from "../assets/images/logo.png"; 
import { useLocation, useNavigate } from "react-router-dom";

const NavbarWrapper = styled.nav`
  width: 100%;
  height: 60px;
  top: 0;
  left: 0;
  background-color: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 999;
`;

const Logo = styled.img`
  height: 130px;
`;

const Menu = styled.ul`
  display: flex;
  gap: 160px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  font-size: 18px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  &:hover {
    color: #5C24AF; 
  }
`;

const LogoutButton = styled.button`
  border: 1px solid #ddd;
  background: transparent;
  color: #000;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    color: #333;
    border-color: #333;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/";
  const navigate = useNavigate();

  if (isAuthPage) return null; 

   const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    alert("로그아웃이 완료되었습니다. 로그인 페이지로 이동합니다.");

    // 로그인 페이지로 이동
    navigate("/login");
  };
  return (
    <NavbarWrapper>
      <Logo onClick={() => navigate('/main')} src={logoImg} alt="온음 로고" />
      <Menu>
        <MenuItem onClick={() => navigate('/')}>서비스 소개</MenuItem>
        <MenuItem onClick={() => navigate('/callList')}>상담내역</MenuItem>
        <MenuItem onClick={() => navigate('/chatbot')}>AI 챗봇</MenuItem>
      </Menu>
      <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
    </NavbarWrapper>
  );
};

export default Navbar;
