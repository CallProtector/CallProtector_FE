import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import "./CallLog.css";
import EndCallModal from "../../components/Modal/EndCallModal";

const CallLog = () => {
  const location = useLocation();
  console.log("location.state:", location.state);
  const warningCount = 2; // 백 연동 후 수정

  const [aiSummaryStatus, setAiSummaryStatus] = useState("waiting"); // "waiting" | "loading" | "done"

  const summaryData = {
    type: "결제수단 변경",
    request: "자동이체 → 신용카드 결제로 변경",
    change: [
      "기존 결제수단: 자동 이체",
      "신규 결제수단: 신용카드 (--****-3456)",
      "적용 시점: 다음 달 청구분부터",
    ],
    etc: "문자로 변경 안내 수신",
  };

  // 예시용 시뮬레이션 (나중에 삭제하고 백 연동 시 대체)
  useEffect(() => {
    setTimeout(() => setAiSummaryStatus("loading"), 2000);
    setTimeout(() => setAiSummaryStatus("done"), 5000);
  }, []);

  useEffect(() => {
    if (location.state?.callAccepted) {
      console.log("📞 통화중(통화 페이지 이동)");
    } else {
      console.log("❗통화 상태 정보 없음 (state=null)");
    }
  }, []);

  let callNumber = "D250319-06";
  let callDate = "3.28 (금) 13:26";
  // let callTime = "3:20";

  return (
    <div className="total">
      <nav className="placeholder-nav">네브바 자리</nav>
      <div className="box1">
        <div className="left-info">
          <h2 className="call-title">{callNumber}</h2>
          <div className="call-details">
            <span className="call-date">{callDate}</span>
            {/* <span className="timer">{callTime}</span> */}
          </div>
        </div>

        <div className="right-info">
          <span className="warning-text">
            ⚠ 3회 이상 경고시 통화가 자동종료 됩니다.
          </span>
          <div className="warning-bar">
            <div
              className="bar-fill"
              style={{ width: `${(warningCount / 3) * 100}%` }}
            ></div>
          </div>
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
            <div className="line">
              <strong>상담원</strong>
              <p>
                안녕하세요. 00카드 상담원 김덕우입니다. 무엇을 도와드릴까요?
              </p>
            </div>
            <div className="line">
              <strong>고객</strong>
              <p>
                안녕하세요. 전화요금 결제수단을 변경하려고 하는데, 어떻게 하면
                될까요?
                <br />
                지금은 자동이체로 등록되어 있는데, 신용카드 결제로 변경하고
                싶어요.
              </p>
            </div>
            <div className="line">
              <strong>상담원</strong>
              <p>
                네, 신용카드 결제로 변경 가능합니다. 몇 가지 확인이 필요한데요.
                <br />
                고객님의 본인 확인을 위해 등록된 휴대폰 번호와 생년월일을 말씀해
                주시겠어요?
              </p>
            </div>
            <div className="line">
              <strong>고객</strong>
              <p className="warning-highlight">
                상담자가 부적절한 발언을 함 (2/3)
              </p>
            </div>
          </div>
        </div>

        <div className="box3">
          <h3 className="section-title">AI 상담요약</h3>
          <div className="summary-content">
            {aiSummaryStatus === "waiting" && (
              <p className="ai-summary-hint">
                상담 종료 후 AI 요약이 자동으로 생성됩니다. <br />
                잠시만 기다려주세요.
              </p>
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
                  <strong>문의 유형</strong>
                  <ul>
                    <li>{summaryData.type}</li>
                  </ul>
                </div>
                <div className="summary-section">
                  <strong>고객 요청</strong>
                  <ul>
                    <li>{summaryData.request}</li>
                  </ul>
                </div>
                <div className="summary-section">
                  <strong>변경 내용</strong>
                  <ul>
                    {summaryData.change.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="summary-section">
                  <strong>추가 요청</strong>
                  <ul>
                    <li>{summaryData.etc}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 통화 종료 모달 렌더링 테스트
      <EndCallModal
        onCancel={() => console.log("❌ 아니요 클릭")}
        onConfirm={() => console.log("✅ 네, 이동할래요 클릭")}
      /> */}
    </div>
  );
};

export default CallLog;
