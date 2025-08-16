import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PurpleWave from '../components/PurpleWave';
import Bubble from '../components/Bubble';
import feat1 from '../assets/images/feat1.png';
import feat2 from '../assets/images/feat2.png';
import feat3 from '../assets/images/feat3.png';
import feat4 from '../assets/images/feat4.png';

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

const LandingWrapper = styled.div`
  width: 100%;
  background: linear-gradient(to bottom, rgb(249, 250, 255) 0%, rgb(217, 221, 248) 100%);
  overflow-x: hidden;
  overflow-y: clip; 
`;

const HeroSection = styled.section`
  position: relative;
  padding: 150px 40px 90px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 50px;
  font-weight: bold;
  color: black;
  margin: 200px 0 170px 0;
`;

const HeroSubtitle = styled.p`
  font-size: 38px;
  margin: 50px;
`;

const InfoSection = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
  padding: 100px 60px 150px 60px;
`;

const FadeInCard = styled.div`
  flex: 1 1 300px;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  text-align: center;
  padding: 60px 70px;
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  opacity: 0;
  transform: translateY(100px);
  transition: opacity 1.5s ease-out, transform 1.5s ease-out;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:not(:first-child) {
    margin-left: -70px;
  }
`;

const InfoTitle = styled.h3`
  font-size: 33px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const InfoText1 = styled.p`
  font-size: 27px;
  // font-weight: bold;
  margin-bottom: 30px;
`;

const InfoText2 = styled.p`
  font-size: 23px;
  margin-bottom: 10px;
`;

const StepSection = styled.section`
  text-align: center;
  padding: 50px 60px;
  position: relative;
  opacity: 0;
  transform: translateY(100px);
  transition: opacity 1.5s ease-out, transform 1.5s ease-out;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StepTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;
  margin: 70px 0 130px 0;
`;

const StepFlowContainer = styled.div`
  position: relative;
  max-width: 1500px;
  margin: 100px auto;
`;

const StepCurve = styled.svg`
  width: 100%;
  height: 350px;
`;

const StepItem = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
  text-align: center;

  ${({ posX, posY }) => `
    left: ${posX}%;
    top: ${posY}%;
    transform: translate(-50%, -50%);
  `}
`;

const StepIcon = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 20px;
`;

const StepText = styled.p`
  font-size: 26px;
  width: 240px;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 100px 0 200px 0;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 1.5s ease-out, transform 1.5s ease-out;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CTAText = styled.p`
  font-size: 40px;
  margin-bottom: 150px;
  color: #111;
`;

const CTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 28px;
  background-color: #5C24AF;
  color: #fff;
  border: none;
  border-radius: 13px;
  font-weight: bold;
  font-size: 30px;
  cursor: pointer;
  &:hover {
    background-color: #6946e7;
  }
`;

