import React from "react";
import styled from "styled-components";

const WaveTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 140px;
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
        d="M0,160 C360,80 720,230 1080,160 C1260,120 1440,170 1440,155 L1440,0 L0,0 Z"
      />
    </WaveSvg>
  </WaveTop>
);


export default PurpleWave;