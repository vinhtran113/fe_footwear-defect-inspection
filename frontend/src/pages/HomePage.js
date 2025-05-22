import React from "react";
import "./styles/HomePage.scss";
import ImageUploader from "../components/ImageUploader";
import ConnectCamera from "../components/ConnectCamera";
const HomePage = () => {

  return (
    <div className="home-container">
      <div className="project-introduction">
        <h1>Project Introduction</h1>

        <p>
          In the era of Industry 4.0, the application of Artificial Intelligence (AI) in manufacturing has become an inevitable trend to improve product quality and optimize production processes. The project "Intelligent Defect Detection Software for Footwear Production Lines" is developed with the goal of applying AI technology to automatically detect defects that may arise during production, such as glue errors, stitching defects, scratches, misaligned parts, incorrect designs, and more.
        </p>

        <p>
          The system utilizes deep learning models, specifically computer vision techniques, to analyze images of products captured at various stages of the production line. By training the AI model on datasets containing both defective and non-defective images, the software can quickly and accurately identify defective products without manual human intervention.
        </p>

        <h2>System Benefits:</h2>
        <ul>
          <li>Minimizes the number of defective products reaching the market.</li>
          <li>Reduces the cost of manual inspection labor.</li>
          <li>Improves efficiency and automates the production line.</li>
          <li>Lays the foundation for building future Smart Factory systems.</li>
        </ul>

        <p>
          This project is a combination of advanced technology and the practical needs of the footwear industry, aiming to enhance the competitiveness and product quality of "Made in Vietnam" goods in the international market.
        </p>
      </div>

    </div>
  );
};

export default HomePage;
