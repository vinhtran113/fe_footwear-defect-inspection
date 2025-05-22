import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import "../pages/styles/LoginPage.scss";
import imgWelcome from "../assets/imgWelcome.png";
import { AuthContext } from "../context/auth-context";
import Loading from "../components/Loading";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username: userName,
        password: password,
      });

      console.log(response.data);

      if (!response.data.msg || response.data.msg !== "Login successful") {
        throw new Error(response.data.message || "Đăng nhập thất bại");
      }

      // Login success
      auth.login(response.data.access, response.data.refresh);
      setIsLoading(false);
      navigate("/hitek-solution/home");

    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading ? <Loading /> :
        <div className="login-page">
          <div className="login-container">
            <div className="login-form">
              <div className="form-header">
                <h1>Chào mừng trở lại!</h1>
                <p>Đăng nhập để trải nghiệm dịch vụ</p>
              </div>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email <span className="required">(*)</span></label>
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập của bạn"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu <span className="required">(*)</span></label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="btn-container">
                  <button type="submit" className="btn btn-login">
                    Đăng nhập
                  </button>
                </div>

              </form>
            </div>
            <div className="login-image">
              <img src={imgWelcome} alt="Login illustration" />
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default LoginPage;
