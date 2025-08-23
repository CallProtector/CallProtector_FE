// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { playBeep, primeBeep } from "../utils/beep";
// import { duckTwilioOutput } from "../utils/duckTwilioOutput";

// const WebSocketContext = createContext();
// const BEEP_LEAD_MS = 150; // 비프 시작 전에 덕킹이 먼저 걸리도록 딜레이
// const DUCK_TAIL_MS = 100; // 비프 끝난 뒤 살짝 더 덕킹 유지(꼬리 방지)

// export const useWebSocket = () => useContext(WebSocketContext);

// export const WebSocketProvider = ({ children }) => {
//   const wsRef = useRef(null);
//   const [sessionInfo, setSessionInfo] = useState(null);
//   const [inboundLogs, setInboundLogs] = useState([]);
//   const [outboundLogs, setOutboundLogs] = useState([]);
//   const [totalAbuseCnt, setTotalAbuseCnt] = useState(0);
//   const [callLogs, setCallLogs] = useState([]); // 💡 중간/최종 결과가 모두 포함된 통합 로그
//   // ✅ 통화 종료 상태 추가
//   const [isCallEnded, setIsCallEnded] = useState(false);
//   const twilioDeviceRef = useRef(null);
//   const twilioConnectionRef = useRef(null);

//   // 🔧 통화 시작(또는 새 세션 진입) 시 전역 상태 리셋
//   const resetCallState = () => {
//     setIsCallEnded(false);
//     setCallLogs([]);
//     setTotalAbuseCnt(0);
//   };

//   // Twilio 객체 등록 (Receiver에서 호출)
//   const registerTwilioRefs = (device, connection) => {
//     twilioDeviceRef.current = device; // null을 넘기면 해제
//     twilioConnectionRef.current = connection;
//   };

//   // ✅ WebSocket 종료 함수
//   const disconnectWebSocket = () => {
//     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//       console.log("🛑 [disconnectWebSocket] 수동으로 WebSocket 연결 종료 시도");
//       wsRef.current.close();
//       setIsCallEnded(true);
//     } else {
//       console.warn("⚠️ WebSocket이 이미 닫혀있거나 연결되지 않음");
//     }
//   };

//   // Twilio → WS 순서로 종료
//   // 통화 및 WebSocket을 모두 종료
//   const endCallAndDisconnect = () => {
//     try {
//       const conn = twilioConnectionRef.current;
//       if (conn?.disconnect && conn.status?.() !== "closed") {
//         conn.disconnect(); // 1순위: 현재 연결 종료
//       } else if (twilioDeviceRef.current?.disconnectAll) {
//         twilioDeviceRef.current.disconnectAll(); // 2순위: 모든 연결 종료
//       } else {
//         console.warn("No Twilio refs, fallback to WS close");
//         disconnectWebSocket();
//       }
//     } catch (e) {
//       console.error("Twilio disconnect error:", e);
//       twilioDeviceRef.current?.disconnectAll?.();
//     }
//     setIsCallEnded(true);

//     // 안전망: Twilio 이벤트가 안 오면 일정 시간 뒤 WS 강제 종료
//     setTimeout(() => {
//       if (wsRef.current?.readyState === WebSocket.OPEN) {
//         console.log("⏱ Fallback closing WS");
//         wsRef.current.close();
//       }
//     }, 1500);
//   };

//   // ✅ 최초 사용자 제스처(아무 클릭) 시 한 번만 오디오 컨텍스트 프라임
//   useEffect(() => {
//     const handler = () => {
//       primeBeep();
//       window.removeEventListener("click", handler, true);
//     };
//     window.addEventListener("click", handler, true);
//     return () => window.removeEventListener("click", handler, true);
//   }, []);

//   useEffect(() => {
//     console.log("📡 WebSocketProvider mounted");

//     const userId = localStorage.getItem("userId");
//     const ws = new WebSocket(`wss://callprotect.site/ws/stt?userId=${userId}`);
//     console.log("🔗 WebSocket 연결 시도 URL:", ws);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("🌐 WebSocket 연결됨");
//       setIsCallEnded(false);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         console.log("📩 WebSocket 메시지 수신:", data);

//         switch (data.type) {
//           // ✅ 서버 비프 트리거 수신 → 즉시 로컬 비프 재생
//           case "beep": {
//             const ms = Number(data.durationMs) || 1000;
//             // 1) 통화 오디오 잠깐 음소거 (상담원 귀에만)
//             duckTwilioOutput(ms);
//             // 2) 비프 재생 (Web Audio – 별 경로)
//             playBeep(ms);

