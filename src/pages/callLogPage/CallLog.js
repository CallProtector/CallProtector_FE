// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { AiOutlineInfoCircle } from "react-icons/ai";
// import "./CallLog.css";
// import EndCallModal from "../../components/Modal/EndCallModal";

// const CallLog = () => {
//   const location = useLocation();
//   console.log("location.state:", location.state);
//   const warningCount = 3; // 백 연동 후 수정

//   const [aiSummaryStatus, setAiSummaryStatus] = useState("waiting"); // "waiting" | "loading" | "done"

//   const summaryData = {
//     request: "자동이체 → 신용카드 결제로 변경",
//     change: [
//       "기존 결제수단: 자동 이체",
//       "신규 결제수단: 신용카드 (--****-3456)",
//       "적용 시점: 다음 달 청구분부터",
//     ],
//   };

//   const handleStartSummary = () => {
//     setAiSummaryStatus("loading");

//     // 3초 뒤 요약 완료 시뮬레이션
//     setTimeout(() => {
//       setAiSummaryStatus("done");
//     }, 3000);
//   };

//   useEffect(() => {
//     if (location.state?.callAccepted) {
//       console.log("📞 통화중(통화 페이지 이동)");
//     } else {
//       console.log("❗통화 상태 정보 없음 (state=null)");
//     }
//   }, []);

//   let callNumber = "20250701-0001";
//   let callDate = "3.28 (금) 13:26";

//   return (
//     <div className="total">
//       <div className="box1">
//         <div className="left-info">
//           <h2 className="call-title">{callNumber}</h2>
//           <div className="call-details">
//             <span className="call-date">{callDate}</span>
//           </div>
//         </div>

//         <div className="right-info">
//           <span className="warning-count">누적 경고: {warningCount}회</span>
//           <div className="warning-bar multi-color">
//             <div
//               className={`bar-segment ${
//                 warningCount >= 1 ? "fill-yellow" : ""
//               }`}
//             />
//             <div
//               className={`bar-segment ${
//                 warningCount >= 2 ? "fill-orange" : ""
//               }`}
//             />
//             <div
//               className={`bar-segment ${warningCount >= 3 ? "fill-red" : ""}`}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="box-wrapper">
//         <div className="box2">
//           <div className="section-header">
//             <h3 className="section-title">음성 기록</h3>
//             <div className="ai-note">
//               <AiOutlineInfoCircle
//                 size={20}
//                 style={{
//                   marginRight: "10px",
//                   position: "relative",
//                   top: "2px",
//                 }}
//               />
//               AI 생성 콘텐츠는 오류가 있을 수 있습니다.
//             </div>
//           </div>

//           <div className="conversation">
//             <div className="line">
//               <strong>상담원</strong>
//               <p>
//                 안녕하세요. 00카드 상담원 김덕우입니다. 무엇을 도와드릴까요?
//               </p>
//             </div>
//             <div className="line">
//               <strong>고객</strong>
//               <p>
//                 안녕하세요. 전화요금 결제수단을 변경하려고 하는데, 어떻게 하면
//                 될까요?
//                 <br />
//                 지금은 자동이체로 등록되어 있는데, 신용카드 결제로 변경하고
//                 싶어요.
//               </p>
//             </div>
//             <div className="line">
//               <strong>상담원</strong>
//               <p>
//                 네, 신용카드 결제로 변경 가능합니다. 몇 가지 확인이 필요한데요.
//                 <br />
//                 고객님의 본인 확인을 위해 등록된 휴대폰 번호와 생년월일을 말씀해
//                 주시겠어요?
//               </p>
//             </div>
//             <div className="line">
//               <strong>고객</strong>
//               <p className="warning-highlight">
//                 상담자가 부적절한 발언을 함 (2/3)
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="right-part">
//           <div className="box3">
//             <h3 className="section-title">AI 상담요약</h3>
//             <div className="box3-body">
//               <div className="summary-content">
//                 {aiSummaryStatus === "waiting" && (
//                   <div className="ai-summary-hint">
//                     <button
//                       className="summary-button"
//                       onClick={handleStartSummary}
//                     >
//                       📋 상담 요약하기
//                     </button>
//                     <p className="summary-guide">
//                       통화가 종료되면 버튼을 눌러 보세요.
//                     </p>
//                   </div>
//                 )}

//                 {aiSummaryStatus === "loading" && (
//                   <div className="ai-summary-loading">
//                     <div className="spinner" />
//                     <p>통화 내용을 분석중입니다...</p>
//                   </div>
//                 )}

//                 {aiSummaryStatus === "done" && (
//                   <div className="ai-summary-result">
//                     <div className="summary-section">
//                       <strong>문의 사항</strong>
//                       <ul>
//                         <li>{summaryData.request}</li>
//                       </ul>
//                     </div>
//                     <div className="summary-section">
//                       <strong>처리 결과</strong>
//                       <ul>
//                         <li>{summaryData.change}</li>
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="bottom-button">
//             <button className="end-button">상담 종료하기</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CallLog;

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./CallLog.css";
import EndCallModal from "../../components/Modal/EndCallModal";

const CallLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleEndCall = () => {
    navigate("/main"); // 메인 페이지 경로
  };
  const wsRef = useRef(null);
  const [aiSummaryStatus, setAiSummaryStatus] = useState("waiting");
  const [summaryData, setSummaryData] = useState({ request: "", change: [] });
  const [sessionInfo, setSessionInfo] = useState(null);
  const [totalAbuseCnt, setTotalAbuseCnt] = useState(0);
  const [inboundLogs, setInboundLogs] = useState([]);
  const [outboundLogs, setOutboundLogs] = useState([]);
  const [showAbuseOnly, setShowAbuseOnly] = useState(false);

  useEffect(() => {
    if (location.state?.callAccepted) {
      console.log("📞 통화중(통화 페이지 이동)");
    } else {
      console.log("❗통화 상태 정보 없음 (state=null)");
    }

    const ws = new WebSocket("wss://callprotect.site/ws/stt?userId=1");
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket 연결됨");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "sessionInfo") {
          setSessionInfo({
            sessionCode: data.sessionCode,
            createdAt: data.createdAt,
          });
          setTotalAbuseCnt(data.totalAbuseCnt);
        } else if (data.type === "totalAbuseCntUpdate") {
          setTotalAbuseCnt(data.totalAbuseCnt);
        } else if (data.type === "stt") {
          const { track, script, isFinal, isAbuse, abuseType } = data.payload;
          const logItem = { script, isFinal, isAbuse, abuseType };

          if (track === "INBOUND") {
            setInboundLogs((prev) => [...prev, logItem]);
          } else {
            setOutboundLogs((prev) => [...prev, logItem]);
          }
        }
      } catch (err) {
        console.error("❌ 메시지 처리 에러:", err);
      }
    };

    ws.onerror = (e) => console.error("❌ WebSocket 오류", e);
    ws.onclose = () => console.log("🔌 WebSocket 연결 종료");

    return () => {
      ws.close();
    };
  }, []);

  const handleStartSummary = () => {
    setAiSummaryStatus("loading");
    setTimeout(() => {
      setAiSummaryStatus("done");
      setSummaryData({
        request: "자동이체 → 신용카드 결제로 변경",
        change: [
          "기존 결제수단: 자동 이체",
          "신규 결제수단: 신용카드 (--****-3456)",
          "적용 시점: 다음 달 청구분부터",
        ],
      });
    }, 3000);
  };

  const callNumber = sessionInfo?.sessionCode || "20250701-0001";
  const callDate = sessionInfo?.createdAt || "3.28 (금) 13:26";

  return (
    <div className="total">
      <div className="box1">
        <div className="left-info">
          <h2 className="call-title">{callNumber}</h2>
          <div className="call-details">
            <span className="call-date">{callDate}</span>
          </div>
        </div>

        <div className="right-info">
          <span className="warning-count">누적 경고: {totalAbuseCnt}회</span>
          <div className="warning-bar">
            <div
              className="bar-fill"
              style={{
                width: `${(totalAbuseCnt / 3) * 100}%`,
                backgroundColor:
                  totalAbuseCnt === 1
                    ? "#ffd700"
                    : totalAbuseCnt === 2
                    ? "#ff8c00"
                    : totalAbuseCnt >= 3
                    ? "#ff0000"
                    : "#f1eefc",
              }}
            ></div>
          </div>

          {totalAbuseCnt > 0 && (
            <div className="abuse-warning-toggle">
              <button onClick={() => setShowAbuseOnly((prev) => !prev)}>
                {showAbuseOnly
                  ? "⚠️ 전체 보기"
                  : `⚠️ 부적절 발언 보기 (${totalAbuseCnt}/3)`}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="box-wrapper">
        <div className="box2">
          <div className="section-header">
            <h3 className="section-title">음성 기록</h3>
            <div className="ai-note">
              <AiOutlineInfoCircle
                size={20}
                style={{
                  marginRight: "10px",
                  position: "relative",
                  top: "2px",
                }}
              />
              AI 생성 콘텐츠는 오류가 있을 수 있습니다.
            </div>
          </div>

          <div className="conversation">
            {["상담원", "고객"].map((role, i) => {
              const logs = i === 0 ? outboundLogs : inboundLogs;
              const filtered = showAbuseOnly
                ? logs.filter((l) => l.isAbuse)
                : logs;

              return filtered.map((log, idx) => (
                <div key={`${role}-${idx}`} className="line">
                  <strong>{role}</strong>
                  <p className={log.isAbuse ? "warning-highlight" : ""}>
                    {log.script}
                    {log.isAbuse && ` 🚫 (${log.abuseType || "부적절한 발언"})`}
                  </p>
                </div>
              ));
            })}
          </div>
        </div>

        <div className="right-part">
          <div className="box3">
            <h3 className="section-title">AI 상담요약</h3>
            <div className="box3-body">
              <div className="summary-content">
                {aiSummaryStatus === "waiting" && (
                  <div className="ai-summary-hint">
                    <button
                      className="summary-button"
                      onClick={handleStartSummary}
                    >
                      📋 상담 요약하기
                    </button>
                    <p className="summary-guide">
                      통화가 종료되면 버튼을 눌러 보세요.
                    </p>
                  </div>
                )}

                {aiSummaryStatus === "loading" && (
                  <div className="ai-summary-loading">
                    <div className="spinner" />
                    <p>통화 내용을 분석중입니다...</p>
                  </div>
                )}

                {aiSummaryStatus === "done" && (
                  <div className="ai-summary-result">
                    <div className="summary-section">
                      <strong>문의 사항</strong>
                      <ul>
                        <li>{summaryData.request}</li>
                      </ul>
                    </div>
                    <div className="summary-section">
                      <strong>처리 결과</strong>
                      <ul>
                        <li>{summaryData.change}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bottom-button">
            <button className="end-button" onClick={handleEndCall}>
              상담 종료하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallLog;
