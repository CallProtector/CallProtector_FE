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
//       // navigate("/main"); 잠시 주석처리!!!
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
//               const logs = i === 0 ? outboundLogs : inboundLogs;
//               const filtered = showAbuseOnly
//                 ? logs.filter((l) => l.isAbuse)
//                 : logs;

//               return filtered.map((log, idx) => (
//                 <div key={`${role}-${idx}`} className="line">
//                   <strong>{role}</strong>
//                   <p className={log.isAbuse ? "warning-highlight" : ""}>
//                     {log.script}
//                     {log.isAbuse && ` 🚫 (${log.abuseType || "부적절한 발언"})`}
//                   </p>
//                 </div>
//               ));
//             })}
//           </div>
//         </div>

//         <div className="right-part">
//           <div className="box3">
//             <h3 className="section-title">AI 상담요약</h3>
//             {/* 버전 선택 */}
//             <div className="summary-version">
//               <span className="version-label">제공 버전</span>
//               <select className="version-select">
//                 <option value="v1">v1 - 빠르고 간단하게 핵심만 요약</option>
//                 <option value="v2">v2 - 상세한 정보까지 포함한 요약</option>
//               </select>
//             </div>
//             <div className="box3-body">
//               <div className="summary-content">
//                 {aiSummaryStatus === "waiting" && (
//                   <div className="ai-summary-hint">
//                     <button
//                       className="summary-button"
//                       onClick={handleStartSummary}
//                     >
//                       상담 요약하기
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
import axios from "axios";

const CallLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sessionInfo,
    inboundLogs,
    outboundLogs,
    callLogs,
    totalAbuseCnt,
    disconnectWebSocket,
    isCallEnded,
    endCallAndDisconnect,
  } = useWebSocket();

  const [showAbuseOnly, setShowAbuseOnly] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState("v1");

  const [statusByVersion, setStatusByVersion] = useState({
    v1: "waiting",
    v2: "waiting",
  });
  const [summaryByVersion, setSummaryByVersion] = useState({
    v1: null,
    v2: null,
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // "상담 종료하기" 버튼 클릭 시 호출되는 함수
  const handleEndCall = () => {
    endCallAndDisconnect(); // 통합 종료 함수 호출
    console.log("✅ 상담 종료, 요약 가능");
  };

  const handleVersionChange = (version) => {
    setSelectedVersion(version);
    console.log(`[UI] 버전 변경: ${version}`);
  };

  const getSummaryDescription = (version) => {
    if (version === "v1") {
      return "빠르고 간단하게 핵심만 요약합니다.";
    } else if (version === "v2") {
      return "상세하고 정밀한 정보까지 포함해 요약합니다.";
    }
    return "";
  };

  useEffect(() => {
    if (!location.state?.callAccepted) {
      console.warn("❗ 통화 상태 정보 없음 (state=null)");
      // navigate("/main"); 잠시 주석처리!!!
    } else {
      console.log("📞 통화중(통화 페이지 이동)");
      console.log("🧾 세션코드:", sessionInfo?.sessionCode);
    }
  }, [location.state, sessionInfo, navigate]);

  const handleStartSummary = async () => {
    const sessionId = sessionInfo?.callSessionId;
    if (!sessionId) {
      console.error("[📃상담요약] 세션ID 없음");
      return;
    }

    if (statusByVersion[selectedVersion] !== "waiting") {
      console.log(
        `[📃상담요약] ${selectedVersion}은 이미 요약되었거나 진행 중입니다.`
      );
      return;
    }

    setStatusByVersion((prev) => ({ ...prev, [selectedVersion]: "loading" }));
    console.log(`[📃상담요약] ${selectedVersion} 요약 시작`);

    const jwtToken = localStorage.getItem("accessToken");
    const baseUrl = `${API_BASE_URL}/api/call-sessions/${sessionId}/summary`;
    const apiUrl =
      selectedVersion === "v1" ? `${baseUrl}/simple` : `${baseUrl}/detailed`;

    console.log("[📃상담요약] API_URL:", apiUrl);

    try {
      const res = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log("[📃상담요약 결과]", res.data);

      if (res.data.isSuccess && res.data.result?.summaryText) {
        const text = res.data.result.summaryText;
        const requestPart =
          text.split("문의사항")[1]?.split("처리 결과")[0] || "";
        const changePart = text.split("처리 결과")[1] || "";

        const parsed = {
          request: requestPart.trim(),
          change: changePart
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        };

        setSummaryByVersion((prev) => ({
          ...prev,
          [selectedVersion]: parsed,
        }));
        setStatusByVersion((prev) => ({
          ...prev,
          [selectedVersion]: "done",
        }));
      } else {
        throw new Error("응답 데이터 없음");
      }
    } catch (err) {
      console.error("[❌ 요약 API 호출 실패]", err);
      setStatusByVersion((prev) => ({
        ...prev,
        [selectedVersion]: "error",
      }));
    }
  };

  const callNumber = sessionInfo?.sessionCode || "세션 없음";
  const callDate = sessionInfo?.createdAt || "정보 없음";
  const getRole = (track) => (track === "INBOUND" ? "고객" : "상담원");

  const renderSummaryContent = () => {
    const status = statusByVersion[selectedVersion];
    const summary = summaryByVersion[selectedVersion];
    const isAlreadyDone = summary !== null;
    const isError = status === "error";

    // ✅ 각 버전별 상태와 요약 내용을 독립적으로 관리
    if (isError) {
      return (
        <div className="ai-summary-error">
          <p>요약 정보를 불러오는데 실패했습니다. 다시 시도해 주세요.</p>
          <button onClick={handleStartSummary} className="summary-button">
            다시 시도
          </button>
        </div>
      );
    }

    if (status === "loading") {
      return (
        <div className="ai-summary-loading">
          <div className="spinner" />
          <p>통화 내용을 분석중입니다...</p>
        </div>
      );
    }

    if (isAlreadyDone) {
      return (
        <div className="ai-summary-result">
          <div className="summary-section">
            <strong>문의 사항</strong>
            <ul>
              <li>{summary.request}</li>
            </ul>
          </div>
          <div className="summary-section">
            <strong>처리 결과</strong>
            <ul>
              {summary.change.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    return (
      <div className="ai-summary-hint">
        <button
          className="summary-button"
          onClick={handleStartSummary}
          disabled={!isCallEnded}
        >
          {`${selectedVersion.toUpperCase()} 상담 요약하기`}
        </button>
        {!isCallEnded && (
          <p className="summary-guide">통화 종료 후 버튼이 활성화됩니다.</p>
        )}
      </div>
    );
  };

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
            {callLogs.map((log, idx) => {
              // 부적절 발언만 보기가 활성화되었을 때, 부적절 발언이 아닌 로그는 건너뛰기
              if (showAbuseOnly && !log.isAbuse) {
                return null;
              }

              // 💡 isFinal 값에 따라
              const lineClass = !log.isFinal ? "line interim-line" : "line";
              const textClass = `${log.isAbuse ? "warning-highlight" : ""} ${
                !log.isFinal ? "interim-text" : ""
              }`;

              return (
                <div key={idx} className={lineClass}>
                  <strong>{getRole(log.track)}</strong>
                  {/* 💡 isAbuse가 true일 때 warning-highlight 클래스 적용 */}
                  <p className={textClass}>
                    {log.script}
                    {log.isAbuse}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="right-part">
          <div className="box3">
            <h3 className="section-title">AI 상담요약</h3>
            <div className="summary-version">
              <span className="version-label">제공 버전</span>
              <div className="version-buttons">
                <button
                  className={`version-button ${
                    selectedVersion === "v1" ? "active" : ""
                  }`}
                  onClick={() => handleVersionChange("v1")}
                >
                  v1
                </button>
                <button
                  className={`version-button ${
                    selectedVersion === "v2" ? "active" : ""
                  }`}
                  onClick={() => handleVersionChange("v2")}
                >
                  v2
                </button>
              </div>
            </div>
            <p className="version-description">
              {getSummaryDescription(selectedVersion)}
            </p>

            <div className="box3-body">
              <div className="summary-content">{renderSummaryContent()}</div>
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
