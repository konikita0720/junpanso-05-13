import Sidebar from "../components/Sidebar";
import "./UploadPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function UploadPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !video) {
      alert("제목과 영상을 넣어줘");
      return;
    }
    if (!user) {
  alert("로그인 후 이용해주세요.");
  navigate("/login");
  return;
}

    const newPost = {
  id: Date.now(),
  userId: user.id,
nickname: user.nickname,
  title,
  description,
  videoUrl: URL.createObjectURL(video),
  votes: {
    "100:0": 0,
    "90:10": 0,
    "80:20": 0,
    "70:30": 0,
    "60:40": 0,
    "50:50": 0,
    "40:60": 0,
    "30:70": 0,
    "20:80": 0,
    "10:90": 0,
    "0:100": 0,
  },
  
};
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    localStorage.setItem("posts", JSON.stringify([newPost, ...savedPosts]));

    alert("게시글 올림");
    navigate("/");
  };

return (
  <div className="layout">
    <Sidebar />
    <div className="page">

    <h1 className="title">게시글 올리기</h1>

    <form className="form" onSubmit={handleSubmit}>
<input
  className="input"
  type="text"
  placeholder="제목"
  maxLength={50}
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

<p style={{ fontSize: "12px", color: "#777", textAlign: "right" }}>
  {title.length}/50
</p>


<textarea
  className="textarea"
  placeholder="내용"
  maxLength={1000}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

<p style={{ fontSize: "12px", color: "#777", textAlign: "right" }}>
  {description.length}/1000
</p>

      <input
        className="file"
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <button className="button" type="submit">
        게시글 올리기
      </button>
    </form>
   </div>
  </div>
);
}

export default UploadPage;