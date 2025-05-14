import React from "react";
import "./styles/UploadImagePage.scss";

import ImageUploader from "../components/ImageUploader";

const UploadImagePage = () => {

    return (
        <div className="image-settings">
            <div className="image-header">
                <h1 className="title">Đăng tải hình ảnh</h1>
            </div>
            <div className="image-content">
                <ImageUploader />
            </div>
        </div>
    );
};

export default UploadImagePage;