import React, { useEffect, useState } from "react";
import WarningModal from "../components/Modal/WarningModal";
import Lottie from "react-lottie-player";
import contactUsLottie from "../assets/images/contact-us.json";

const Main = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    // ✅ 로그인 시 저장해 둔 값 읽기
    const token = localStorage.getItem("accessToken");
    const savedName = localStorage.getItem("userName");

    if (!token) {
      console.warn("⚠️ accessToken 없음. 로그인 후 이용해주세요.");
      // 필요하면 여기서 로그인 페이지로 이동 처리
      // navigate("/login");  // useNavigate 사용 시
    }

    if (savedName) {
      setName(savedName);
    } else {
      // 이름이 없다면 임시 fallback
      setName("");
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.textBox}>
          <p style={styles.text}>
            <span style={styles.highlight}>온음</span>이{" "}
            {name ? `${name} 상담원님의` : "상담원님의"}
            <br />
            건강한 근무 환경을
            <br />
            지원합니다.
          </p>
        </div>

        {/* ⬇️ Lottie 삽입 영역 */}
        <div style={styles.lottieBox} aria-label="메인 애니메이션">
          <Lottie
            loop
            play
            animationData={contactUsLottie}
            style={{ width: 900, height: 360 }}
            speed={1} // 필요시 속도 조절
          />
        </div>
      </div>

      {/* 필요 시 경고 모달 */}
      {/* <WarningModal /> */}
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
  lottieBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 900,
    minHeight: 500,
  },
};

export default Main;
