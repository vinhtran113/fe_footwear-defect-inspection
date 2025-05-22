import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { getCookieValue } from '../utils/token';
import './styles/ImageUploader.scss';
import SuccessfullForm from './SuccessfullForm';
import { Spin } from 'antd';
import CustomAlert from './CustomAlert';

export default function ImageUploader() {
    const [selectedImage, setSelectedImage] = useState(null); // URL để preview
    const [selectedFile, setSelectedFile] = useState(null); // File object để upload
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [detectionResults, setDetectionResults] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const file = files[0];
        if (!file) return;

        // Kiểm tra xem có phải là file image không
        if (!file.type.startsWith('image/')) {
            setAlert({
                open: true,
                message: 'Please select an image file',
                severity: 'error'
            });
            return;
        }

        // Lưu cả file object và URL preview
        setSelectedFile(file);
        setSelectedImage(URL.createObjectURL(file));
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const removeImage = () => {
        // Clean up object URL để tránh memory leak
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
        }
        setSelectedImage(null);
        setSelectedFile(null);
        setDetectionResults([]);

        // Reset input file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setAlert({
                open: true,
                message: 'Please select an image first',
                severity: 'error'
            });
            return;
        }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', selectedFile); // Sử dụng file object thay vì URL

            const response = await axios.post('http://localhost:8000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${getCookieValue('accessToken')}`,
                }
            });

            console.log('Upload successful:', response.data);
            setDetectionResults(response.data.detection_results || []);
            setUploadSuccess(true);

            setAlert({
                open: true,
                message: 'Image uploaded successfully!',
                severity: 'success'
            });
            // Có thể reset form sau khi upload thành công
            // removeImage();

        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadSuccess(false);
            if (error.response) {
                setAlert({
                    open: true,
                    message: `Upload failed: ${error.response.data.message || 'Server error'}`,
                    severity: 'error'
                });
            } else if (error.request) {
                setAlert({
                    open: true,
                    message: 'Network error. Please check your connection.',
                    severity: 'error'
                });
            } else {
                setAlert({
                    open: true,
                    message: 'Upload failed. Please try again.',
                    severity: 'error'
                });
            }
        } finally {
            setUploading(false);
        }
    };
    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };
    return (
        <Spin spinning={uploading}>
            <div className="image-uploader">

                <div
                    className={`image-uploader__drop-area ${isDragging ? 'image-uploader__drop-area--dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {selectedImage ? (
                        <div className="image-uploader__preview-item">
                            <img
                                src={selectedImage}
                                alt="Preview"
                            />
                            <button
                                onClick={removeImage}
                                className="image-uploader__preview-item-remove"
                                disabled={uploading}
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="image-uploader__icon-container">
                                <Upload size={24} />
                            </div>

                            <button
                                onClick={handleButtonClick}
                                className="image-uploader__button"
                                disabled={uploading}
                            >
                                Select image
                            </button>

                            <p className="image-uploader__text">Or drag and drop an image here.</p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="image-uploader__input"
                                accept="image/*"
                                disabled={uploading}
                            />
                        </>
                    )}
                </div>

                {selectedImage && (
                    <button
                        className='upload-btn'
                        onClick={handleUpload}
                        disabled={uploading || !selectedFile}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                )}
                {!uploading &&
                    <SuccessfullForm isOpen={uploadSuccess} selectedImage={selectedImage} detectionResults={detectionResults} />
                }

                <CustomAlert alert={alert} handleCloseAlert={handleCloseAlert} />
            </div >
        </Spin>
    );
}