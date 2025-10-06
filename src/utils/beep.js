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

  // 메인 비프 오실레이터 (1kHz)
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = 1000;

  // 고주파 오실레이터 (2kHz)
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 2000;

  // 화이트 노이즈 생성
  const bufferSize = ctx.sampleRate * (durationMs / 1000);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  // 노이즈 필터
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 1600;
  noiseFilter.Q.value = 0.8;

  // 전체 톤 필터 (soft bandpass)
  const mainFilter = ctx.createBiquadFilter();
  mainFilter.type = "bandpass";
  mainFilter.frequency.value = 1300;
  mainFilter.Q.value = 0.7;

  // 게인 조절
  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.35, ctx.currentTime);
  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.15, ctx.currentTime);

  // 연결: [osc1 + osc2 + noise] → filter → gain → destination
  osc1.connect(mainFilter);
  osc2.connect(mainFilter);
  noise.connect(noiseFilter).connect(mainFilter);
  mainFilter.connect(gain1).connect(ctx.destination);
  osc2.connect(gain2).connect(ctx.destination);

  // 시작
  osc1.start();
  osc2.start();
  noise.start();

  await new Promise((r) => setTimeout(r, durationMs));

  // 정리
  [osc1, osc2, noise].forEach((n) => {
    try { n.stop(); n.disconnect(); } catch {}
  });
  [noiseFilter, mainFilter, gain1, gain2].forEach((n) => {
    try { n.disconnect(); } catch {}
  });

  beepLock = false;
}
