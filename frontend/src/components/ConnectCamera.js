import React, { useEffect, useRef, useState } from "react";

function ConnectCamera() {
  const [cameraStream, setCameraStream] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Khởi động camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraStream(stream);
      } catch (err) {
        console.error("Không thể truy cập camera:", err);
      }
    };

    startCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
      stopCapture();
    };
  }, []);

  // Hàm gọi API gửi ảnh
  const captureAndSendFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 270;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      try {
        const response = await fetch("http://localhost:8000/api/realtime/", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.result_image) {
          setResultImage(result.result_image);
        }
      } catch (error) {
        console.error("Lỗi gửi frame:", error);
      }
    }, "image/jpeg");
  };

  const startCapture = () => {
    if (isRunning) return;
    setIsRunning(true);
    captureAndSendFrame();

    intervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, 200); // 100ms/callapi
  };

  const stopCapture = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
      <div>
        <h3>Camera Live</h3>
        <video ref={videoRef} autoPlay playsInline width="480" height="270" />
        <br />
        {!isRunning ? (
          <button onClick={startCapture}>Start</button>
        ) : (
          <button onClick={stopCapture}>Stop</button>
        )}
      </div>

      <div>
        <h3>Kết quả nhận dạng</h3>
        {resultImage ? (
          <img
            src={resultImage}
            alt="Kết quả"
            width="480"
            height="270"
            style={{ border: "1px solid #ccc", objectFit: "contain" }}
          />
        ) : (
          <p>Chưa có kết quả</p>
        )}
      </div>
    </div>
  );
}

export default ConnectCamera;
