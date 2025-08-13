// 통화(원격) 오디오 엘리먼트를 잠깐 음소거했다가 복원
export async function duckTwilioOutput(durationMs = 1000) {
  const els = Array.from(document.querySelectorAll("audio"));
  // Twilio가 붙인 원격 오디오 엘리먼트 추정 (srcObject가 MediaStream 이거나 class/id에 twilio)
  const targets = els.filter(
    (el) =>
      (el.srcObject &&
        typeof MediaStream !== "undefined" &&
        el.srcObject instanceof MediaStream) ||
      /twilio/i.test((el.className || "") + " " + (el.id || ""))
  );

  // 상태 저장
  const states = targets.map((el) => ({
    el,
    muted: el.muted,
    volume: el.volume,
  }));

  // 음소거 (muted 가 가장 안전. 필요하면 volume=0도 병행 가능)
  targets.forEach((el) => {
    el.muted = true;
    // el.volume = 0; // 볼륨 경로로 하고 싶다면 주석 해제
  });

  await new Promise((r) => setTimeout(r, durationMs));

  // 복원
  states.forEach(({ el, muted, volume }) => {
    el.muted = muted;
    // el.volume = volume;
  });
}
