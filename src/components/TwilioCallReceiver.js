// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import IncomingCallModal from "./Modal/IncomingCallModal";
// import axios from "axios";
// import { useWebSocket } from "../contexts/WebSocketContext";

// const TwilioCallReceiver = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [sessionInfo, setSessionInfo] = useState(null); // 세션 정보 저장
//   const deviceRef = useRef(null);
//   const connectionRef = useRef(null);
//   const wsRef = useRef(null);
//   const navigate = useNavigate();
//   const API_BASE_URL = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     console.log("📡 TwilioCallReceiver mounted!");

//     // WebSocket 먼저 연결
//     const ws = new WebSocket("wss://callprotect.site/ws/stt?userId=1");
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("🌐 WebSocket 연결됨");
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log("📩 WebSocket 메시지 수신:", data);

//         if (data.type === "sessionInfo") {
//           setSessionInfo({
//             sessionCode: data.sessionCode,
//             createdAt: data.createdAt,
//             totalAbuseCnt: data.totalAbuseCnt,
//           });
//           console.log("✅ sessionInfo 수신 완료");
//         }
//       } catch (err) {
//         console.error("⚠️ WebSocket 메시지 처리 오류:", err);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("🛑 WebSocket 에러:", err);
//     };

//     ws.onclose = () => {
//       console.log("🔌 WebSocket 연결 종료");
//     };

//     // Twilio 초기화
//     const initTwilio = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/token`);
//         const accessToken = res.data.result.twilioAccessToken;

//         const device = new window.Twilio.Device(accessToken, { debug: true });
//         deviceRef.current = device;

//         device.on("ready", () => {
//           console.log("✅ Device ready");
//           window.Twilio.Device.audio?.speakerDevices.set("default");
//         });

//         device.on("incoming", (conn) => {
//           console.log("📞 수신:", conn.parameters.From);
//           connectionRef.current = conn;
//           setShowModal(true);
//         });

//         device.on("disconnect", () => {
//           console.log("❌ 통화 종료");
//           setShowModal(false);
//         });

//         device.on("error", (err) => {
//           console.error("🚨 Twilio 오류:", err);
//           setShowModal(false);
//         });
//       } catch (err) {
//         console.error("❌ Twilio 초기화 실패:", err);
//       }
//     };

//     initTwilio();

//     return () => {
//       deviceRef.current?.destroy();
//       wsRef.current?.close();
//     };
//   }, []);

//   const handleAccept = () => {
//     if (connectionRef.current && wsRef.current) {
//       connectionRef.current.accept();
//       console.log("✅ 수신 수락됨");

//       setShowModal(false);

//       // sessionInfo를 기다렸다가 이동
//       const interval = setInterval(() => {
//         if (sessionInfo) {
//           navigate("/callLog", {
//             state: {
//               callAccepted: true,
//               ...sessionInfo,
//             },
//           });
//           clearInterval(interval);
//         }
//       }, 100);
//     }
//   };

//   const handleReject = () => {
//     if (connectionRef.current) {
//       connectionRef.current.reject();
//       console.log("❌ 수신 거절됨");
//       setShowModal(false);
//     }
//   };

//   return (
//     <IncomingCallModal
//       show={showModal}
//       onAccept={handleAccept}
//       onReject={handleReject}
//     />
//   );
// };

// export default TwilioCallReceiver;

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

  // 🔄 Context에서 세션 정보 받아오기
  const context = useWebSocket();
  console.log("🧪 useWebSocket 결과:", context);
  const { sessionInfo } = context || {};

  useEffect(() => {
    console.log("📡 TwilioCallReceiver mounted!");

    const initTwilio = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/token`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const accessToken = res.data.result.twilioAccessToken;
        const userId = res.data.result.userId;
        console.log("✅ Twilio 토큰 수신 완료:", twilioAccessToken);
        console.log("✅ userId:", userId);

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

        device.on("disconnect", () => {
          console.log("❌ 통화 종료");
          setShowModal(false);
        });

        device.on("error", (err) => {
          console.error("🚨 Twilio 오류:", err);
          setShowModal(false);
        });
      } catch (err) {
        console.error("❌ Twilio 초기화 실패:", err);
      }
    };

    initTwilio();

    return () => {
      deviceRef.current?.destroy();
    };
  }, [API_BASE_URL]);

  const handleAccept = () => {
    if (connectionRef.current) {
      connectionRef.current.accept();
      console.log("✅ 수신 수락됨");
      setShowModal(false);

      // sessionInfo 수신 후 navigate
      const interval = setInterval(() => {
        if (sessionInfo) {
          navigate("/callLog", {
            state: {
              callAccepted: true,
              ...sessionInfo,
            },
          });
          clearInterval(interval);
        }
      }, 100);
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
    />
  );
};

export default TwilioCallReceiver;
