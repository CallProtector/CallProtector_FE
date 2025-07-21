import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import IncomingCallModal from "./Modal/IncomingCallModal"; // 모달 컴포넌트
import API from "../api/axiosInstance";

const TwilioCallReceiver = () => {
  const [showModal, setShowModal] = useState(false);
  const deviceRef = useRef(null);
  const connectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📡 TwilioCallReceiver mounted!");
    console.log("✅ API URL:", process.env.REACT_APP_API_URL);

    const initTwilio = async () => {
      try {
        const res = await API.get("/api/token");
        const data = res.data;
        const accessToken = data.twilioAccessToken;
        console.log("응답 확인:", data);

        const device = new window.Twilio.Device(accessToken, { debug: true });
        deviceRef.current = device;

        device.on("ready", () => {
          console.log("✅ Device ready");
          window.Twilio.Device.audio?.speakerDevices.set("default");
        });

        device.on("incoming", (conn) => {
          console.log("📞 수신:", conn.parameters.From);
          connectionRef.current = conn;
          setShowModal(true);
        });

        device.on("connect", () => {
          console.log("🔊 통화 연결됨");
          setShowModal(false);
          navigate("/callLog", { state: { callAccepted: true } });
        });

        device.on("disconnect", () => {
          console.log("❌ 통화 종료");
          setShowModal(false);
        });

        device.on("error", (err) => {
          console.error("🚨 Twilio 오류:", err);
          setShowModal(false);
        });
      } catch (err) {
        console.error("❌ 초기화 실패:", err);
      }
    };

    initTwilio();

    return () => {
      deviceRef.current?.destroy();
    };
  }, []);

  const handleAccept = () => {
    if (connectionRef.current) {
      connectionRef.current.accept();
      console.log("✅ 수신 수락됨");
      setShowModal(false);
    }
  };

  const handleReject = () => {
    if (connectionRef.current) {
      connectionRef.current.reject();
      console.log("❌ 수신 거절됨");
      setShowModal(false);
    }
  };

  return (
    <>
      <IncomingCallModal
        show={showModal}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </>
  );
};

export default TwilioCallReceiver;
