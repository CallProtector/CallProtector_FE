let ctx;
let duckNodes = new Map();

export function duckTwilioOutput(durationMs = 1000) {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();

  const els = Array.from(document.querySelectorAll("audio")).filter(
    (el) => el.srcObject && el.srcObject instanceof MediaStream
  );

  els.forEach((el) => {
    let gn = duckNodes.get(el);
    if (!gn) {
      const src = ctx.createMediaStreamSource(el.srcObject);

      gn = ctx.createGain();
      gn.gain.value = 1;

      src.connect(gn).connect(ctx.destination);
      duckNodes.set(el, gn);
    }

    const now = ctx.currentTime;

    gn.gain.cancelScheduledValues(now);
    gn.gain.setValueAtTime(0, now);
    gn.gain.setValueAtTime(1, now + durationMs / 1000);
  });
}
