import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./CallLog.css";
import { useWebSocket } from "../../contexts/WebSocketContext";
import axios from "axios";

function shiftToKST(str) {
  if (!str) return "정보 없음";

  // "8.20 (수) 11:53" → 숫자만 뽑기
  const match = str.match(/(\d+)\.(\d+).*?(\d+):(\d+)/);
  if (!match) return str;

  const [, month, day, hour, minute] = match.map(Number);
  const year = new Date().getFullYear();

  // ① 들어온 값은 UTC 기준
  const dateUTC = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // ② 한국 시간으로 변환
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateUTC);
}

const CallLog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { id: callSessionIdParam } = useParams();
  const isDetailMode = !!callSessionIdParam; // URL에 :id 있으면 상세 모드

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

  // 상세조회 전용 상태 (실시간과 분리)
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [detailSessionInfo, setDetailSessionInfo] = useState(null);
  const [detailCallLogs, setDetailCallLogs] = useState([]);
  const [detailTotalAbuseCnt, setDetailTotalAbuseCnt] = useState(0);

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
    if (isDetailMode) return; // 상세 모드에서는 실시간 기록 스킵
    if (!location.state?.callAccepted) {
      console.warn("❗ 통화 상태 정보 없음 (state=null)");
      // navigate("/main"); 잠시 주석처리!!!
    } else {
      console.log("📞 통화중(통화 페이지 이동)");
      console.log("🧾 세션코드:", sessionInfo?.sessionCode);
    }
  }, [isDetailMode, location.state, sessionInfo, navigate]);

  // ✅ 상세 조회 API 호출 (/api/call-sessions/{callSessionId})
  useEffect(() => {
    if (!isDetailMode) return;
    const token = localStorage.getItem("accessToken");
    const fetchDetail = async () => {
      setDetailLoading(true);
      setDetailError("");
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/call-sessions/${callSessionIdParam}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const r = data?.result;
        if (!r) throw new Error("상세 데이터 없음");

        // 상단 세션 정보
        setDetailSessionInfo(r.sessionInfo || null);
        setDetailTotalAbuseCnt(r.sessionInfo?.totalAbuseCnt ?? 0);

        // 기록을 기존 UI 포맷으로 매핑
        const mapped = (r.scriptHistory || []).map((h) => ({
          track: h.speaker === "INBOUND" ? "INBOUND" : "OUTBOUND",
          script: h.text,
          isFinal: true,
          isAbuse: !!h.isAbuse,
          abuseType: h.abuseType,
          timestamp: h.timestamp,
        }));
        setDetailCallLogs(mapped);

        // 요약 선반영 (있을 경우)
        const parseSummary = (text) => {
          if (!text) return null;
          const req = text.split("문의사항")[1]?.split("처리 결과")[0] || "";
          const change = (text.split("처리 결과")[1] || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          return { request: req.trim(), change };
        };
        const v1 = parseSummary(r.aiSummary?.simple);
        const v2 = parseSummary(r.aiSummary?.detailed);
        setSummaryByVersion({ v1, v2 });
        setStatusByVersion({
          v1: v1 ? "done" : "waiting",
          v2: v2 ? "done" : "waiting",
        });
      } catch (e) {
        console.error("[상세조회 실패]", e);
        setDetailError("상세 정보를 불러오지 못했습니다.");
      } finally {
        setDetailLoading(false);
      }
    };
    fetchDetail();
  }, [isDetailMode, callSessionIdParam, API_BASE_URL]);

  const handleStartSummary = async () => {
    const sessionId = isDetailMode
      ? Number(callSessionIdParam)
      : sessionInfo?.callSessionId;

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
      if (err.response) {
        // 서버 응답이 있을 경우
        console.error("[❌ 요약 API 호출 실패 - 서버 응답 있음]", {
          status: err.response.status,
          data: err.response.data,
        });
      } else if (err.request) {
        // 요청은 갔지만 응답이 없는 경우
        console.error("[❌ 요약 API 호출 실패 - 응답 없음]", err.request);
      } else {
        // 요청 자체에서 에러가 난 경우
        console.error("[❌ 요약 API 호출 실패 - 요청 설정 오류]", err.message);
      }

      setStatusByVersion((prev) => ({
        ...prev,
        [selectedVersion]: "error",
      }));
    }
  };

  // 화면 표시는 상세모드 값 우선
  const callNumber = isDetailMode
    ? detailSessionInfo?.callSessionCode
    : sessionInfo?.sessionCode || "세션 없음";

  {
    /*const callDate = isDetailMode
    ? detailSessionInfo?.createdAt
    : sessionInfo?.createdAt || "정보 없음";

    const rawCreatedAt = isDetailMode
  ? detailSessionInfo?.createdAt
  : sessionInfo?.createdAt;*/
  }

  const rawCreatedAt = isDetailMode
    ? detailSessionInfo?.createdAt
    : sessionInfo?.createdAt;

  const callDate = rawCreatedAt ? shiftToKST(rawCreatedAt) : "정보 없음";
  const abuseCount = isDetailMode ? detailTotalAbuseCnt : totalAbuseCnt;
  const logsForRender = isDetailMode ? detailCallLogs : callLogs;

  const getRole = (track) => (track === "INBOUND" ? "고객" : "상담원");

  const renderSummaryContent = () => {
    const status = statusByVersion[selectedVersion];
    const summary = summaryByVersion[selectedVersion];
    const isAlreadyDone = summary !== null;
    const isError = status === "error";

    // 상세: waiting이면 클릭 가능 / 실시간: 통화 종료 + waiting이면 클릭 가능
    const canClickSummary = isDetailMode
      ? status === "waiting"
      : isCallEnded && status === "waiting";

    // ✅ 각 버전별 상태와 요약 내용을 독립적으로 관리
    if (isError) {
      return (
        <div className="ai-summary-error">
          <p>
            요약 정보를 불러오는데 실패했습니다. <br />
            다시 시도해 주세요.
          </p>
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
          disabled={!canClickSummary}
        >
          {`${selectedVersion.toUpperCase()} 상담 요약하기`}
        </button>
        {!isDetailMode && !isCallEnded && (
          <p className="summary-guide">통화 종료 후 버튼이 활성화됩니다.</p>
        )}
        {isDetailMode && status !== "waiting" && (
          <p className="summary-guide">해당 버전 요약이 이미 생성되었습니다.</p>
        )}
      </div>
    );
  };

  return (
    <div className="total">
      <div className="box1">
        <div className="left-info">
          <h2 className="call-title">
            {callNumber}
            {!isDetailMode && (
              <span
                className={`call-status ${
                  isCallEnded ? "ended" : "in-progress"
                }`}
              >
                {isCallEnded ? (
                  "통화 종료"
                ) : (
                  <span className="wavy">
                    {"통화중...".split("").map((ch, i) => (
                      <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                        {ch}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            )}
          </h2>

          <div className="call-details">
            <span className="call-date">{callDate}</span>
          </div>
        </div>

        <div className="right-info">
          <span className="warning-count">누적 경고: {abuseCount}회</span>{" "}
          <div className="warning-bar">
            <div
              className="bar-fill"
              style={{
                width: `${(abuseCount / 3) * 100}%`,
                backgroundColor:
                  abuseCount === 1
                    ? "#ffd700"
                    : abuseCount === 2
                    ? "#ff8c00"
                    : abuseCount >= 3
                    ? "#ff0000"
                    : "#f1eefc",
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="box-wrapper">
        <div className="box2">
          <div className="section-header">
            <h3 className="section-title">음성 기록</h3>
            <div className="header-right-actions">
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
              {abuseCount > 0 && (
                <div className="abuse-warning-toggle">
                  <button
                    onClick={() => setShowAbuseOnly((prev) => !prev)}
                    className={`toggle-button ${showAbuseOnly ? "active" : ""}`}
                  >
                    {showAbuseOnly ? (
                      <>
                        <span role="img" aria-label="all">
                          📜
                        </span>{" "}
                        전체 보기
                      </>
                    ) : (
                      <>
                        <span role="img" aria-label="warning">
                          ⚠️
                        </span>{" "}
                        부적절 발언 보기
                        <span className="abuse-count">
                          ({abuseCount}/{abuseCount > 3 ? abuseCount : 3})
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="conversation">
            {logsForRender.map((log, idx) => {
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
                    {/* 버튼 켰을 때만 type 배지 표시 */}
                    {showAbuseOnly &&
                      log.isAbuse &&
                      ` 🚫 ${log.abuseType || "부적절한 발언"}`}
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
            <button
              className="end-button"
              onClick={handleEndCall}
              disabled={isDetailMode} // 상세 모드일 때 버튼 비활성화
              style={{
                opacity: isDetailMode ? 0.5 : 1, // 흐리게 표시
                cursor: isDetailMode ? "not-allowed" : "pointer",
              }}
            >
              상담 종료하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallLog;
