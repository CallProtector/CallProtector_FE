import React, { useState } from "react";
import IncomingCallModal from "../components/Modal/IncomingCallModal";

const Landing = () => {
  /* 통화 수신 팝업 테스트 */
  const [showModal, setShowModal] = useState(false);

  const handleAccept = () => {
    console.log("통화 연결 페이지 이동");
    setShowModal(false);
  };

  const handleReject = () => {
    console.log("기존 페이지 유지");
    setShowModal(false);
  };

  return (
    <div>
      Landing
      <button onClick={() => setShowModal(true)}>수신 팝업 테스트</button>
      <IncomingCallModal
        show={showModal}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
};

export default Landing;