//             // 1) 덕킹을 먼저 적용 (비동기 복원, 비프보다 길게 +테일)
//             duckTwilioOutput(ms + DUCK_TAIL_MS /* , { mode: "mute" } */);
//             // 2) 짧은 리드 타임 뒤에 비프 재생 → 비프 초반 겹침 제거
//             setTimeout(() => {
//               playBeep(ms);
//             }, BEEP_LEAD_MS);

//             break;
//           }

//           case "sessionInfo":
//             console.log("✅ [sessionInfo] 수신됨:", data);

//             setSessionInfo({
//               sessionCode: data.sessionCode,
//               createdAt: data.createdAt,
//               totalAbuseCnt: data.totalAbuseCnt,
//             });
//             setTotalAbuseCnt(data.totalAbuseCnt);
//             break;

//           case "stt":
//             console.log("🗣️ [STT] 수신됨:", data.payload);
//             const { track, script, isFinal, isAbuse, abuseType } = data.payload;

//             setCallLogs((prevLogs) => {
//               const lastLogIndex = prevLogs.length - 1;
//               const newLog = { track, script, isFinal, isAbuse, abuseType };

//               // 마지막 로그가 현재 트랙의 중간 결과인 경우 덮어쓰기
//               if (
//                 lastLogIndex >= 0 &&
//                 prevLogs[lastLogIndex].track === track &&
//                 !prevLogs[lastLogIndex].isFinal
//               ) {
//                 // 이전 로그를 업데이트 (React 불변성 유지)
//                 const updatedLogs = [...prevLogs];
//                 updatedLogs[lastLogIndex] = newLog;
//                 return updatedLogs;
//               } else {
//                 // 새로운 로그를 추가
//                 return [...prevLogs, newLog];
//               }
//             });
//             break;

//           case "totalAbuseCntUpdate":
//             console.log("🚨 [totalAbuseCntUpdate] 수신됨:", data.totalAbuseCnt);
//             setTotalAbuseCnt(data.totalAbuseCnt);
//             break;

//           default:
//             console.warn("⚠️ 알 수 없는 type 수신:", data);
//         }
//       } catch (err) {
//         console.error("❌ WebSocket 메시지 처리 오류:", err, event.data);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("🛑 WebSocket 에러 발생:", err);
//     };

//     ws.onclose = () => {
//       console.log("🔌 WebSocket 연결 종료됨");
//       setIsCallEnded(true); // 종료 시점은 onclose에서 통일
//     };

//     return () => {
//       console.log("🧹 WebSocketProvider 언마운트, 연결 종료");
//       wsRef.current?.close();
//     };
//   }, []);

//   return (
//     <WebSocketContext.Provider
//       value={{
//         sessionInfo,
//         setSessionInfo,
//         inboundLogs,
//         outboundLogs,
//         callLogs,
//         totalAbuseCnt,
//         wsRef,
//         disconnectWebSocket,
//         isCallEnded,
//         endCallAndDisconnect, // 통합 종료
//         registerTwilioRefs,
//         resetCallState,
//       }}
//     >
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { playBeep, primeBeep } from "../utils/beep";
import { duckTwilioOutput } from "../utils/duckTwilioOutput";

