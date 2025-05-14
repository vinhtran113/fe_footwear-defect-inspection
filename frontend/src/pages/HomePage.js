import React from "react";
import "./styles/HomePage.scss";
import ImageUploader from "../components/ImageUploader";
import ConnectCamera from "../components/ConnectCamera";
const HomePage = () => {

  return (
    <div className="home-container">
      <div className="project-introduction">
        <h1>Giới thiệu dự án</h1>

        <p>
          Trong thời đại công nghiệp 4.0, việc ứng dụng trí tuệ nhân tạo (AI) vào sản xuất đang trở thành xu hướng tất yếu nhằm nâng cao chất lượng sản phẩm và tối ưu hóa quy trình sản xuất. Dự án "Phần mềm phát hiện lỗi thông minh trong dây chuyền sản xuất giày dép" được xây dựng với mục tiêu áp dụng công nghệ AI để tự động phát hiện các lỗi phát sinh trong quá trình sản xuất như: lỗi keo, lỗi may, vết trầy xước, lệch chi tiết, sai mẫu mã, v.v.
        </p>

        <p>
          Hệ thống sử dụng mô hình học sâu (deep learning), cụ thể là các kỹ thuật thị giác máy tính (computer vision), để phân tích hình ảnh sản phẩm được chụp lại tại các công đoạn trong dây chuyền. Thông qua việc huấn luyện mô hình AI với tập dữ liệu ảnh lỗi và không lỗi, phần mềm có thể nhận diện nhanh chóng và chính xác các sản phẩm bị lỗi mà không cần sự can thiệp thủ công từ con người.
        </p>

        <h2>Lợi ích của hệ thống:</h2>
        <ul>
          <li>Giảm thiểu tỷ lệ sản phẩm lỗi lọt ra thị trường.</li>
          <li>Tiết kiệm chi phí nhân công kiểm tra thủ công.</li>
          <li>Nâng cao hiệu suất và tự động hóa dây chuyền sản xuất.</li>
          <li>Tạo tiền đề cho việc xây dựng hệ thống nhà máy thông minh (Smart Factory) trong tương lai.</li>
        </ul>

        <p>
          Dự án là sự kết hợp giữa công nghệ hiện đại và nhu cầu thực tiễn của ngành công nghiệp giày dép, nhằm nâng cao năng lực cạnh tranh và chất lượng sản phẩm "Made in Vietnam" trên thị trường quốc tế.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
