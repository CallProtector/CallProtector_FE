import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const wsRef = useRef(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [inboundLogs, setInboundLogs] = useState([]);
  const [outboundLogs, setOutboundLogs] = useState([]);
  const [totalAbuseCnt, setTotalAbuseCnt] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState({
    INBOUND: "",
    OUTBOUND: "",
  }); // 중간 STT

  // ✅ 수동으로 WebSocket 종료
  const disconnectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("🛑 [disconnectWebSocket] 수동으로 WebSocket 연결 종료 시도");
      wsRef.current.close();
    } else {
      console.warn("⚠️ WebSocket이 이미 닫혀있거나 연결되지 않음");
    }
  };

  useEffect(() => {
    console.log("📡 WebSocketProvider mounted");

    const ws = new WebSocket("wss://callprotect.site/ws/stt?userId=1");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🌐 WebSocket 연결됨");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 WebSocket 메시지 수신:", data);

        switch (data.type) {
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
            const log = { script, isFinal, isAbuse, abuseType };

            if (!isFinal) {
              // 🔹 중간 결과: 임시 저장
              setInterimTranscript((prev) => ({ ...prev, [track]: script }));
            } else {
              // 🔸 최종 결과: 로그에 추가 + 중간 결과 제거
              setInterimTranscript((prev) => ({ ...prev, [track]: "" }));
              if (track === "INBOUND") {
                console.log("👂 INBOUND 로그 추가:", log);
                setInboundLogs((prev) => [...prev, log]);
              } else if (track === "OUTBOUND") {
                console.log("🗣️ OUTBOUND 로그 추가:", log);
                setOutboundLogs((prev) => [...prev, log]);
              }
            }
            break;

          // if (track === "INBOUND") {
          //   console.log("👂 INBOUND 로그 추가:", log);
          //   setInboundLogs((prev) => [...prev, log]);
          // } else if (track === "OUTBOUND") {
          //   console.log("🗣️ OUTBOUND 로그 추가:", log);
          //   setOutboundLogs((prev) => [...prev, log]);
          // }
          // break;

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
    };

    return () => {
      console.log("🧹 WebSocketProvider 언마운트, 연결 종료");
      wsRef.current?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        sessionInfo,
        inboundLogs,
        outboundLogs,
        interimTranscript,
        totalAbuseCnt,
        wsRef,
        disconnectWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
