import { useEffect, useRef, useState } from "react";

export default function EventRoom() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleMic = () => {
    streamRef.current.getAudioTracks().forEach(
      (track) => (track.enabled = !micOn)
    );
    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    streamRef.current.getVideoTracks().forEach(
      (track) => (track.enabled = !camOn)
    );
    setCamOn(!camOn);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Live Event</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: "90%", maxWidth: "500px" }}
      />

      <div style={{ marginTop: "20px" }}>
        <button onClick={toggleMic}>
          {micOn ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button onClick={toggleCamera} style={{ marginLeft: "10px" }}>
          {camOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
      </div>
    </div>
  );
}
