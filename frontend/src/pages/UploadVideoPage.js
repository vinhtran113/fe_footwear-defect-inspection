import React from "react";
import "./styles/WebcamPage.scss";

import VideoUploader from "../components/VideoUploader";

const WebcamPage = () => {

    return (
        <div className="camera-settings">
            <div className="camera-header">
                <h1 className="title">Upload Videos</h1>
            </div>
            <div className="camera-content">
                <VideoUploader />
            </div>
        </div>
    );
};

export default WebcamPage;