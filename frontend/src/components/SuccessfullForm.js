import React, { useState } from "react";
import "./styles/SuccessfullForm.scss";

import { Modal } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

import DetectionDisplay from './DetectionDisplay';

const SuccessfullForm = ({ isOpen, selectedImage, detectionResults }) => {
    const [showForm, setShowForm] = useState(isOpen);
    console.log(detectionResults)
    return (

        <Modal open={showForm}>
            <div className="success-form-container">
                <div className={`success-form ${showForm ? "show" : ""}`}>
                    <h2> Detection Results</h2>
                    <HighlightOffIcon className="close-icon" onClick={() => setShowForm(false)} />
                    <DetectionDisplay
                        imageSrc={selectedImage}
                        detectionResults={detectionResults}
                    />
                </div>
            </div>
        </Modal>

    );
};

export default SuccessfullForm;
