import React, { useState } from "react";
import styled from "styled-components";
import normalImg from "../../assets/images/call_normal.jpg";
import axios from "axios";
import { useWebSocket } from "../../contexts/WebSocketContext";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  max-width: 1200px;
  min-height: 750px;
  width: 80%;
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  max-width: 600px;
  width: auto;
  height: 380px;
  flex-shrink: 0;
  object-fit: contain;
  margin-left: 50px;
  margin-right: 80px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  margin-right: 50px;

  p {
    font-size: 45px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 30px;
  }
`;

const PolicyBox = styled.div`
  font-size: 18px;
  text-align: left;
  margin-bottom: 40px;
  line-height: 1.6;

  label {
    display: flex;
    align-items: center;
    font-weight: bold;
    cursor: pointer;

    input[type="checkbox"] {
      appearance: none;
      width: 20px;
      height: 20px;
      border: 2px solid #5c24af;
      border-radius: 4px;
      margin-left: 10px;
      position: relative;
      cursor: pointer;
    }

    input[type="checkbox"]:checked::after {
      content: "✔";
      color: white;
      font-size: 14px;
      position: absolute;
      top: 0;
      left: 3px;
    }

    input[type="checkbox"]:checked {
      background-color: #5c24af;
    }

    .pname {
      color: #5c24af;
      font-weight: bold;
      margin-right: 2px;
    }
  }

  .note {
    font-weight: normal;
    font-size: 18px;
    color: #000000;
    margin-top: 10px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

// ❌ 통화 거절 버튼
const ButtonCancel = styled.button`
  font-size: 25px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  width: 250px;
  height: 90px;
  background-color: #f7f2fa;
  color: #5c24af;
  cursor: pointer;
`;

// ✅ 통화 수락 버튼
const ButtonConfirm = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isDisabled",
})`
  font-size: 25px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  width: 250px;
  height: 90px;
  background-color: ${({ isDisabled }) => (isDisabled ? "#d1c5e7" : "#5c24af")};
  color: #f7f2fa;
  cursor: ${({ isDisabled }) => (isDisabled ? "default" : "pointer")};
  pointer-events: ${({ isDisabled }) => (isDisabled ? "none" : "auto")};
`;

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

const IncomingCallModal = ({ show, onAccept, onReject, connectionRef }) => {
  // 💡 props로 받던 setSessionInfo 대신 전역 훅 사용
  const { setSessionInfo, sessionInfo, resetCallState, setLastPatchedCallSid } =
    useWebSocket();
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const jwtToken = localStorage.getItem("accessToken");
  const API_BASE_URL = process.env.REACT_APP_API_URL;
  React.useEffect(() => {
    if (show) {
      setIsChecked(false);
      setLoading(false);
    }
  }, [show]);

  const handleCheck = async (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    if (
      checked &&
      connectionRef?.current?.parameters?.Params &&
      connectionRef?.current?.parameters?.From
    ) {
      setLoading(true);
      try {
        const parsedParams = parseQueryParams(
          connectionRef.current.parameters.Params
        );
        const initialCallSid = parsedParams.initialCallSid;

        // ✅ PATCH와 WS에서 동일하게 쓰기 위해 값 확정(LOCK)
        setLastPatchedCallSid(initialCallSid);

        console.log("📡 PATCH 요청 보내는 중...");
        console.log("🔑 token:", jwtToken);
        console.log("📦 body:", {
          originalInboundCallSid: initialCallSid,
          callerNumber: connectionRef.current.parameters.From,
        });

        const res = await axios.patch(
          `${API_BASE_URL}/api/call-sessions/user`,
          {
            originalInboundCallSid: initialCallSid,
            callerNumber: connectionRef.current.parameters.From,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        const result = res.data.result;
        // 💡 WebSocketContext의 setSessionInfo를 사용해 전역 상태 업데이트
        setSessionInfo({
          sessionCode: result.callSessionCode,
          createdAt: result.createdAt,
          totalAbuseCnt: result.totalAbuseCnt,
          callSessionId: result.callSessionId,
        });
        console.log("✅ sessionInfo 수신 완료:", result);

        // ✅ 새 세션 진입이므로 '진행중'으로 보정 + 이전 로그/카운트 초기화
        resetCallState();
      } catch (err) {
        console.error("❌ sessionInfo 수신 실패:", err);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("⚠️ connectionRef 초기화 미완 or 필수 파라미터 누락");
    }
  };

  if (!show) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <Image src={normalImg} alt="call_normal" />
        <ContentBox>
          <p>
            고객이 상담을 요청했습니다.
            <br />
            통화를 연결하겠습니다.
          </p>
          <PolicyBox>
            <label>
              <span>
                <span className="pname">온음</span>의 상담원 보호 정책
              </span>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheck}
              />
            </label>
            <div className="note">
              고객의 폭언이 3회 이상 감지되면 통화가 자동 종료됩니다.
            </div>
          </PolicyBox>
          <ButtonGroup>
            <ButtonCancel onClick={onReject}>아니오</ButtonCancel>
            <ButtonConfirm
              onClick={onAccept}
              isDisabled={!isChecked || loading}
            >
              {loading ? "로딩중..." : "예"}
            </ButtonConfirm>
          </ButtonGroup>
        </ContentBox>
      </ModalContainer>
    </ModalBackground>
  );
};

export default IncomingCallModal;
