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
            <span style={styles.highlight}>온음</span>이
            <br />
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
            style={{ width: "100%", height: "auto" }}
            speed={1}
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
    justifyContent: "space-between",
    padding: "0 80px",
    gap: "40px", // 텍스트-이미지 간 간격
    flexWrap: "wrap", // 화면 작으면 세로 배치
  },
  textBox: {
    flex: "1 1 50%", // 최소 50% 차지
    textAlign: "left",
    lineHeight: "1.7",
    maxWidth: "600px", // 최대 폭 제한
  },
  text: {
    fontSize: "60px",
    fontWeight: "bold",
    color: "black",
  },
  highlight: {
    color: "#e6007e",
  },
  lottieBox: {
    flex: "1 1 50%", // 고정 폭
    maxWidth: "900px", // 최대 폭 제한
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Main;
