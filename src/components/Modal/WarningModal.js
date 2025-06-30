import React from "react";

const WarningModal = ({ onConfirm, onCancel, onClose }) => {
  let warningCount = 2;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        {/* 헤더 */}
        <div style={styles.header}>
          <span style={styles.title}>알림</span>
        </div>

        {/* 내용 */}
        <div style={styles.body}>
          <p style={styles.message}>
            부적절한 발언이 감지되었습니다. (
            <span style={styles.warningNumber}>{warningCount}</span>/3)
            <br />
            상담 내용을 확인하시겠습니까?
          </p>
        </div>

        {/* 버튼 */}
        <div style={styles.footer}>
          <button style={styles.cancelButton} onClick={onCancel}>
            아니요
          </button>
          <button style={styles.confirmButton} onClick={onConfirm}>
            네, 확인할래요.
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: "400px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    padding: "20px",
    fontFamily: "inherit",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "600",
    fontSize: "16px",
    marginBottom: "12px",
  },
  title: {
    color: "#000",
  },
  close: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#555",
  },
  body: {
    marginBottom: "20px",
  },
  message: {
    fontSize: "20px",
    color: "#111",
    lineHeight: "1.6",
    margin: 0,
  },
  warningNumber: {
    color: "#e60026",
    fontWeight: "bold",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  cancelButton: {
    flex: 1,
    height: "47px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F6FE",
    border: "none",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#707070",
  },
  confirmButton: {
    flex: 1,
    height: "47px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5c24af",
    border: "none",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "white",
  },
};

export default WarningModal;
