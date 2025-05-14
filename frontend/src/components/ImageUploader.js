import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import './styles/ImageUploader.scss';

export default function ImageUploader() {
    const [selectedImages, setSelectedImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

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
        const newImages = Array.from(files).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setSelectedImages(prev => [...prev, ...newImages]);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const removeImage = (index) => {
        setSelectedImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    return (
        <div className="image-uploader">

            <div
                className={`image-uploader__drop-area ${isDragging ? 'image-uploader__drop-area--dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {selectedImages.length > 0 ?
                    (
                        <>
                            {selectedImages.map((image, index) => (
                                <div key={index} className="image-uploader__preview-item">
                                    <img
                                        src={image.preview}
                                        alt={`Selected ${index + 1}`}
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="image-uploader__preview-item-remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </>
                    )
                    :
                    (
                        <>
                            <div className="image-uploader__icon-container">
                                <Upload size={24} />
                            </div>

                            <button
                                onClick={handleButtonClick}
                                className="image-uploader__button"
                            >
                                Chọn hình ảnh
                            </button>

                            <p className="image-uploader__text">Hoặc đưa hình ảnh vào đây</p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="image-uploader__input"
                                accept="image/*"
                                multiple
                            />
                        </>
                    )
                }

            </div>
        </div>
    );
}