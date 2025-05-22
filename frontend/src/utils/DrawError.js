// Hàm vẽ bounding box lên canvas
const drawBoundingBoxes = (canvasRef, imageRef, detectionResults, imageDimensions) => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (!canvas || !image || !detectionResults.length) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size to match image display size
    canvas.width = image.offsetWidth;
    canvas.height = image.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factors
    const scaleX = image.offsetWidth / imageDimensions.width;
    const scaleY = image.offsetHeight / imageDimensions.height;

    detectionResults.forEach((detection, index) => {
        const [x1, y1, x2, y2] = detection.box;

        // Scale coordinates to match displayed image size
        const scaledX1 = x1 * scaleX;
        const scaledY1 = y1 * scaleY;
        const scaledX2 = x2 * scaleX;
        const scaledY2 = y2 * scaleY;

        const width = scaledX2 - scaledX1;
        const height = scaledY2 - scaledY1;

        // Set colors based on confidence
        const confidence = detection.confidence;
        const color = getColorByConfidence(confidence);

        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        ctx.strokeRect(scaledX1, scaledY1, width, height);

        // Draw label
        drawLabel(ctx, detection, scaledX1, scaledY1, color);
    });
};

// Hàm lấy màu theo confidence
const getColorByConfidence = (confidence) => {
    if (confidence > 0.7) return '#ff0000'; // Đỏ
    if (confidence > 0.5) return '#ff8800'; // Cam
    return '#ffff00'; // Vàng
};

// Hàm vẽ label
const drawLabel = (ctx, detection, x, y, color) => {
    const label = `${detection.class} (${(detection.confidence * 100).toFixed(1)}%)`;

    // Set font
    ctx.font = '12px Arial';
    const textMetrics = ctx.measureText(label);
    const textWidth = textMetrics.width + 8;
    const textHeight = 20;

    // Draw background
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(x, y - textHeight, textWidth, textHeight);

    // Draw text
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 1;
    ctx.fillText(label, x + 4, y - 6);
};

// Hàm xử lý khi image load xong
const handleImageLoad = (imageRef, setImageDimensions) => {
    if (imageRef.current) {
        setImageDimensions({
            width: imageRef.current.naturalWidth,
            height: imageRef.current.naturalHeight
        });
    }
};

// Hàm upload và xử lý response
const handleUploadWithDetection = async (selectedFile, setDetectionResults, setUploading) => {
    if (!selectedFile) {
        alert('Please select an image first');
        return;
    }

    try {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        const response = await fetch('http://localhost:8000/api/upload/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getCookieValue('accessToken')}`,
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Set detection results
        setDetectionResults(data.detection_results || []);

        return data;

    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    } finally {
        setUploading(false);
    }
};

// Hàm tạo overlay canvas element
const createCanvasOverlay = (imageElement) => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10';

    // Set canvas size
    canvas.width = imageElement.offsetWidth;
    canvas.height = imageElement.offsetHeight;

    return canvas;
};

// Hàm sử dụng trực tiếp với DOM (không cần React)
const drawDetectionOnImage = (imageElement, detectionResults) => {
    // Remove existing canvas if any
    const existingCanvas = imageElement.parentElement.querySelector('canvas');
    if (existingCanvas) {
        existingCanvas.remove();
    }

    // Create new canvas
    const canvas = createCanvasOverlay(imageElement);
    imageElement.parentElement.style.position = 'relative';
    imageElement.parentElement.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Get original image dimensions
    const originalWidth = imageElement.naturalWidth;
    const originalHeight = imageElement.naturalHeight;

    // Calculate scale factors
    const scaleX = imageElement.offsetWidth / originalWidth;
    const scaleY = imageElement.offsetHeight / originalHeight;

    // Draw detections
    detectionResults.forEach((detection) => {
        const [x1, y1, x2, y2] = detection.box;

        // Scale coordinates
        const scaledX1 = x1 * scaleX;
        const scaledY1 = y1 * scaleY;
        const scaledX2 = x2 * scaleX;
        const scaledY2 = y2 * scaleY;

        const width = scaledX2 - scaledX1;
        const height = scaledY2 - scaledY1;

        // Draw box
        const color = getColorByConfidence(detection.confidence);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(scaledX1, scaledY1, width, height);

        // Draw label
        drawLabel(ctx, detection, scaledX1, scaledY1, color);
    });
};

// Utility function to get cookie value
const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Export functions for use
export {
    drawBoundingBoxes,
    getColorByConfidence,
    drawLabel,
    handleImageLoad,
    handleUploadWithDetection,
    drawDetectionOnImage,
    getCookieValue
};