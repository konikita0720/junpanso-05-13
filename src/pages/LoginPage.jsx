import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function LoginPage() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해줘");
      return;
    }

    const user = {
      id: `user-${Date.now()}`,
      nickname: nickname.trim(),
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("nickname", user.nickname);

    alert("로그인 됨!");
    navigate("/");
  };

  return (
    <div className="layout">
      <Sidebar />

      <main className="main-content">
        <div className="page">
          <div className="card">
            <h1>로그인</h1>
            <p>닉네임을 입력해서 임시 로그인하세요.</p>

            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                marginTop: "20px",
                fontSize: "16px",
              }}
            />

            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "white",
                marginTop: "14px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              로그인
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
export default LoginPage;