import React, { useState } from 'react';
import styled from 'styled-components';

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
    const [verified, setVerified] = useState(false);
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resendCount, setResendCount] = useState(0);
    const [message, setMessage] = useState('');

  const handleEmailSend = () => {
        alert(resendCount > 0 ? '인증번호가 재발송되었습니다.' : '인증번호가 발송되었습니다.');
    setStep(2);
    setResendCount(prev => prev + 1);
    setMessage(resendCount > 0 ? '인증번호가 재발송되었습니다.' : '인증번호가 발송되었습니다.');
  };
    const handleCodeVerify = () => {
        alert('인증이 완료되었습니다.');
        setStep(3);
    }; const isCodeValid = code.length > 0;
    const isPasswordValid = password.length >= 8 && password === confirmPassword;

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
                        <Button disabled={!isPasswordValid}>회원가입</Button>
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