const LandingPage = () => {
  const [infoRef1, visible1] = useInView();
  const [infoRef2, visible2] = useInView();
  const [infoRef3, visible3] = useInView();
  const [stepRef, stepVisible] = useInView();
  const [ctaRef, ctaVisible] = useInView();

  const navigate = useNavigate();

  const handleStart = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/main");  // 로그인 되어있으면 바로 메인으로
    } else {
      navigate("/login"); // 아니면 로그인 페이지로
    }
  };


  return (
    <LandingWrapper>
      <HeroSection>
        <PurpleWave />
        <Bubble size="45px" top="170px" right="160px" floating />
        <Bubble size="70px" top="230px" right="70px" floating />

        <HeroTitle >상담원은 보호받을 권리가 있습니다.</HeroTitle>
        <HeroSubtitle>
          “상담 환경, 이제는 바꿔야 하지 않을까요?”<br />
          안심하고 일할 수 있도록, 저희가 함께하겠습니다.
        </HeroSubtitle>

        <Bubble size="50px" top="800px" left="70px" floating />
      </HeroSection>

      <InfoSection>
        <FadeInCard ref={infoRef1} className={visible1 ? 'visible' : ''}>
          <InfoTitle>Who?</InfoTitle>
          <InfoText1>고객의 말에 상처받는 <br /> 상담원들을 위해</InfoText1>
          <InfoText2>감정노동에서 벗어나,<br /> 안전한 상담 환경을 만들어요.</InfoText2>
        </FadeInCard>
        <FadeInCard ref={infoRef2} className={visible2 ? 'visible' : ''}>
          <InfoTitle>What?</InfoTitle>
          <InfoText1>욕설 및 부당한 요구 감지, <br />경고와 법률 대응까지</InfoText1>
          <InfoText2>상담원을 대신해 AI가 <br />빠르고 정확하게 대응해요.</InfoText2>
        </FadeInCard>
        <FadeInCard ref={infoRef3} className={visible3 ? 'visible' : ''}>
          <InfoTitle>Why?</InfoTitle>
          <InfoText1>지금도 누군가는<br /> 상처받고 있으니까요.</InfoText1>
          <InfoText2>도입 즉시,<br /> 상담 환경이 달라집니다.</InfoText2>
        </FadeInCard>
      </InfoSection>

      <Bubble size="80px" top="1600px" right="70px" floating />

      <StepSection ref={stepRef} className={stepVisible ? 'visible' : ''}>
        <StepTitle>“상담원을 지키는 기술, 작지만 강력한 기능들”</StepTitle>
        <StepFlowContainer>
          <StepCurve viewBox="0 0 1600 600" preserveAspectRatio="none">
            <path
              d="M0,300
              C100,50 300,50 400,300
              C500,550 700,550 800,300
              C900,50 1100,50 1200,300
              C1300,550 1500,550 1600,300"
              stroke="#757575"
              strokeWidth="1"
              fill="transparent"
            />
            <ellipse cx="200" cy="114" rx="7" ry="10" fill="#5C24AF" />
            <ellipse cx="600" cy="488" rx="7" ry="10" fill="#5C24AF" />
            <ellipse cx="1000" cy="114" rx="7" ry="10" fill="#5C24AF" />
            <ellipse cx="1400" cy="488" rx="7" ry="10" fill="#5C24AF" />
          </StepCurve>

          <StepItem posX={12} posY={60}>
            <StepIcon src={feat1} alt="실시간 욕설 감지" style={{ width: '150px', height: '105px' }} />
            <StepText>실시간 욕설 감지<br />및 자동 음소거</StepText>
          </StepItem>

          <StepItem posX={37.5} posY={35}>
            <StepIcon src={feat2} alt="RAG 챗봇" style={{ width: '200px', height: '120px' }} />
            <StepText>RAG 법률 챗봇으로<br />실시간 대응</StepText>
          </StepItem>

          <StepItem posX={63} posY={60}>
            <StepIcon src={feat3} alt="대화 요약" />
            <StepText>통화 후 대화 내용<br />& 자동 요약 제공</StepText>
          </StepItem>

          <StepItem posX={88} posY={35}>
            <StepIcon src={feat4} alt="고객관리" style={{ width: '170px', height: '120px' }} />
            <StepText>효율적인 고객관리</StepText>
          </StepItem>
        </StepFlowContainer>
      </StepSection>

      <Bubble size="40px" top="2450px" right="130px" floating />
      <Bubble size="50px" top="2700px" left="100px" floating />
      <Bubble size="30px" top="2770px" left="150px" floating />

      <CTASection ref={ctaRef} className={ctaVisible ? 'visible' : ''}>
        <CTAText>
          실시간 음성 필터링부터 법률 대응까지,<br />
          상담원을 위한 든든한 보호막을 지금 만나보세요.
        </CTAText>
        <CTAButton onClick={handleStart}>➔ 서비스 시작하기</CTAButton>
      </CTASection>
    </LandingWrapper>
  );
};

export default LandingPage;
