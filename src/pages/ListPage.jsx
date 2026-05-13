import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ListPage.css";

const voteOptions = [
  "100:0",
  "90:10",
  "80:20",
  "70:30",
  "60:40",
  "50:50",
  "40:60",
  "30:70",
  "20:80",
  "10:90",
  "0:100",
];

function ListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);

  const getVotes = (post) => {
    return (
      post.votes ||
      voteOptions.reduce((acc, option) => {
        acc[option] = 0;
        return acc;
      }, {})
    );
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page">
          <div className="header">
            <h1>블박 투표</h1>
          </div>

          <div className="list">
            {posts.length === 0 ? (
              <p className="empty">아직 게시글이 없음</p>
            ) : (
              posts.map((post) => {
                const votes = getVotes(post);
                const total = Object.values(votes).reduce(
                  (sum, count) => sum + count,
                  0
                );

                const topVotes = Object.entries(votes)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3);

                return (
                  <Link
                    to={`/post/${post.id}`}
                    className="card-link"
                    key={post.id}
                  >
                    <div className="card">
<div
  style={{
    width: "100%",
    aspectRatio: "16 / 9",
    background: "black",
    overflow: "hidden",
    borderRadius: "12px 12px 0 0",
  }}
>
  <video
    src={post.videoUrl}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block",
    }}
  />
</div>

                      <div className="content">
                        <h2>{post.title}</h2>
<p>
  {post.description?.length > 60
    ? post.description.slice(0, 60) + "..."
    : post.description}
</p>

                        <div className="vote-preview">
                          {total === 0 ? (
                            <span>아직 투표 없음</span>
                          ) : (
                            topVotes.map(([option, count]) => {
                              const percent = Math.round((count / total) * 100);

                              return (
                                <span key={option}>
                                  {option} {percent}%
                                </span>
                              );
                            })
                          )}
                        </div>

                        <p style={{ fontSize: "14px", color: "#777" }}>
                          총 {total}명 참여
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListPage;