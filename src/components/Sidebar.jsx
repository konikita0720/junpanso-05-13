import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleUploadClick = () => {
    if (!user) {
      alert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    }

    navigate("/upload");
  };

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("nickname");

  alert("로그아웃 됨");
  navigate("/");
};

return (
  <aside className="sidebar">
    <div>
      <Link to="/" className="side-icon">📄</Link>
      <span className="side-icon">💬</span>
      <Link to="/profile" className="side-icon">👤</Link>

      <button onClick={handleUploadClick} className="side-icon plus">
        ＋
      </button>
    </div>

    {user && (
      <button onClick={handleLogout} className="side-icon">
        ⎋
      </button>
    )}
  </aside>
);
}

export default Sidebar;