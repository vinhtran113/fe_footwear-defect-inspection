import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import "./styles/ContactPage.scss";

// Main component
export default function ContactPage() {
    const [isMapExpanded, setIsMapExpanded] = useState(false);

    return (
        <div className="contact-container">
            <h1 className="company-title">CÔNG TY CỔ PHẦN HITEK SOLUTION</h1>

            <div className="contact-wrapper">
                {/* Contact Information Section */}
                <div className="contact-info">
                    <div className="contact-section">
                        <h2 className="section-title">Trụ sở chính</h2>

                        <div className="contact-item">
                            <MapPin className="contact-icon" size={20} />
                            <div>
                                <strong>Địa chỉ:</strong> 18 Đường số 2, Cư xá dài Ra đa Phú Lâm, Phường 13, Quận 6, Thành phố Hồ Chí Minh
                            </div>
                        </div>

                        <div className="contact-item">
                            <Phone className="contact-icon" size={20} />
                            <div>
                                <strong>Hotline:</strong> 0903 172 118
                            </div>
                        </div>

                        <div className="contact-item">
                            <Mail className="contact-icon" size={20} />
                            <div>
                                <strong>Email:</strong> <a href="mailto:contact@hitek-solution.com" className="contact-link">contact@hitek-solution.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="contact-section">
                        <h2 className="section-title">Phòng kinh doanh</h2>

                        <div className="contact-item">
                            <Mail className="contact-icon" size={20} />
                            <div>
                                <strong>Email:</strong> <a href="mailto:sale@hitek-solution.com" className="contact-link">sale@hitek-solution.com</a>
                            </div>
                        </div>

                        <div className="contact-item">
                            <Phone className="contact-icon" size={20} />
                            <div>
                                <strong>Hotline tư vấn:</strong> 0908 200 226
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="map-container">
                    <div className={`map-frame ${isMapExpanded ? 'expanded' : ''}`}>
                        {/* Google Map placeholder - in a real application, you would use Google Maps API */}
                        <div className="map-content">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.914497751152!2d106.62526577585817!3d10.749355859692456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752dd5344c34b1%3A0x19505190f644075b!2zMTggxJDGsOG7nW5nIFPGoWkgMiwgUGjGsOG7nW5nIDEzLCBRdeG6rW4gNiwgSMOgIENow7osIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1715673945612!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Bản đồ Hitek Solution"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}