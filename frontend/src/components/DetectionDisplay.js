import { useRef, useEffect, useState } from 'react';

// Import các hàm từ file boundingBoxFunctions.js
import {
    drawBoundingBoxes,
    getColorByConfidence,
    drawLabel,
    handleImageLoad
} from '../utils/DrawError';

const DetectionDisplay = ({
    imageSrc,
    detectionResults = [],
    className = "",
    style = {}
}) => {
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);

    // Xử lý khi image load xong
    const onImageLoad = () => {
        if (imageRef.current) {
            setImageDimensions({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight
            });
            setImageLoaded(true);
        }
    };

    // Vẽ bounding boxes khi có detection results hoặc image dimensions thay đổi
    useEffect(() => {
        if (imageLoaded && detectionResults.length > 0 && imageDimensions.width > 0) {
            // Delay nhỏ để đảm bảo image đã render xong
            setTimeout(() => {
                drawBoundingBoxes(canvasRef, imageRef, detectionResults, imageDimensions);
            }, 100);
        }
    }, [detectionResults, imageDimensions, imageLoaded]);

    // Xử lý resize window
    useEffect(() => {
        const handleResize = () => {
            if (imageLoaded && detectionResults.length > 0) {
                setTimeout(() => {
                    drawBoundingBoxes(canvasRef, imageRef, detectionResults, imageDimensions);
                }, 100);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [detectionResults, imageDimensions, imageLoaded]);

    // Reset khi image src thay đổi
    useEffect(() => {
        setImageLoaded(false);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [imageSrc]);

    return (
        <div
            className={`detection-display-container ${className}`}
            style={{
                position: 'relative',
                display: 'inline-block',
                ...style
            }}
        >
            <img
                ref={imageRef}
                src={imageSrc}
                alt="Detection Preview"
                onLoad={onImageLoad}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block'
                }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            />
        </div>
    );
};

export default DetectionDisplay;