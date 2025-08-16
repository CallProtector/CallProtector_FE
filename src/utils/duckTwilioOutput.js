// 통화(원격) 오디오 엘리먼트를 잠깐 음소거했다가 복원
export function duckTwilioOutput(durationMs = 1000, { mode = "mute" } = {}) {
  const els = Array.from(document.querySelectorAll("audio"));
  // Twilio 원격 오디오 추정: MediaStream을 소스로 갖거나 클래스/ID에 twilio
  const targets = els.filter(
    (el) =>
      (el.srcObject &&
        typeof MediaStream !== "undefined" &&
        el.srcObject instanceof MediaStream) ||
      /twilio/i.test((el.className || "") + " " + (el.id || ""))
  );

  // 현재 상태 저장(복원용)
  const states = targets.map((el) => ({
    el,
    muted: el.muted,
    volume: el.volume,
  }));

  // 🔇 즉시 덕킹(음소거 또는 볼륨 0)
  if (mode === "volume") {
    targets.forEach((el) => (el.volume = 0));
  } else {
    targets.forEach((el) => (el.muted = true)); // 기본: 완전 음소거
  }

  // durationMs 뒤 복원 (비동기, 호출 측에서 기다릴 필요 없음)
  setTimeout(() => {
    states.forEach(({ el, muted, volume }) => {
      if (mode === "volume") el.volume = volume;
      else el.muted = muted;
    });
  }, Math.max(0, durationMs));
}
