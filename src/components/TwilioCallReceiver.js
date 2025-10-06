import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import IncomingCallModal from "./Modal/IncomingCallModal";
import axios from "axios";
import { useWebSocket } from "../contexts/WebSocketContext";

import { Device } from "@twilio/voice-sdk";

function parseQueryParams(queryString) {
  const params = {};
  if (!queryString) return params;

  queryString.split("&").forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });

  return params;
}

const TwilioCallReceiver = () => {
  const [showModal, setShowModal] = useState(false);
  const deviceRef = useRef(null);
  const connectionRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const {
    sessionInfo,
    setSessionInfo,
    disconnectWebSocket,
    registerTwilioRefs,
    isCallEnded,
    wsRef,
    connectWebSocket,
    // ✅ 추가
    lastPatchedCallSidRef,
  } = useWebSocket();

  const sentRef = useRef(false); // WS 중복 전송 방지

  useEffect(() => {
    const jwtToken = localStorage.getItem("accessToken");
    console.log("🔑 jwtToken:", jwtToken);
    if (!jwtToken) return;

    const initTwilio = async () => {
      const res = await axios.get(`${API_BASE_URL}/api/token`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const twilioAccessToken = res.data.result.twilioAccessToken;

      const device = new Device(twilioAccessToken, {
        logLevel: 1,
      });
      deviceRef.current = device;

      device.on("registered", () => {
        console.log("✅ Device ready");
        device.audio.speakerDevices.set("default");
      });

      device.on("incoming", (conn) => {
        console.log("📞 수신:", conn.parameters.From);

        // 라벨 명확화
        const agentLegCallSid = conn.parameters.CallSid; // 상담원 레그
        const q = parseQueryParams(conn.parameters.Params);
        const initialCallSid = q.initialCallSid; // 원본 인바운드
        console.log("🧩 agentLegCallSid(상담원 레그):", agentLegCallSid);
        console.log("🆔 initialCallSid(원본 인바운드):", initialCallSid);

        connectionRef.current = conn;

        // 컨텍스트에 Twilio 객체 등록
        registerTwilioRefs(deviceRef.current, connectionRef.current);

        conn.on("accept", () => {
          console.log("✅ 연결 accept");
          
          setTimeout(() => {
              const audioElements = document.querySelectorAll("audio");
              if (audioElements.length > 0) {
                  window.__twilioRemoteAudioElement = audioElements[audioElements.length - 1];
                  console.log("🔊 Twilio Remote Audio Element 참조 저장됨:", window.__twilioRemoteAudioElement);
              } else {
                  console.error("❌ conn.on(accept): <audio> 엘리먼트를 찾을 수 없습니다.");
              }
          }, 100);
        });
        conn.on("disconnect", () => {
          console.log("🔚 connection.disconnect");
          delete window.__twilioRemoteAudioElement;
          disconnectWebSocket(); // Twilio 종료 이벤트를 받은 뒤 WS 닫기
        });
        conn.on("cancel", () => {
          console.log("❌ 수신 취소");
          delete window.__twilioRemoteAudioElement;
          disconnectWebSocket();
        });
        setShowModal(true);
      });

      device.on("disconnect", () => {
        console.log("❌ Twilio 통화 종료");
        delete window.__twilioRemoteAudioElement;
        setShowModal(false);
      });

      device.on("cancel", () => {
        console.log("❌ 수신 통화 취소됨 (고객이 끊음)");
        delete window.__twilioRemoteAudioElement;
        setShowModal(false);
        disconnectWebSocket();
      });

      device.on("error", (err) => {
        console.error("🚨 Twilio 오류:", err);
        delete window.__twilioRemoteAudioElement;
        setShowModal(false);
      });

      device.register();
    };

    initTwilio();

    return () => {
      console.log("🧹 TwilioCallReceiver 언마운트: 리소스 정리");
      if (deviceRef.current) {
        deviceRef.current.destroy(); // Twilio 디바이스 파괴
      }
      delete window.__twilioRemoteAudioElement;
    };
  }, []);

  const handleAccept = () => {
    // WS 연결 보장 (OPEN이면 내부에서 return)
    connectWebSocket();

    if (!connectionRef.current) return;

    // ✅ PATCH에 넣었던 값을 그대로 사용 (동일성 보장)
    const initialCallSid = lastPatchedCallSidRef.current;
    console.log("handleAccept -> using LOCKED callSid:", initialCallSid);

    // 1) 먼저 Twilio 수락
    connectionRef.current.accept();
    console.log("✅ 수신 수락됨");
    setShowModal(false);

    // 2) WS OPEN 보장 + accept 이후 150ms 지연 후 전송
    const doSend = () => {
      if (sentRef.current) return;
      const ws = wsRef.current;
      if (!ws) {
        console.warn("⚠️ wsRef 없음");
        return;
      }
      const payload = JSON.stringify({
        event: "callAccepted",
        callSid: initialCallSid,
      });

      console.log("🪣서버로 전송(TwilioCallReceiver): ", payload);

      const reallySend = () => {
        try {
          ws.send(payload);
          sentRef.current = true;
          console.log(
            "📨 WS 전송(callAccepted, after accept). callSid:",
            initialCallSid
          );
        } catch (e) {
          console.error("❌ WS send 실패:", e);
        }
      };

      if (ws.readyState === WebSocket.OPEN) {
        setTimeout(reallySend, 150);
      } else if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener("open", () => setTimeout(reallySend, 150), {
          once: true,
        });
        console.log("⏳ WS OPEN 대기 → callAccepted 예약");
      } else {
        console.warn("⚠️ WS CLOSED/CLOSING 상태");
      }
    };

    doSend();

    // 내비게이션은 기존대로
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
