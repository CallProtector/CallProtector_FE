import React from "react";
import "./CallLog.css";

const CallLog = () => {
  let callNumber = "D250319-06";
  let callDate = "3.28 금 오후 1:26";
  let callTime = "3:20";

  return (
    <div className="total">
      <nav className="placeholder-nav">네브바 자리</nav>
      <div className="box1">
        <div className="left-info">
          <h2 className="call-title">{callNumber}</h2>
          <div className="call-details">
            <span className="call-date">{callDate}</span>
            <span className="timer">{callTime}</span>
          </div>
        </div>

        {/* <div className="right-info">
          <span className="warning-text">
            3회 이상 경고시 통화가 자동종료 됩니다.
          </span>
        </div> */}
      </div>

      <div className="box-wrapper">
        <div className="box2">
          <div className="section-header">
            <h3 className="section-title">음성 기록</h3>
            <p className="ai-note">AI 생성 콘텐츠는 오류가 있을 수 있습니다.</p>
          </div>

          <div className="conversation">
            <p>
              <strong>상담원</strong>
              <br />
              안녕하세요. 00카드 상담원 김덕우입니다. 무엇을 도와드릴까요?
            </p>
            <p>
              <strong>고객</strong>
              <br />
              안녕하세요. 전화요금 결제수단을 변경하려고 하는데, 어떻게 하면
              될까요? 지금은 자동이체로 등록되어 있는데, 신용카드 결제로
              변경하고 싶어요.
            </p>
            <p>
              <strong>상담원</strong>
              <br />
              네, 신용카드 결제로 변경 가능합니다. 몇 가지 확인이 필요한데요.
              고객님의 본인 확인을 위해 등록된 휴대폰 번호와 생년월일을 말씀해
              주시겠어요?
            </p>
            <p>
              <strong>고객</strong>
              <br />
              <span className="warning-text">
                상담자가 부적절한 발언을 함 (3/3)
              </span>
            </p>
          </div>
        </div>

        <div className="box3">
          <h3 className="section-title">AI 상담요약</h3>
          {/* 요약 내용 추가 배치 */}
          <p className="ai-summary">요약 내용</p>
        </div>
      </div>
    </div>
  );
};

export default CallLog;
