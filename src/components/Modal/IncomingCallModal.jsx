import React from "react";
import styled from "styled-components";
import normalImg from "../../assets/images/call_normal.jpg";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); // dim 처리
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  max-width: 1200px;
  min-height: 750px;
  width: 80%;
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  max-width: 600px;
  width: auto;
  height: 380px;
  flex-shrink: 0;
  object-fit: contain;
  margin-left: 50px;
  margin-right: 80px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-right: 50px;

  p {
    font-size: 45px;
    font-weight: bold;
    text-align: left;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 35px;
`;

const Button = styled.button`
  font-size: 30px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:first-child {
    background-color: #f7f2fa;
    color: #5c24af;
    width: 270px;
    height: 90px;
  }

  &:last-child {
    background-color: #5c24af;
    color: #f7f2fa;
    width: 270px;
    height: 90px;
  }
`;

const IncomingCallModal = ({ show, onAccept, onReject }) => {
  if (!show) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <Image src={normalImg} alt="call_normal" />{" "}
        <ContentBox>
          <p>
            고객이 상담을 요청했습니다.
            <br />
            통화를 연결하겠습니다.
          </p>
          <ButtonGroup>
            <Button onClick={onReject}>아니오</Button>
            <Button onClick={onAccept}>예</Button>
          </ButtonGroup>
        </ContentBox>
      </ModalContainer>
    </ModalBackground>
  );
};

export default IncomingCallModal;
