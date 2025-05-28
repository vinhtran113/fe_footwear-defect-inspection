import React, { useState } from "react";
import "./styles/SuccessfullForm.scss";

import { Modal } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const CameraDectecForm = ({
    isOpen,
    resultImage,
    canvasWidth,
    canvasHeight,
    stopCapture
}) => {
    const [showForm, setShowForm] = useState(isOpen);
    console.log(isOpen);
    return (

        <Modal open={showForm}>
            <div className="success-form-container">
                <div className={`success-form ${showForm ? "show" : ""}`}>
                    <h2> Detection Results</h2>
                    <HighlightOffIcon
                        className="close-icon"
                        onClick={() => { setShowForm(false); stopCapture(); }}
                    />
                    {resultImage ? (
                        <img
                            src={resultImage}
                            alt="Kết quả"
                            width={canvasWidth}
                            height={canvasHeight}
                            style={{ border: "1px solid #ccc", objectFit: "contain" }}
                        />
                    ) : (
                        <p>No results available</p>
                    )}
                </div>
            </div>
        </Modal>

    );
};

export default CameraDectecForm;
