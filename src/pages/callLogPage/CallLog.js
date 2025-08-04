// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { AiOutlineInfoCircle } from "react-icons/ai";
// import "./CallLog.css";
// import { useWebSocket } from "../../contexts/WebSocketContext";

// const CallLog = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const {
//     sessionInfo,
//     inboundLogs,
//     outboundLogs,
//     interimTranscript,
//     totalAbuseCnt,
//     disconnectWebSocket,
//   } = useWebSocket();

//   const [aiSummaryStatus, setAiSummaryStatus] = useState("waiting");
//   const [summaryData, setSummaryData] = useState({ request: "", change: [] });
//   const [showAbuseOnly, setShowAbuseOnly] = useState(false);

//   useEffect(() => {
//     if (!location.state?.callAccepted) {
//       console.warn("❗ 통화 상태 정보 없음 (state=null)");
//       navigate("/main");
//     } else {
//       console.log("📞 통화중(통화 페이지 이동)");
//       console.log("🧾 세션코드:", sessionInfo?.sessionCode);
//     }
//   }, [location.state, sessionInfo, navigate]);

//   const handleEndCall = () => {
//     disconnectWebSocket?.(); // 웹소켓 종료
//     navigate("/main");
//   };

//   const handleStartSummary = () => {
//     setAiSummaryStatus("loading");
//     setTimeout(() => {
//       setAiSummaryStatus("done");
//       setSummaryData({
//         request: "자동이체 → 신용카드 결제로 변경",
//         change: [
//           "기존 결제수단: 자동 이체",
//           "신규 결제수단: 신용카드 (--****-3456)",
//           "적용 시점: 다음 달 청구분부터",
//         ],
//       });
//     }, 3000);
//   };

//   const callNumber = sessionInfo?.sessionCode || "세션 없음";
//   const callDate = sessionInfo?.createdAt || "정보 없음";

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
//           <span className="warning-count">누적 경고: {totalAbuseCnt}회</span>
//           <div className="warning-bar">
//             <div
//               className="bar-fill"
//               style={{
//                 width: `${(totalAbuseCnt / 3) * 100}%`,
//                 backgroundColor:
//                   totalAbuseCnt === 1
//                     ? "#ffd700"
//                     : totalAbuseCnt === 2
//                     ? "#ff8c00"
//                     : totalAbuseCnt >= 3
//                     ? "#ff0000"
//                     : "#f1eefc",
//               }}
//             ></div>
//           </div>

//           {totalAbuseCnt > 0 && (
//             <div className="abuse-warning-toggle">
//               <button onClick={() => setShowAbuseOnly((prev) => !prev)}>
//                 {showAbuseOnly
//                   ? "⚠️ 전체 보기"
//                   : `⚠️ 부적절 발언 보기 (${totalAbuseCnt}/3)`}
//               </button>
//             </div>
//           )}
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
//             {["상담원", "고객"].map((role, i) => {
//               const track = i === 0 ? "OUTBOUND" : "INBOUND";
//               const logs = i === 0 ? outboundLogs : inboundLogs;
//               const filtered = showAbuseOnly
//                 ? logs.filter((l) => l.isAbuse)
//                 : logs;

//               return (
//                 <React.Fragment key={role}>
//                   {filtered.map((log, idx) => (
//                     <div key={`${role}-${idx}`} className="line">
//                       <strong>{role}</strong>
//                       <p className={log.isAbuse ? "warning-highlight" : ""}>
//                         {log.script}
//                         {log.isAbuse &&
//                           ` 🚫 (${log.abuseType || "부적절한 발언"})`}
//                       </p>
//                     </div>
//                   ))}
//                   {interimTranscript[track] && (
//                     <div className="line interim-line" key={`${role}-interim`}>
//                       <strong>{role}</strong>
//                       <p className="interim-transcript">
//                         {interimTranscript[track]}
//                         <span style={{ opacity: 0.4 }}> (듣는 중...)</span>
//                       </p>
//                     </div>
//                   )}
//                 </React.Fragment>
//               );
//             })}
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
//                         {summaryData.change.map((item, idx) => (
//                           <li key={idx}>{item}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="bottom-button">
//             <button className="end-button" onClick={handleEndCall}>
//               상담 종료하기
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CallLog;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./CallLog.css";
import { useWebSocket } from "../../contexts/WebSocketContext";

const CallLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sessionInfo,
    inboundLogs,
    outboundLogs,
    interimTranscript,
    totalAbuseCnt,
    disconnectWebSocket,
  } = useWebSocket();

  const [aiSummaryStatus, setAiSummaryStatus] = useState("waiting");
  const [summaryData, setSummaryData] = useState({ request: "", change: [] });
  const [showAbuseOnly, setShowAbuseOnly] = useState(false);

  useEffect(() => {
    if (!location.state?.callAccepted) {
      console.warn("❗ 통화 상태 정보 없음 (state=null)");
      // navigate("/main"); 잠시 주석처리!!!
    } else {
      console.log("📞 통화중(통화 페이지 이동)");
      console.log("🧾 세션코드:", sessionInfo?.sessionCode);
    }
  }, [location.state, sessionInfo, navigate]);

  const handleEndCall = () => {
    disconnectWebSocket?.(); // 웹소켓 종료
    navigate("/main");
  };

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

  const callNumber = sessionInfo?.sessionCode || "세션 없음";
  const callDate = sessionInfo?.createdAt || "정보 없음";

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
            {/* 버전 선택 */}
            <div className="summary-version">
              <span className="version-label">제공 버전</span>
              <select className="version-select">
                <option value="v1">v1 - 빠르고 간단하게 핵심만 요약</option>
                <option value="v2">v2 - 상세한 정보까지 포함한 요약</option>
              </select>
            </div>
            <div className="box3-body">
              <div className="summary-content">
                {aiSummaryStatus === "waiting" && (
                  <div className="ai-summary-hint">
                    <button
                      className="summary-button"
                      onClick={handleStartSummary}
                    >
                      상담 요약하기
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
                        {summaryData.change.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
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
