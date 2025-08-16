import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px;
  font-family: 'Arial', sans-serif;
  background-color: #F3F6FE;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 35px;
  font-weight: bold;
  color: #5C24AF;
  margin-bottom: 50px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 520px;
`;

const InputTitle = styled.div`
  font-size: 17px;
  font-weight:bold;
  margin-bottom: 5px;
  margin-left: 8px;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 5px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 17px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #5C24AF;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 60px;
  padding: 12px;
  background-color: ${props => props.disabled ? '#ccc' : '#5C24AF'};
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  font-size: 17px;
  margin-top: 40px;
`;

const SmallButton = styled(Button)`
  width: 120px;
  font-size: 17px;
  margin-left: 12px;
  margin-top: 0px;
  margin-bottom: 5px;
`;

const Row = styled.div`
  display: flex;
  align-items: stretch;
  margin-bottom: 5px;
`;

const Message = styled.div`
  color: #5C24AF;
  font-size: 15px;
  margin-left: 8px;
  margin-bottom: 10px;
`;

const CheckMark = styled.span`
  color: #5C24AF;
  font-size: 18px;
  margin-left: 8px;
`;

const BottomText = styled.div`
  text-align: center;
  font-size: 17px;
  margin-top: 40px;
`;

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleEmailSend = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/send-code`, {
        email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // 성공 처리
      if (response.data?.isSuccess) {
        alert(resendCount > 0 ? '인증번호가 재발송되었습니다.' : '인증번호가 발송되었습니다.');
        setStep(2);
        setResendCount(prev => prev + 1);
        setMessage(response.data.result);
      }

    } catch (error) {
      console.error('이메일 인증 요청 실패:', error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 409 && data?.message === "이미 가입된 이메일입니다.") {
          alert("이미 가입된 이메일입니다.");
          return;
        }

        alert(`인증 요청 실패: ${data?.message || '알 수 없는 오류'}`);
      } else {
        alert('이메일 인증 요청 중 네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleCodeVerify = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/verify-code`, {
        // const response = await axios.post(`http://localhost:8080/api/auth/verify-code`, {
        email,
        code
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('응답 데이터:', response.data);

      if (response.data?.isSuccess) {
        alert(response.data.result || '이메일 인증이 완료되었습니다.');
        setStep(3);
      } else {
        alert(`인증 실패: ${response.data.message || '인증번호가 올바르지 않습니다.'}`);
      }
    } catch (error) {
      console.error('이메일 인증 코드 검증 실패:', error);
      alert('이메일 인증 중 오류가 발생했습니다.');
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        // const response = await axios.post(`http://localhost:8080/api/auth/signup`, {
        name,
        email,
        password,
        phone
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('회원가입 응답:', response.data);
      if (response.data?.isSuccess) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        alert(`회원가입 실패: ${response.data.message || '알 수 없는 오류'}`);
      }

    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  const isCodeValid = code.length > 0;
  const isPasswordValid = password.length >= 8 && password === confirmPassword;
  const isPhoneValid = /^\d{10,11}$/.test(phone);
  const isSignupValid = isPasswordValid && isPhoneValid;

  return (
    <Container>
      <Title>회원가입</Title>
      <Form>
        <InputTitle>이름</InputTitle>
        <Input placeholder="이름을 입력해주세요" value={name} onChange={e => setName(e.target.value)} disabled={step > 1} />
        <InputTitle>이메일</InputTitle>
        <Row>
          <Input
            placeholder="example@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={step > 1}
            style={{ flex: 1 }}
          />
          {step === 1 && <SmallButton onClick={handleEmailSend}>인증 요청</SmallButton>}
          {step >= 2 && (step === 2 ? <SmallButton onClick={handleEmailSend}>재전송</SmallButton> : <SmallButton disabled>완료</SmallButton>)}
        </Row>
        {step === 2 && (
          <>
            {message && <Message>{message}</Message>}
            <InputTitle>인증번호</InputTitle>
            <Input
              placeholder="인증번호를 입력해주세요"
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <Button onClick={handleCodeVerify} disabled={!isCodeValid}>다음</Button>
          </>
        )}
        {step === 3 && (
          <>
            <InputTitle>비밀번호</InputTitle>
            <Input
              placeholder="비밀번호를 입력해주세요"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Message>영문(대소문자), 숫자, 특수문자 포함 8~20자리</Message>
            <InputTitle>비밀번호 확인</InputTitle>
            <Input
              placeholder="비밀번호를 확인해주세요"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {password && confirmPassword && password === confirmPassword && (
              <CheckMark>✔</CheckMark>
            )}
            <InputTitle>전화번호</InputTitle>
            <Input
              placeholder="전화번호를 입력해주세요"
              type="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <Button disabled={!isSignupValid} onClick={handleSignup}>
              회원가입
            </Button>

          </>
        )}
      </Form>
      <BottomText>
        이미 회원이신가요? <a href="/login" style={{ color: '#5C24AF' }}>로그인</a>
      </BottomText>
    </Container>
  );
};

export default Signup;