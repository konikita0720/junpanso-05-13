import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Link } from "react-router-dom";
function ProfilePage() {
  const savedUser = JSON.parse(localStorage.getItem("user"));

  const [nickname, setNickname] = useState(savedUser?.nickname || "");
const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

const myPosts = savedPosts.filter((post) => post.userId === savedUser?.id);

  if (!savedUser) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="page">
          <div className="card">
            <h1>프로필</h1>
            <p>로그인이 필요합니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveNickname = () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해줘");
      return;
    }

    const newNickname = nickname.trim();

    const updatedUser = {
      ...savedUser,
      nickname: newNickname,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("nickname", newNickname);

    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    const updatedPosts = savedPosts.map((post) => ({
      ...post,
      comments: (post.comments || []).map((comment) => ({
        ...comment,
        nickname:
          comment.userId === savedUser.id ? newNickname : comment.nickname,
        replies: (comment.replies || []).map((reply) => ({
          ...reply,
          nickname:
            reply.userId === savedUser.id ? newNickname : reply.nickname,
        })),
      })),
    }));

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    alert("닉네임 저장됨!");
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="page">
        <div className="card">
          <h1>프로필</h1>

          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              margin: "20px auto",
            }}
          >
            👤
          </div>

          <h2>{nickname}</h2>

          <div style={{ marginTop: "20px" }}>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginRight: "10px",
              }}
            />

            <button
              onClick={handleSaveNickname}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
              }}
            >
              저장
            </button>
          </div>

          <p>자기소개가 들어갈 자리입니다.</p>
          <div style={{ marginTop: "32px", textAlign: "left" }}>
  <h3>내가 올린 게시글</h3>

  {myPosts.length === 0 ? (
    <p style={{ color: "#777" }}>아직 올린 게시글이 없습니다.</p>
  ) : (
    myPosts.map((post) => (
      <Link
        key={post.id}
        to={`/post/${post.id}`}
        style={{
          display: "block",
          padding: "14px",
          marginTop: "10px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          textDecoration: "none",
          color: "black",
          background: "#fff",
        }}
      >
        <strong>{post.title}</strong>
        <p style={{ margin: "6px 0 0", color: "#666" }}>
          {post.description}
        </p>
      </Link>
    ))
  )}
</div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;