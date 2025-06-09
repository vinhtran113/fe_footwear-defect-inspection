import React, { useEffect, useRef, useState } from "react";
import "./styles/ConnectCamera.scss";
import { SwitchCamera } from "lucide-react";
import CameraDectecForm from "./CameraDectecForm";
function ConnectCamera() {
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraList, setCameraList] = useState([]);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const [canvasWidth, setCanvasWidth] = useState(480);
  const [canvasHeight, setCanvasHeight] = useState(270);

  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Khởi động camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log("Danh sách camera:", videoDevices);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoDevices[0].deviceId }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraList(videoDevices);
        setCameraStream(stream);
        setCurrentCamera(videoDevices[0]);
        console.log("Camera stream:", stream);
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
    setCanvasWidth(canvas.width);

    canvas.height = video.videoHeight || 270;
    setCanvasHeight(canvas.height);

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.image_base64) {
          setResultImage(`data:image/png;base64,${result.image_base64}`);
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

  const switchToNextAvailableCamera = async () => {
    if (cameraList.length === 0 || !currentCamera) return;

    let currentIndex = cameraList.findIndex(
      (cam) => cam.deviceId === currentCamera.deviceId
    );

    for (let i = 1; i <= cameraList.length; i++) {
      const nextIndex = (currentIndex + i) % cameraList.length;
      const nextCamera = cameraList[nextIndex];

      try {
        // Dừng stream hiện tại nếu có
        if (cameraStream) {
          cameraStream.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: nextCamera.deviceId }
        });

        // Nếu thành công, gán stream và camera mới
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraStream(stream);
        setCurrentCamera(nextCamera);
        console.log("Đã chuyển sang camera:", nextCamera.label);
        return; // ✅ Dừng khi đã mở thành công
      } catch (err) {
        console.warn(`Không thể mở camera "${nextCamera.label}", thử cái tiếp theo...`);
      }
    }

    console.error("Không thể mở bất kỳ camera nào.");
  };


  return (
    <div className="camera-container">
      <span className="camera-label">Camera: {currentCamera?.label}</span>
      <div className="camera-area">
        <video ref={videoRef} autoPlay playsInline width="580" height="370" />
        <SwitchCamera onClick={switchToNextAvailableCamera} />
      </div>

      <br />
      {!isRunning ? (
        <button className="btn-start" onClick={startCapture}>Start</button>
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
