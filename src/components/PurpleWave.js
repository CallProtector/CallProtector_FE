import React from "react";
import styled from "styled-components";

const WaveTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 200px;
  overflow: hidden;
  line-height: 0;
  z-index: 1;
`;

const WaveSvg = styled.svg`
  position: relative;
  display: block;
  width: 100%;
  height: 250px;
`;

const PurpleWave = () => (
  <WaveTop>
    <WaveSvg viewBox="0 0 1440 320" preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad)"
        d="M0,200 
     C360,50 720,350 1080,150 
     C1260,50 1440,200 1440,185 
     L1440,0 
     L0,0 
     Z"      />
    </WaveSvg>
  </WaveTop>
);


export default PurpleWave;