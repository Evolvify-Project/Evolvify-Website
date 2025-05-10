import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaComment } from "react-icons/fa";
import { FiTrash2, FiMoreHorizontal, FiEdit2 } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import placeholderImg from "../assets/images/placeholder-vector.jpg";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "All Posts" },
  { name: "Presentation skill"},
  { name: "Interview skill"},
  { name: "Communication skill"},
  { name: "Time management skill"},
  { name: "Teamwork skill"},
];

const API_BASE_URL = "https://evolvify.runasp.net/api/Community";

function Community() {
  const [activeTab, setActiveTab] = useState("My posts");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [newReply, setNewReply] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Post`, {
        headers: { Accept: "*/*" },
      });
      const fetchedPosts = response.data.data.map((post) => ({
        ...post,
        liked: false,
        saved: false,
        comments: [],
        commentsCount: post.commentsCount || 0,
        profileImage: post.profileImage || placeholderImg,
      }));
      setPosts(fetchedPosts);
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    } finally {
      setLoading(false);
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
          userName,
          comments: [],
          commentsCount: 0,
          profileImage: response.data.data.profileImage || placeholderImg,
        },
        ...posts,
      ]);
      setNewPost("");
    } catch (err) {
      setError("Failed to add post");
      console.error("Add post error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        navigate("/login");
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
        navigate("/login");
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
        navigate("/login");
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
            profileImage: comment.profileImage || placeholderImg,
            replies:
              repliesResponse.data.data.map((reply) => ({
                ...reply,
                userName: reply.userName || userName,
                profileImage: reply.profileImage || placeholderImg,
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
        navigate("/login");
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
        navigate("/login");
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
        navigate("/login");
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
        navigate("/login");
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
        navigate("/login");
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
        navigate("/login");
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
        navigate("/login");
      }
    }
  };

  const filteredPosts =
    activeTab === "Saved"
      ? posts.filter((post) => post.saved)
      : selectedCategory === "All Posts"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 left-0 w-64 p-6 bg-white shadow-lg rounded-r-lg z-20 transform md:transform-none md:static md:w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Community Hub</h2>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="space-y-8 sticky top-5">
          <div className="space-y-2">
            {["My posts", "Saved"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50"
                } font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <motion.li
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSidebarOpen(false);
                  }}
                  className={`cursor-pointer py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                    selectedCategory === cat.name
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 p-6 md:ml-64">
        <button
          className="md:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4"
          >
            {error}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 resize-none shadow-sm"
            rows="4"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            disabled={!accessToken}
          />
          <div className="flex gap-2 mt-2">
            <motion.button
              onClick={handleAddPost}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              disabled={!accessToken || !newPost.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Post
            </motion.button>
            {newPost.trim() && (
              <motion.button
                onClick={() => setNewPost("")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center h-64"
            >
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          ) : filteredPosts.length ? (
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Post
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
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center"
            >
              No posts available
            </motion.p>
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
        `${API_BASE_URL}/Post/${post.id}?Content=${encodeURIComponent(editPostContent)}`,
        {},
        { headers: { Accept: "*/*" } }
      );
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
        navigate("/login");
      }
    }
  };

  const canEditOrDeletePost = post.userName === userName || userRole === "Admin";

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={post.profileImage || placeholderImg}
            alt={`${post.userName}'s profile`}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => (e.target.src = placeholderImg)}
          />
          <div>
            <h3 className="font-semibold text-gray-800">{post.userName}</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        {canEditOrDeletePost && (
          <div className="relative">
            <motion.button
              onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMoreHorizontal className="text-gray-500" />
            </motion.button>
            {menuOpen === post.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10"
              >
                <button
                  onClick={() => {
                    setEditingPost(true);
                    setEditPostContent(post.content);
                    setMenuOpen(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiEdit2 className="text-gray-500" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setMenuOpen(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiTrash2 className="text-red-500" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
      {editingPost ? (
        <div className="mt-4">
          <textarea
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
            rows="4"
          />
          <div className="flex gap-2 mt-2">
            <motion.button
              onClick={handleEditPost}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              whileHover={{ scale: 1.05}}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
            <motion.button
              onClick={() => {
                setEditingPost(false);
                setEditPostContent(post.content);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              whileHover={{ scale: 1.05}}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-700" style={{ whiteSpace: "pre-wrap" }}>
          {post.content}
        </p>
      )}
      <div className="flex gap-6 mt-4 text-gray-600">
        <motion.button
          onClick={() => toggleLike(post.id)}
          className="flex items-center gap-1"
          disabled={!accessToken}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {post.liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span>{post.likesCount}</span>
        </motion.button>
        <motion.button
          onClick={handleToggleComments}
          className="flex items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaComment />
          <span>{post.commentsCount}</span>
        </motion.button>
        <motion.button
          onClick={() => toggleSave(post.id)}
          className="flex items-center gap-1"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {post.saved ? <FaBookmark /> : <FaRegBookmark />}
        </motion.button>
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
          <div className="flex gap-2 mt-4">
            <input
              placeholder="Add a comment..."
              value={newComment[post.id] || ""}
              onChange={(e) =>
                setNewComment({ ...newComment, [post.id]: e.target.value })
              }
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <motion.button
              onClick={() => addComment(post.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              disabled={!newComment[post.id]?.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Comment
            </motion.button>
            {newComment[post.id]?.trim() && (
              <motion.button
                onClick={() => setNewComment({ ...newComment, [post.id]: "" })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      )}
    </motion.div>
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
  const [replyInputOpen, setReplyInputOpen] = useState(false);

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
    if (!showReplies && !comment.replies?.length) {
      fetchComments(postId); // Refresh replies if none exist
    }
  };

  const canEditOrDeleteComment = comment.userName === userName || userRole === "Admin";

  return (
    <motion.div
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <img
            src={comment.profileImage || placeholderImg}
            alt={`${comment.userName}'s profile`}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => (e.target.src = placeholderImg)}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-800">{comment.userName || "Anonymous"}</p>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            {editingComment === comment.id ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  rows="3"
                />
                <div className="flex gap-2 mt-2">
                  <motion.button
                    onClick={() => {
                      editComment(postId, comment.id, editContent);
                      setEditingComment(null);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save
                  </motion.button>
                  <motion.button
                    onClick={() => setEditingComment(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
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
        </div>
        {canEditOrDeleteComment && (
          <div className="relative">
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiMoreHorizontal className="text-gray-500" />
            </motion.button>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10"
              >
                <button
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditContent(comment.content);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiEdit2 className="text-gray-500" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    deleteComment(postId, comment.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center gap-2"
                >
                  <FiTrash2 className="text-red-500" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-3">
        <motion.button
          onClick={() => toggleCommentLike(comment.id, postId)}
          className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors duration-200"
          disabled={!accessToken}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {comment.liked ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          <span>{comment.likesCount}</span>
        </motion.button>
        <motion.button
          onClick={() => setReplyInputOpen(!replyInputOpen)}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors duration-200"
          whileHover={{ scale: 1.1}}
          whileTap={{ scale: 0.9 }}
        >
          <FaComment />
          <span>Reply</span>
        </motion.button>
      </div>
      {replyInputOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 ml-11 flex gap-2"
        >
          <input
            placeholder="Add a reply..."
            value={newReply[comment.id] || ""}
            onChange={(e) =>
              setNewReply({ ...newReply, [comment.id]: e.target.value })
            }
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <motion.button
            onClick={() => {
              addReply(postId, comment.id);
              setReplyInputOpen(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            disabled={!newReply[comment.id]?.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reply
          </motion.button>
          <motion.button
            onClick={() => {
              setReplyInputOpen(false);
              setNewReply({ ...newReply, [comment.id]: "" });
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </motion.div>
      )}
      {(showReplies || comment.replies?.length > 0) && (
        <div className="mt-4 space-y-3">
          {comment.replies?.map((reply) => (
            <motion.div
              key={reply.id}
              className="ml-11 border-l-2 border-gray-200 pl-4 bg-gray-50 p-3 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <img
                  src={reply.profileImage || placeholderImg}
                  alt={`${reply.userName}'s profile`}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => (e.target.src = placeholderImg)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-800">
                      {reply.userName || "Anonymous"}
                    </p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p
                    className="text-gray-600 text-sm mt-1"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {reply.content}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <motion.button
                  onClick={() => toggleReplyLike(reply.id, postId, comment.id)}
                  className="flex items-center gap-1 text-gray-600 text-sm hover:text-red-500 transition-colors duration-200"
                  disabled={!accessToken}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {reply.liked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{reply.likesCount}</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
          {comment.replies?.length > 0 && (
            <motion.button
              onClick={handleToggleReplies}
              className="ml-11 text-blue-500 text-sm hover:underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showReplies ? "Hide replies" : `Show ${comment.repliesCount} replies`}
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default Community;