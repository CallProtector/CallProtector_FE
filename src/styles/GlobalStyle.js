import { createGlobalStyle } from 'styled-components';
import IBMPlexRegular from '../assets/fonts/IBMPlexSansKR-Regular.ttf';
import IBMPlexBold from '../assets/fonts/IBMPlexSansKR-Bold.ttf';
import PretendardRegular from '../assets/fonts/Pretendard-Regular.woff';
import PretendardBold from '../assets/fonts/Pretendard-Bold.woff';

const GlobalStyle = createGlobalStyle`
  // @font-face {
  //   font-family: 'IBM Plex Sans KR';
  //   src: local('IBM Plex Sans KR'), url(${IBMPlexRegular}) format('truetype');
  //   font-weight: 400;
  //   font-style: normal;
  // }

  //  @font-face {
  //   font-family: 'IBM Plex Sans KR';
  //   src: local('IBM Plex Sans KR Bold'), url(${IBMPlexBold}) format('truetype');
  //   font-weight: 700;
  //   font-style: normal;
  // }

  @font-face {
    font-family: 'Pretendard-Regular';
    src: local('Pretendard-Regular'), url(${PretendardRegular}) format('woff');
    font-weight: 400;
    font-style: normal;
}

    @font-face {
    font-family: 'Pretendard-Bold';
    src: local('Pretendard-Bold'), url(${PretendardBold}) format('woff');
    font-weight: 700;
    font-style: normal;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Pretendard-Regular', sans-serif;
  }

  body {
    background-color: #f3f6fe;
  }
`;

export default GlobalStyle;
