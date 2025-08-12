import React from "react";
import WarningModal from "../components/Modal/WarningModal";

const Main = () => {
  let name = "김덕우"; // 추후 로그인 정보로 대체

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.textBox}>
          <p style={styles.text}>
            <span style={styles.highlight}>온음</span>이 {name} 상담원님의
            <br />
            건강한 근무 환경을
            <br />
            지원합니다.
          </p>
        </div>
      </div>

      {/* 💥 무조건 WarningModal 렌더링(디자인 확인용) */}
      {/*<WarningModal />*/}
    </div>
  );
};

const styles = {
  page: {
    height: "100%",
    backgroundColor: "#f3f6fe",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  textBox: {
    paddingLeft: "80px",
    textAlign: "left",
    lineHeight: "1.4",
  },
  text: {
    fontSize: "68px",
    fontWeight: "700",
    color: "#111",
    margin: 0,
    whiteSpace: "pre-line",
  },
  highlight: {
    color: "#e6007e",
  },
};

export default Main;
