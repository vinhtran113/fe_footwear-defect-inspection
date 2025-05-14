import React from "react";
import "./styles/WebcamPage.scss";

import ConnectCamera from "../components/ConnectCamera";

const WebcamPage = () => {

    return (
        <div className="camera-settings">
            <div className="camera-header">
                <h1 className="title">Camera</h1>
            </div>
            <div className="camera-content">
                <ConnectCamera />
            </div>
        </div>
    );
};

export default WebcamPage;