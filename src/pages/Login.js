import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PurpleWave from '../components/PurpleWave';
import Bubble from '../components/Bubble';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const LeftPanel = styled.div`
  position: relative; 
  width: 50%;
  background: #F3F6FE;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 48px 0px 48px;
  overflow: hidden; 
`;

const LeftText = styled.div`
  text-align: center;
  line-height: 2;
  font-size: 35px;
  font-weight: bold;
  margin-top: 100px;
`;

const LeftSubtext = styled.div`
  text-align: center;
  line-height: 2;
  font-size: 30px;
  margin-top: 20px;
`;

const Brand = styled.h1`
  margin-top: 40px;
  font-size: 40px;
  font-weight: bold;
    color: #5C24AF;

`;

const Divider = styled.div`
  width: 1.5px;
  background-color: #DDD;
`;

const TitleWrapper = styled.div`
  margin-bottom: 24px;
  text-align: center;
`;

const RightPanel = styled.div`
  width: 50%;
  background: #F3F6FE;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  background: white;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  padding: 45px;
  width: 65%;
  height: 65%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #5C24AF;
  margin-bottom: 26px;
  font-size: 35px;
`;

const SubText = styled.p`
  text-align: left;
  margin-top: 10px;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 30px;
`;

const InputTitle = styled.div`
  font-size: 17px;
  font-weight:bold;
  margin-bottom: 5px;
  margin-left: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 17px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #5C24AF;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 3px 30px 3px;
`;

const CheckboxLabel = styled.label`
  font-size: 15px;
  display: flex;
  align-items: center;
`;

const RightText = styled.a`
  padding-top: 4px;
  font-size: 15px;
  color: #6b7280;
  text-decoration: none;
`;

const Button = styled.button`
  width: 100%;
  height: 55px;
  padding: 12px;
  background-color: #5C24AF;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 38px;
  font-size: 17px;
  box-sizing: border-box;
  &:hover {
    background-color: #5C24AF;
  }
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 15px;
`;

const Login = () => {
  return (
    <Container>
      <LeftPanel>
        <PurpleWave />
        <Bubble size="27px" top="170px" right="80px" floating />
        <Bubble size="38px" top="210px" right="30px" floating />
        <LeftText>
          당신이 먼저 존중받는 상담<br />
          마음이 덜 다치는 상담<br />
          작은 안심이 되는 상담<br />
          .<br />
          .
        </LeftText>
        <LeftSubtext>
          지금 바로 함께해보세요
        </LeftSubtext>
        <Brand>온음</Brand>
      </LeftPanel>
      <Divider />
      <RightPanel>
        <TitleWrapper>
          <Title>로그인</Title>
        </TitleWrapper>
        <LoginBox>
          <SubText>당신의 상담을 온음이 지켜드립니다.<br />로그인 후 시작하세요!</SubText>
          <form>
            <InputTitle>이메일</InputTitle>
            <Input type="email" placeholder="이메일을 입력해주세요" />
            <InputTitle>비밀번호</InputTitle>
            <Input type="password" placeholder="비밀번호를 입력해주세요" />
            <CheckboxWrapper>
              <CheckboxLabel>
                <input type="checkbox" style={{ marginRight: '8px' }} />
                자동 로그인
              </CheckboxLabel>
              <RightText href="/recover">아이디 | 비밀번호 찾기</RightText>
            </CheckboxWrapper>
            <Button>로그인</Button>
            <BottomText>
              아직 계정이 없으신가요? <Link to="/signup" style={{ color: '#5C24AF' }}>회원가입</Link>
            </BottomText>
          </form>
        </LoginBox>
      </RightPanel>
    </Container>
  );
};

export default Login;