const WebSocketContext = createContext();
const BEEP_LEAD_MS = 150; // 비프 시작 전에 덕킹이 먼저 걸리도록 딜레이
const DUCK_TAIL_MS = 100; // 비프 끝난 뒤 살짝 더 덕킹 유지(꼬리 방지)

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const wsRef = useRef(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [inboundLogs, setInboundLogs] = useState([]);
  const [outboundLogs, setOutboundLogs] = useState([]);
  const [totalAbuseCnt, setTotalAbuseCnt] = useState(0);
  const [callLogs, setCallLogs] = useState([]);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const twilioDeviceRef = useRef(null);
  const twilioConnectionRef = useRef(null); // 🔧 통화 시작(또는 새 세션 진입) 시 전역 상태 리셋

  const lastPatchedCallSidRef = useRef(null);
  const setLastPatchedCallSid = (sid) => {
    if (!sid) return;
    lastPatchedCallSidRef.current = sid;
    console.log("🔒 [LOCK] lastPatchedCallSid =", sid);
  };

  const resetCallState = () => {
    setIsCallEnded(false);
    setCallLogs([]);
    setTotalAbuseCnt(0);
  }; // Twilio 객체 등록 (Receiver에서 호출)

  const registerTwilioRefs = (device, connection) => {
    twilioDeviceRef.current = device;
    twilioConnectionRef.current = connection;
  }; // ✅ WebSocket 연결 함수 (추가)

  const connectWebSocket = () => {
    // 이미 연결되어 있거나 연결 중이라면 새로 연결하지 않음
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("🌐 WebSocket이 이미 연결되어 있습니다.");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("⚠️ userId가 없습니다. WebSocket 연결 실패.");
      return;
    }

    const ws = new WebSocket(`wss://callprotect.site/ws/stt?userId=${userId}`);
    wsRef.current = ws;

    // 🔎 디버깅용: 전역에서 직접 확인 가능
    window.__ws = ws;
    console.log("🔗 WS URL:", ws.url);

    ws.addEventListener("open", () => {
      console.log("🌐 WebSocket OPEN, readyState:", ws.readyState); // 1
    });
    ws.addEventListener("close", (e) => {
      console.log("🔌 WebSocket CLOSE", e.code, e.reason);
    });

    ws.onopen = () => {
      console.log("🌐 WebSocket 연결됨");
      setIsCallEnded(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket 메시지 수신:", data);

        switch (data.type) {
          case "beep": {
            const ms = Number(data.durationMs) || 1000;
            duckTwilioOutput(ms + DUCK_TAIL_MS);
            setTimeout(() => {
              playBeep(ms);
            }, BEEP_LEAD_MS);
            break;
          }
          case "sessionInfo":
            console.log("✅ [sessionInfo] 수신됨:", data);
            setSessionInfo({
              sessionCode: data.sessionCode,
              createdAt: data.createdAt,
              totalAbuseCnt: data.totalAbuseCnt,
            });
            setTotalAbuseCnt(data.totalAbuseCnt);
            break;
          case "stt":
            console.log("🗣️ [STT] 수신됨:", data.payload);
            const { track, script, isFinal, isAbuse, abuseType } = data.payload;
            setCallLogs((prevLogs) => {
              const lastLogIndex = prevLogs.length - 1;
              const newLog = { track, script, isFinal, isAbuse, abuseType };
              if (
                lastLogIndex >= 0 &&
                prevLogs[lastLogIndex].track === track &&
                !prevLogs[lastLogIndex].isFinal
              ) {
                const updatedLogs = [...prevLogs];
                updatedLogs[lastLogIndex] = newLog;
                return updatedLogs;
              } else {
                return [...prevLogs, newLog];
              }
            });
            break;
          case "totalAbuseCntUpdate":
            console.log("🚨 [totalAbuseCntUpdate] 수신됨:", data.totalAbuseCnt);
            setTotalAbuseCnt(data.totalAbuseCnt);
            break;
          default:
            console.warn("⚠️ 알 수 없는 type 수신:", data);
        }
      } catch (err) {
        console.error("❌ WebSocket 메시지 처리 오류:", err, event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("🛑 WebSocket 에러 발생:", err);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket 연결 종료됨");
      setIsCallEnded(true);
    };
  }; // WebSocket 종료 함수

  const disconnectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("🛑 [disconnectWebSocket] 수동으로 WebSocket 연결 종료 시도");
      wsRef.current.close();
      setIsCallEnded(true);
    } else {
      console.warn("⚠️ WebSocket이 이미 닫혀있거나 연결되지 않음");
    }
  }; // 통화 및 WebSocket을 모두 종료

  const endCallAndDisconnect = () => {
    try {
      const conn = twilioConnectionRef.current;
      if (conn?.disconnect && conn.status?.() !== "closed") {
        conn.disconnect();
      } else if (twilioDeviceRef.current?.disconnectAll) {
        twilioDeviceRef.current.disconnectAll();
      } else {
        console.warn("No Twilio refs, fallback to WS close");
        disconnectWebSocket();
      }
    } catch (e) {
      console.error("Twilio disconnect error:", e);
      twilioDeviceRef.current?.disconnectAll?.();
    }
    setIsCallEnded(true);

    setTimeout(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        console.log("⏱ Fallback closing WS");
        wsRef.current.close();
      }
    }, 1500);
  }; // 최초 사용자 제스처(아무 클릭) 시 한 번만 오디오 컨텍스트 프라임

  useEffect(() => {
    const handler = () => {
      primeBeep();
      window.removeEventListener("click", handler, true);
    };
    window.addEventListener("click", handler, true);
    return () => window.removeEventListener("click", handler, true);
  }, []); // 컴포넌트 마운트 시 최초 WebSocket 연결

  useEffect(() => {
    console.log("📡 WebSocketProvider mounted");
    connectWebSocket();
    return () => {
      console.log("🧹 WebSocketProvider 언마운트, 연결 종료");
      wsRef.current?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        sessionInfo,
        setSessionInfo,
        inboundLogs,
        outboundLogs,
        callLogs,
        totalAbuseCnt,
        wsRef,
        disconnectWebSocket,
        isCallEnded,
        endCallAndDisconnect,
        registerTwilioRefs,
        resetCallState,
        connectWebSocket,
        lastPatchedCallSidRef,
        setLastPatchedCallSid,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
