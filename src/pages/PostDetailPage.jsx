const getRandomNickname = () => {
  const animals = ["호랑이", "고양이", "강아지", "여우", "늑대"];
  const adjectives = ["빠른", "귀여운", "화난", "졸린", "용감한"];

  const animal = animals[Math.floor(Math.random() * animals.length)];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

  return `${adj} ${animal}`;
};
const getUserNickname = () => {
  let nickname = localStorage.getItem("nickname");

  if (!nickname) {
    nickname = getRandomNickname();
    localStorage.setItem("nickname", nickname);
  }

  return nickname;
};

import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const voteOptions = [
  "100:0", "90:10", "80:20", "70:30", "60:40",
  "50:50", "40:60", "30:70", "20:80", "10:90", "0:100",
];

function PostDetailPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const foundPost = savedPosts.find((item) => String(item.id) === id);
    setPost(foundPost);
  }, [id]);

  const getVotes = (post) => {
    return (
      post.votes ||
      voteOptions.reduce((acc, option) => {
        acc[option] = 0;
        return acc;
      }, {})
    );
  };

  const updatePost = (updateFn) => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    const updatedPosts = savedPosts.map((item) => {
      if (String(item.id) === id) {
        return updateFn(item);
      }
      return item;
    });

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    const updatedPost = updatedPosts.find((item) => String(item.id) === id);
    setPost(updatedPost);
  };

  const handleVote = (option) => {
      if (!user) {
    alert("로그인 후 이용해주세요.");
    return;
  }
    updatePost((item) => {
      const currentVotes = getVotes(item);

      return {
        ...item,
        votes: {
          ...currentVotes,
          [option]: (currentVotes[option] || 0) + 1,
        },
      };
    });

    setIsPopupOpen(false);
    setSelectedOption("");
  };
    const handleDeletePost = () => {
  if (!user) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  if (post.userId !== user.id) {
    alert("내가 올린 게시글만 삭제할 수 있습니다.");
    return;
  }

  const isConfirm = window.confirm("게시글을 삭제하시겠습니까?");

  if (!isConfirm) return;

  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

  const updatedPosts = savedPosts.filter(
    (item) => String(item.id) !== String(post.id)
  );

  localStorage.setItem("posts", JSON.stringify(updatedPosts));

  alert("게시글이 삭제되었습니다.");
  navigate("/");
};

const handleDeleteComment = (commentId) => {
  if (!user) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  updatePost((item) => ({
    ...item,
    comments: (item.comments || []).map((comment) => {
      if (comment.id === commentId) {
if (comment.userId !== user.id) {
  alert("내가 쓴 댓글만 삭제할 수 있습니다.");
  return comment;
}

const isConfirm = window.confirm("삭제하시겠습니까?");

if (!isConfirm) {
  return comment;
}

alert("삭제되었습니다.");

return {
  ...comment,
  isDeleted: true,
  deletedText: comment.text,
  deletedNickname: comment.nickname,
  deletedAt: new Date().toISOString(),
  text: "삭제된 댓글입니다.",
};
      }

      return comment;
    }),
  }));
};
const handleDeleteReply = (commentId, replyId) => {
  if (!user) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  const isConfirm = window.confirm("삭제하시겠습니까?");

  if (!isConfirm) {
    return;
  }

  updatePost((item) => ({
    ...item,
    comments: (item.comments || []).map((comment) => {
      if (comment.id !== commentId) return comment;

      return {
        ...comment,
        replies: (comment.replies || []).map((reply) => {
          if (reply.id !== replyId) return reply;

          if (reply.userId !== user.id) {
            alert("내가 쓴 답글만 삭제할 수 있습니다.");
            return reply;
          }

          return {
            ...reply,
            isDeleted: true,
            deletedText: reply.text,
            deletedNickname: reply.nickname,
            deletedAt: new Date().toISOString(),
            text: "삭제된 답글입니다.",
          };
        }),
      };
    }),
  }));

  alert("삭제되었습니다.");
};

const handleSubmitComment = () => {
  if (!user) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  if (!commentText.trim()) {
          alert("내용을 입력해주세요");
      return;
    }

    updatePost((item) => {
      const currentComments = item.comments || [];

      if (replyTarget) {
        return {
          ...item,
          comments: currentComments.map((comment) => {
            if (comment.id === replyTarget.id) {
              return {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  {
  id: Date.now(),
  text: commentText,
nickname: user.nickname,
userId: user.id,
}
                ],
              };
            }

            return comment;
          }),
        };
      }

      return {
  ...item,
  comments: [
    ...currentComments,
    {
      id: Date.now(),
      text: commentText,
nickname: user.nickname,
userId: user.id,
  replies: [],
}
  ],
};
    });

    setCommentText("");
    setReplyTarget(null);
  };

  if (!post) {
    return (
      <div className="page">
        <p>게시글 없음</p>
        <Link to="/">목록으로</Link>
      </div>
    );
  }

  const votes = getVotes(post);
  const total = Object.values(votes).reduce((sum, count) => sum + count, 0);
  const comments = post.comments || [];

  return (
    <div className="page" style={{ paddingBottom: "90px" }}>
      <Link to="/">← 목록으로</Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(640px, 1fr) 300px",
          gap: "50px",
          alignItems: "flex-start",
        }}
      >
        <div className="card" style={{ width: "100%" }}>
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
<h1
  style={{
    fontSize: "28px",
    lineHeight: "1.35",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    marginBottom: "12px",
  }}
