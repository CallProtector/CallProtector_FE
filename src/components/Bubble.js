import React from "react";
import styled, { keyframes, css } from "styled-components";


const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const StyledBubble = styled.div`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #8B5CF6, #3E1877);
  z-index: 2;
  opacity: 0.9;
  width: ${({ size }) => size || '20px'};
  height: ${({ size }) => size || '20px'};
  top: ${({ top }) => top || '0px'};
  right: ${({ right }) => right || 'auto'};
  left: ${({ left }) => left || 'auto'};
  animation: ${({ floating }) =>
  floating
    ? css`${float} 4s ease-in-out infinite`
    : 'none'};
`;

const Bubble = ({ size, top, right, left, floating = false }) => {
  return <StyledBubble size={size} top={top} right={right} left={left}  />;
};

export default Bubble;

