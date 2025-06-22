import React, { useRef, useState } from "react";
import "./styles/ConnectCamera.scss";
import CameraDectecForm from "./CameraDectecForm";

function ConnectCamera() {
  const [resultImage, setResultImage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(480);
  const [canvasHeight, setCanvasHeight] = useState(270);

  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const frameIndexRef = useRef(0);
  const lastDisplayedIndexRef = useRef(-1);
  const fileInputRef = useRef(null);

  const handleStartClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const handleUploadVideo = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = videoURL;

        videoRef.current.onloadeddata = () => {
          videoRef.current.play();
          startCapture(); // Bắt đầu gửi frame sau khi video load xong
        };
      }
    }
  };

  const captureAndSendFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 270;

    setCanvasWidth(canvas.width);
    setCanvasHeight(canvas.height);

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const currentIndex = frameIndexRef.current++;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, `frame_${currentIndex}.jpg`);

      try {
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        // Chỉ hiển thị nếu đây là frame mới nhất
        if (result.image_base64 && currentIndex > lastDisplayedIndexRef.current) {
          lastDisplayedIndexRef.current = currentIndex;
          setResultImage(`data:image/png;base64,${result.image_base64}`);
        }
      } catch (error) {
        console.error("Lỗi gửi frame:", error);
      }
    }, "image/jpeg");
  };


  const startCapture = () => {
    if (isRunning) return;
    frameIndexRef.current = 0;
    lastDisplayedIndexRef.current = -1;
    setIsRunning(true);
    captureAndSendFrame();

    intervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, 200);
  };

  const stopCapture = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="camera-container">
      <h3 style={{ marginBottom: "10px" }}>Chọn video để phân tích:</h3>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleUploadVideo}
        style={{ display: "none" }}
      />
      <div className="camera-area">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          controls
          width="580"
          height="370"
        />
      </div>

      {!isRunning ? (
        <button className="btn-start" onClick={handleStartClick}
          style={{ marginTop: "10px" }}
        >
          Upload
        </button>
      ) : (
        <CameraDectecForm
          isOpen={isRunning}
          resultImage={resultImage}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          stopCapture={stopCapture}
        />
      )}
    </div>
  );
}

export default ConnectCamera;
