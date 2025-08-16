import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import IncomingCallModal from "./Modal/IncomingCallModal";
import axios from "axios";
import { useWebSocket } from "../contexts/WebSocketContext";

const TwilioCallReceiver = () => {
  const [showModal, setShowModal] = useState(false);
  const deviceRef = useRef(null);
  const connectionRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // 💡 WebSocketContext의 sessionInfo와 setSessionInfo 사용
  const {
    sessionInfo,
    setSessionInfo,
    disconnectWebSocket,
    registerTwilioRefs,
    isCallEnded,
  } = useWebSocket();

  useEffect(() => {
    const jwtToken = localStorage.getItem("accessToken");
    console.log("🔑 jwtToken:", jwtToken);
    if (!jwtToken) return;

    const initTwilio = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/token`, {
      // const res = await axios.get(`http://localhost:8080/api/token`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const twilioAccessToken = res.data.result.twilioAccessToken;
      const device = new window.Twilio.Device(twilioAccessToken, {
        debug: true,
      });
      deviceRef.current = device;

      device.on("ready", () => {
        console.log("✅ Device ready");
        window.Twilio.Device.audio?.speakerDevices.set("default");
      });

      device.on("incoming", (conn) => {
        console.log("📞 수신:", conn.parameters.From);
        console.log("🆔 originalInboundCallSid:", conn.parameters.CallSid);
        console.log("☎️ callerNumber:", conn.parameters.From);

        connectionRef.current = conn;

        // 컨텍스트에 Twilio 객체 등록
        registerTwilioRefs(deviceRef.current, connectionRef.current);

        // connection 레벨 이벤트로 종료 감지
        conn.on("accept", () => console.log("✅ 연결 accept"));
        conn.on("disconnect", () => {
          console.log("🔚 connection.disconnect");
          disconnectWebSocket(); // Twilio 종료 이벤트를 받은 뒤 WS 닫기
        });
        conn.on("cancel", () => {
          console.log("❌ 수신 취소");
          disconnectWebSocket();
        });
        setShowModal(true);
      });

      device.on("disconnect", () => {
        console.log("❌ Twilio 통화 종료");
        setShowModal(false);
      });

      device.on("cancel", () => {
        console.log("❌ 수신 통화 취소됨 (고객이 끊음)");
        setShowModal(false);
        disconnectWebSocket();
      });

      device.on("error", (err) => {
        console.error("🚨 Twilio 오류:", err);
        setShowModal(false);
      });
    };

    initTwilio();

    return () => {
      console.log("🧹 TwilioCallReceiver 언마운트: 리소스 정리");
      if (deviceRef.current) {
        deviceRef.current.destroy(); // Twilio 디바이스 파괴
      }
    };
  }, []);

  const handleAccept = () => {
    if (connectionRef.current) {
      connectionRef.current.accept();
      console.log("✅ 수신 수락됨");
      setShowModal(false);

      // 💡 setSessionInfo가 아닌, 전역 상태 sessionInfo를 사용
      if (sessionInfo) {
        navigate("/callLog", {
          state: {
            callAccepted: true,
            ...sessionInfo,
          },
        });
      } else {
        console.warn("⚠️ sessionInfo 없음!");
      }
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
    <IncomingCallModal
      show={showModal}
      onAccept={handleAccept}
      onReject={handleReject}
      connectionRef={connectionRef}
    />
  );
};

export default TwilioCallReceiver;