>
  {post.title}
</h1>
<p
  style={{
    lineHeight: "1.6",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  }}
>
  {post.description}
</p>
            {user && post.userId === user.id && (
  <button
    onClick={handleDeletePost}
    style={{
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "#dc2626",
      color: "white",
      fontSize: "15px",
      marginTop: "16px",
      cursor: "pointer",
    }}
  >
    게시글 삭제
  </button>
)}


<div style={{ marginTop: "32px", textAlign: "left" }}>
  <h3 style={{ textAlign: "center" }}>댓글</h3>

              {comments.length === 0 ? (
                <p style={{ color: "#777" }}>아직 댓글이 없음</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: "16px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <strong>{comment.nickname || "익명"}</strong>

                    <p style={{ marginTop: "6px" }}>{comment.text}</p>

{!comment.isDeleted && user && comment.userId === user.id && (
  <button
    onClick={() => handleDeleteComment(comment.id)}
    style={{
      border: "none",
      background: "transparent",
      color: "#dc2626",
      cursor: "pointer",
      padding: 0,
      marginRight: "12px",
    }}
  >
    삭제
  </button>
)}

{!comment.isDeleted && (
  <button
    onClick={() => setReplyTarget(comment)}
    style={{
      border: "none",
      background: "transparent",
      color: "#2563eb",
      cursor: "pointer",
      padding: 0,
    }}
  >
    답글 달기
  </button>
)}
{(comment.replies || []).map((reply) => (
  <div
    key={reply.id}
    style={{
      marginLeft: "50px",
      marginTop: "14px",
      display: "flex",
      gap: "10px",
      alignItems: "flex-start",
    }}
  >
    <span
      style={{
        color: "#9ca3af",
        fontSize: "20px",
        lineHeight: "20px",
      }}
   >
      ㄴ
    </span>

    <div>
<strong>
  {reply.isDeleted ? "알 수 없음" : reply.nickname || "익명"}
</strong>

<p style={{ marginTop: "4px", color: reply.isDeleted ? "#999" : "black" }}>
  {reply.text}
</p>

{!reply.isDeleted && user && reply.userId === user.id && (
  <button
    onClick={() => handleDeleteReply(comment.id, reply.id)}
    style={{
      border: "none",
      background: "transparent",
      color: "#dc2626",
      cursor: "pointer",
      padding: 0,
    }}
  >
    삭제
  </button>
)}
    </div>
  </div>
))}                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            width: "300px",
            position: "sticky",
            top: "24px",
            background: "white",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          }}
        >
          <h3>투표 결과</h3>

          {voteOptions.map((option) => {
            const count = votes[option] || 0;
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);

            return (
              <div key={option} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{option}</span>
                  <span>{count}표 / {percent}%</span>
                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden",
                    marginTop: "6px",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: "#2563eb",
                    }}
                  />
                </div>
              </div>
            );
          })}

          <p>총 {total}명 참여</p>
          <button
  onClick={() => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    setIsPopupOpen(true);
  }}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  투표하기
</button>
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "20px",
          transform: "translateX(-50%)",
          width: "min(720px, calc(100% - 40px))",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: "999px",
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 20,
        }}
      >
        {replyTarget && (
          <button
            onClick={() => setReplyTarget(null)}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: "999px",
              padding: "8px 10px",
              cursor: "pointer",
            }}
          >
            답글 취소
          </button>
        )}

<input
  value={commentText}
  onChange={(e) => setCommentText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitComment();
    }
  }}
  placeholder={
    replyTarget
  ? `${replyTarget.nickname || "익명"}에게 답글 입력 중...`
  : "댓글을 입력하세요"
  }
  style={{
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "15px",
  }}
/>
        <button
          onClick={handleSubmitComment}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ›
        </button>
      </div>

      {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 30,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <h2>과실 비율 선택</h2>

            <div style={{ display: "grid", gap: "10px" }}>
              {voteOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedOption(option)}
                  style={{
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                    background: selectedOption === option ? "#2563eb" : "white",
                    color: selectedOption === option ? "white" : "black",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (!selectedOption) {
                  alert("과실 비율을 선택해줘");
                  return;
                }
                handleVote(selectedOption);
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "14px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "white",
              }}
            >
              투표하기
            </button>

            <button
              onClick={() => {
                setIsPopupOpen(false);
                setSelectedOption("");
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                borderRadius: "10px",
                border: "none",
                background: "#111827",
                color: "white",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetailPage;