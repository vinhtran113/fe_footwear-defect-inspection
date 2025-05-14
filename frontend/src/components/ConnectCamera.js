import React, { useEffect, useState } from "react";

function ConnectCamera() {
    const [cameraStreams, setCameraStreams] = useState([]);

    useEffect(() => {
        // Lấy danh sách thiết bị video (camera)
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((d) => d.kind === "videoinput");

            // Tạo một danh sách promise để lấy stream từ từng camera
            const streamPromises = videoDevices.map((device) =>
                navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: device.deviceId } },
                })
                    .then((stream) => ({
                        stream,
                        label: device.label || "Camera không tên",
                        deviceId: device.deviceId,
                    }))
                    .catch((err) => {
                        console.error(`Lỗi camera ${device.deviceId}:`, err);
                        return null;
                    })
            );

            // Chờ tất cả stream hoàn tất
            Promise.all(streamPromises).then((results) => {
                const validStreams = results.filter((item) => item !== null);
                setCameraStreams(validStreams);
            });
        });
    }, []);

    return (
        <div>
            {cameraStreams.length === 0 && <p>Đang tải camera...</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {cameraStreams.map(({ stream, label, deviceId }, index) => (
                    <div key={deviceId}>
                        <h4>{label}</h4>
                        <video
                            autoPlay
                            playsInline
                            ref={(video) => {
                                if (video) video.srcObject = stream;
                            }}
                            width="320"
                            height="240"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ConnectCamera;
