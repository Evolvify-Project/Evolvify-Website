import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdOutlineAddComment } from "react-icons/md";
import { FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const categories = [
  "Presentation skill",
  "Interview skill",
  "Communication skill",
  "Time management skill",
  "Teamwork skill",
];

const API_BASE_URL = "https://evolvify.runasp.net/api/Community";

function Community() {
  const [activeTab, setActiveTab] = useState("My posts");
  const [selectedCategory, setSelectedCategory] = useState("Communication skill");
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [showComments, setShowComments] = useState({});
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("username") || "Anonymous";
  const userRole = localStorage.getItem("userRole") || "User";

  axios.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Post`, {
        headers: { Accept: "*/*" },
      });
      const fetchedPosts = response.data.data.map((post) => ({
        ...post,
        liked: false,
        saved: false,
        category: categories[Math.floor(Math.random() * categories.length)],
        comments: [],
        commentsCount: post.commentsCount || 0,
      }));
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    if (!accessToken) {
      setError("Please log in to post.");
      navigate("/login");
      return;
    }
    if (!newPost.trim()) return;
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Post`,
        { content: newPost, userName },
        { headers: { Accept: "*/*", "Content-Type": "application/json" } }
      );
      setPosts([
        {
          ...response.data.data,
          liked: false,
          saved: false,
          category: selectedCategory,
          userName,
          comments: [],
          commentsCount: 0,
        },
        ...posts,
      ]);
      setNewPost("");
    } catch (err) {
      setError("Failed to add post");
      console.error("Add post error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const toggleLike = async (postId) => {
    if (!accessToken) {
      setError("Please log in to like posts.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/Post/${postId}/Like`,
        {},
        {
          headers: { Accept: "*/*" },
        }
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likesCount: post.liked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
              }
            : post
        )
      );
    } catch (err) {
      setError("Failed to toggle like");
      console.error("Toggle like error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const toggleSave = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  const deletePost = async (postId) => {
    if (!accessToken) {
      setError("Please log in to delete posts.");
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${API_BASE_URL}/Post/${postId}`, {
        headers: { Accept: "*/*" },
      });
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      setError("Failed to delete post: " + (err.response?.data?.message || err.message));
      console.error("Delete post error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Post/${postId}/Comment`
      );
      const comments = response.data.data || [];
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const repliesResponse = await axios.get(
            `${API_BASE_URL}/Comment/${comment.id}/Reply`
          );
          return {
            ...comment,
            userName: comment.userName || userName,
            replies:
              repliesResponse.data.data.map((reply) => ({
                ...reply,
                userName: reply.userName || userName,
                liked: false,
                likesCount: reply.likesCount || 0,
              })) || [],
            repliesCount: repliesResponse.data.data.length || 0,
            liked: false,
            likesCount: comment.likesCount || 0,
          };
        })
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: commentsWithReplies,
                commentsCount: commentsWithReplies.length,
              }
            : post
        )
      );
    } catch (err) {
      console.error(
        "Failed to fetch comments:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const addComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/Post/${postId}/Comment`, {
        content: newComment[postId],
        userName,
      });
      setNewComment({ ...newComment, [postId]: "" });
      fetchComments(postId);
    } catch (err) {
      console.error(
        "Failed to add comment:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const addReply = async (postId, commentId) => {
    if (!newReply[commentId]?.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/Comment/${commentId}/Reply`, {
        content: newReply[commentId],
        userName,
      });
      setNewReply({ ...newReply, [commentId]: "" });
      fetchComments(postId);
    } catch (err) {
      console.error("Failed to add reply:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const editComment = async (postId, commentId, content) => {
    try {
      await axios.put(`${API_BASE_URL}/Post/${postId}/Comment/${commentId}`, {
        content,
        userName,
      });
      fetchComments(postId);
    } catch (err) {
      console.error(
        "Failed to edit comment:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/Post/${postId}/Comment/${commentId}`);
      fetchComments(postId);
    } catch (err) {
      console.error(
        "Failed to delete comment:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const toggleCommentLike = async (commentId, postId) => {
    if (!accessToken) {
      setError("Please log in to like comments.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/Comment/${commentId}/Like`,
        {},
        {
          headers: { Accept: "*/*" },
        }
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        liked: !comment.liked,
                        likesCount: comment.liked
                          ? comment.likesCount - 1
                          : comment.likesCount + 1,
                      }
                    : comment
                ),
              }
            : post
        )
      );
    } catch (err) {
      setError("Failed to toggle comment like");
      console.error(
        "Toggle comment like error:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const toggleReplyLike = async (replyId, postId, commentId) => {
    if (!accessToken) {
      setError("Please log in to like replies.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/Comment/${replyId}/Like`,
        {},
        {
          headers: { Accept: "*/*" },
        }
      );
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.map((reply) =>
                          reply.id === replyId
                            ? {
                                ...reply,
                                liked: !reply.liked,
                                likesCount: reply.liked
                                  ? reply.likesCount - 1
                                  : reply.likesCount + 1,
                              }
                            : reply
                        ),
                      }
                    : comment
                ),
              }
            : post
        )
      );
    } catch (err) {
      setError("Failed to toggle reply like");
      console.error(
        "Toggle reply like error:",
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const filteredPosts =
    activeTab === "Saved"
      ? posts.filter((post) => post.saved)
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 p-6 bg-white shadow-lg">
        <div className="space-y-8">
          <div className="space-y-2">
            {["My posts", "Saved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left py-2 px-4 rounded-lg ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                } font-medium`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-3">Categories</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer py-2 px-4 rounded-lg ${
                    selectedCategory === cat
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-6">
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            disabled={!accessToken}
          />
          <button
            onClick={handleAddPost}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!accessToken}
          >
            Post
          </button>
        </div>

        <div className="space-y-6">
          {filteredPosts.length ? (
            filteredPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                toggleLike={toggleLike}
                toggleSave={toggleSave}
                deletePost={deletePost}
                fetchComments={fetchComments}
                addComment={addComment}
                addReply={addReply}
                editComment={editComment}
                deleteComment={deleteComment}
                toggleCommentLike={toggleCommentLike}
                toggleReplyLike={toggleReplyLike}
                newComment={newComment}
                setNewComment={setNewComment}
                newReply={newReply}
                setNewReply={setNewReply}
                showComments={showComments}
                setShowComments={setShowComments}
                accessToken={accessToken}
                setError={setError}
                setPosts={setPosts}
                userName={userName}
                userRole={userRole}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">No posts available</p>
          )}
        </div>
      </main>
    </div>
  );
}

function Post({
  post,
  toggleLike,
  toggleSave,
  deletePost,
  fetchComments,
  addComment,
  addReply,
  editComment,
  deleteComment,
  toggleCommentLike,
  toggleReplyLike,
  newComment,
  setNewComment,
  newReply,
  setNewReply,
  showComments,
  setShowComments,
  accessToken,
  setError,
  setPosts,
  userName,
  userRole,
}) {
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState(post.content);
  const navigate = useNavigate();

  const handleToggleComments = () => {
    if (!showComments[post.id]) fetchComments(post.id);
    setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
  };

  const handleEditPost = async () => {
    if (!accessToken) {
      setError("Please log in to edit posts.");
      navigate("/login");
      return;
    }
    if (!editPostContent.trim()) return;
    try {
      const response = await axios.put(
        `${API_BASE_URL}/Post/${post.id}`,
        { content: editPostContent, userName },
        { headers: { Accept: "*/*", "Content-Type": "application/json" } }
      );
      console.log("Edit post response:", response.data);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === post.id ? { ...p, content: editPostContent } : p
        )
      );
      setEditingPost(false);
    } catch (err) {
      console.error("Edit post error:", err.response?.data || err.message);
      setError(
        "Failed to edit post: " + (err.response?.data?.message || err.message)
      );
      if (err.response?.status === 401) {
        navigate("/login"); // لوج أوت فقط لو الخطأ 401
      }
    }
  };

  const canEditOrDeletePost = post.userName === userName || userRole === "Admin";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👩‍🎓</span>
          <div>
            <h3 className="font-semibold">{post.userName}</h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {canEditOrDeletePost && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
            >
              <FiMoreHorizontal className="text-gray-500" />
            </button>
            {menuOpen === post.id && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border">
                <button
                  onClick={() => {
                    setEditingPost(true);
                    setEditPostContent(post.content);
                    setMenuOpen(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setMenuOpen(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {editingPost ? (
        <div className="mt-4">
          <textarea
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditPost}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingPost(false);
                setEditPostContent(post.content);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-700" style={{ whiteSpace: "pre-wrap" }}>
          {post.content}
        </p>
      )}
      <div className="flex gap-6 mt-4 text-gray-600">
        <button
          onClick={() => toggleLike(post.id)}
          className="flex items-center gap-1"
          disabled={!accessToken}
        >
          {post.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span>{post.likesCount}</span>
        </button>
        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1"
        >
          <MdOutlineAddComment />
          <span>{post.commentsCount}</span>
        </button>
        <button
          onClick={() => toggleSave(post.id)}
          className="flex items-center gap-1"
        >
          {post.saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {showComments[post.id] && (
        <div className="mt-6 space-y-4">
          {post.comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={post.id}
              addReply={addReply}
              editComment={editComment}
              deleteComment={deleteComment}
              toggleCommentLike={toggleCommentLike}
              toggleReplyLike={toggleReplyLike}
              editingComment={editingComment}
              setEditingComment={setEditingComment}
              editContent={editContent}
              setEditContent={setEditContent}
              newReply={newReply}
              setNewReply={setNewReply}
              accessToken={accessToken}
              userName={userName}
              userRole={userRole}
            />
          ))}
          <div className="flex gap-2">
            <input
              placeholder="Add a comment..."
              value={newComment[post.id] || ""}
              onChange={(e) =>
                setNewComment({ ...newComment, [post.id]: e.target.value })
              }
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={() => addComment(post.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Comment({
  comment,
  postId,
  addReply,
  editComment,
  deleteComment,
  toggleCommentLike,
  toggleReplyLike,
  editingComment,
  setEditingComment,
  editContent,
  setEditContent,
  newReply,
  setNewReply,
  accessToken,
  userName,
  userRole,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const canEditOrDeleteComment = comment.userName === userName || userRole === "Admin";

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{comment.userName || "Anonymous"}</p>
          {editingComment === comment.id ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    editComment(postId, comment.id, editContent);
                    setEditingComment(null);
                  }}
                  className="text-blue-500"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className="text-gray-600 mt-1"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {comment.content}
            </p>
          )}
        </div>
        {canEditOrDeleteComment && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <FiMoreHorizontal className="text-gray-500" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border">
                <button
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditContent(comment.content);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    deleteComment(postId, comment.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => toggleCommentLike(comment.id, postId)}
          className="flex items-center gap-1 text-gray-600"
          disabled={!accessToken}
        >
          {comment.liked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          <span>{comment.likesCount}</span>
        </button>
        <button
          onClick={handleToggleReplies}
          className="flex items-center gap-1 text-gray-600"
        >
          <MdOutlineAddComment />
          <span>{comment.repliesCount}</span>
        </button>
      </div>
      {showReplies && (
        <div className="mt-3 space-y-3">
          {comment.replies?.map((reply) => (
            <div key={reply.id} className="ml-6 bg-gray-100 p-3 rounded-lg">
              <p className="font-semibold text-sm">
                {reply.userName || "Anonymous"}
              </p>
              <p
                className="text-gray-600 text-sm"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {reply.content}
              </p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => toggleReplyLike(reply.id, postId, comment.id)}
                  className="flex items-center gap-1 text-gray-600 text-sm"
                  disabled={!accessToken}
                >
                  {reply.liked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{reply.likesCount}</span>
                </button>
              </div>
            </div>
          ))}
          <div className="ml-6 flex gap-2">
            <input
              placeholder="Reply..."
              value={newReply[comment.id] || ""}
              onChange={(e) =>
                setNewReply({ ...newReply, [comment.id]: e.target.value })
              }
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              onClick={() => addReply(postId, comment.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;