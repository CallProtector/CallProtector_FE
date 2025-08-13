let ctx = null;
let primed = false;
let beepLock = false;

// 사용자 제스처(클릭 등) 이후 1회 호출 → 오디오 컨텍스트 프라임
export function primeBeep() {
  if (primed) return;
  const A = window.AudioContext || window.webkitAudioContext;
  if (!A) return;
  ctx = new A();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  primed = true;

  // 무음 1 샘플 재생으로 초기 활성화
  const buf = ctx.createBuffer(1, 1, 8000);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  try {
    src.start(0);
  } catch {}
}

// 비프 재생(1kHz, 기본 1초)
export async function playBeep(durationMs = 1000) {
  if (!primed || !ctx) return; // 아직 프라임 안 됨
  if (beepLock) return; // 중복 방지
  beepLock = true;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = 1000; // 1 kHz
  gain.gain.setValueAtTime(0.15, ctx.currentTime); // 볼륨

  osc.connect(gain).connect(ctx.destination);
  osc.start();

  await new Promise((r) => setTimeout(r, durationMs));

  try {
    osc.stop();
  } catch {}
  try {
    osc.disconnect();
    gain.disconnect();
  } catch {}
  beepLock = false;
}
