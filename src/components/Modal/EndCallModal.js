import React from "react";

const EndCallModal = ({ onCancel, onConfirm }) => {
  return (
    <>
      <style>{`
        .endcall-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .endcall-modal {
          background-color: white;
          padding: 32px;
          border-radius: 16px;
          width: 400px;
          text-align: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .endcall-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .endcall-message {
          font-size: 20px;
          color: #444;
          margin-bottom: 28px;
        }

        .endcall-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
        }
        
        .endcall-buttons button {
          min-width: 140px; 
          text-align: center;
        }


        .btn-cancel {
          padding: 10px 20px;
          background-color: #F3F6FE;
          border: none;
          border-radius: 8px;
          color: #707070;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-confirm {
          padding: 10px 20px;
          background-color: #5C24AF;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>

      <div className="endcall-modal-backdrop">
        <div className="endcall-modal">
          <h2 className="endcall-title">상담이 종료되었습니다.</h2>
          <p className="endcall-message">잠시 후 메인 화면으로 이동합니다.</p>
          <div className="endcall-buttons">
            <button className="btn-cancel" onClick={onCancel}>
              아니요
            </button>
            <button className="btn-confirm" onClick={onConfirm}>
              네, 이동할래요.
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EndCallModal;
