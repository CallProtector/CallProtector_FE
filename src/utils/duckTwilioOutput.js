let ctx;
let duckNodes = new Map();

export function duckTwilioOutput(conn, durationMs = 1000) {
  if (!conn?.mediaStream) return;

  conn.mediaStream.getAudioTracks().forEach((track) => {
    track.enabled = false;
  });
  console.log("🔇 상담원 오디오 mute");

  setTimeout(() => {
    conn.mediaStream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
    console.log("🔊 상담원 오디오 unmute");
  }, durationMs);
}