import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
//   align-items: stretch;
  font-family: 'Arial', sans-serif;
`;

// 왼쪽 패널
const LeftPanel = styled.div`
  width: 50%;
  background: #F3F6FE;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 3rem;
`;

const LeftText = styled.div`
  text-align: center;
  line-height: 2;
  font-size: 1.25rem;
`;

const Brand = styled.h1`
  margin-top: 2rem;
  font-size: 2rem;
  font-weight: bold;
`;

const Divider = styled.div`
  width: 1.5px;
  background-color: #DDD;
`;

const TitleWrapper = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RightPanel = styled.div`
  width: 50%;
  background: #F3F6FE;
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  background: white;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
  padding: 7rem;
  width: 40%;
//   max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  color: #5C24AF;
  margin-bottom: 1rem;
`;

const SubText = styled.p`
  text-align: left;
  margin-bottom: 4rem;
  font-weight: bold;
  font-size: 30px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 1rem;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #5C24AF;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;

const RightText = styled.a`
  font-size: 0.8rem;
  color: #6b7280;
  text-decoration: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #5C24AF;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background-color: #5C24AF;
  }
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 0.9rem;
`;

const Login = () => {
    return (
        <Container>
            <LeftPanel>
                <LeftText>
                    당신이 먼저 존중받는 상담,<br />
                    마음이 덜 다치는 상담,<br />
                    작은 안심이 되는 상담
                    <br />
                    <br />
                    지금 바로 함께해보세요.
                </LeftText>
                <Brand>온음</Brand>
            </LeftPanel>
            <Divider />
            <RightPanel>
                <TitleWrapper>
                    <Title>로그인</Title>
                </TitleWrapper>
                <LoginBox>

                    <SubText>당신의 상담을 온음이 지켜드립니다<br />로그인 후 시작하세요!</SubText>
                    <form>
                        <Input type="email" placeholder="이메일을 입력해주세요" />
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
                            아직 계정이 없으신가요? <Link to="/signin" style={{ color: '#6d28d9' }}>회원가입</Link>
                        </BottomText>
                    </form>
                </LoginBox>
            </RightPanel>
        </Container>
    );
};

export default Login;