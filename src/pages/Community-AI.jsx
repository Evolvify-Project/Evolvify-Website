import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdOutlineAddComment } from "react-icons/md";
import { FiMoreHorizontal } from "react-icons/fi";
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

export default function CommunityAI() {
  const [activeTab, setActiveTab] = useState("My posts");
  const [selectedCategory, setSelectedCategory] = useState(
    "Communication skill"
  );
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [menuOpen, setMenuOpen] = useState({});

  const navigate = useNavigate();
  const accessToken = localStorage.getItem("userToken");
  const username = localStorage.getItem("username") || "Anonymous";

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
      const response = await axios.get(`${API_BASE_URL}/Post`);
      const fetchedPosts = response.data.data.map((post) => ({
        ...post,
        liked: false,
        saved: false,
        category: categories[Math.floor(Math.random() * categories.length)],
      }));
      setPosts(fetchedPosts);
      setSavedPosts(fetchedPosts.filter((post) => post.saved));
    } catch (err) {
      setError("Failed to fetch posts");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleLike = async (id) => {
    if (!accessToken) {
      setError("Please log in to like posts.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/Post/${id}/Like`);
      setPosts(
        posts.map((post) =>
          post.id === id
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
      console.error(err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Post/${postId}/Comment`
      );
      setComments((prev) => ({
        ...prev,
        [postId]: response.data.data || [],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (postId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/Post/${postId}/Comment`, {
        content: newComment,
        userName: username,
      });
      setNewComment("");
      fetchComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${API_BASE_URL}/Post/${postId}/Comment/${commentId}`);
      fetchComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (commentId, currentContent) => {
    setEditCommentId(commentId);
    setEditCommentContent(currentContent);
  };

  const saveEditedComment = async (postId) => {
    if (!editCommentContent.trim()) return;
    try {
      await axios.put(
        `${API_BASE_URL}/Post/${postId}/Comment/${editCommentId}`,
        {
          content: editCommentContent,
          userName: username,
        }
      );
      setEditCommentId(null);
      setEditCommentContent("");
      fetchComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const addReply = async (commentId, replyContent, postId) => {
    if (!replyContent.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/Comment/${commentId}/Reply`, {
        content: replyContent,
        userName: username,
      });
      setNewReply((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts =
    activeTab === "Saved"
      ? savedPosts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-6 mb-6 shadow">
            <div className="flex items-center gap-3">
              <span className="text-xl">👨‍🎓</span>
              <div>
                <h3 className="font-semibold">
                  {post.username || "Anonymous"}
                </h3>
                <p className="text-xs text-gray-400">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            <p className="mt-4 mb-4 text-gray-700">{post.content}</p>
            <div className="flex gap-6">
              <button onClick={() => toggleLike(post.id)}>
                {post.liked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
                <span className="ml-1">{post.likesCount}</span>
              </button>
              <button onClick={() => fetchComments(post.id)}>
                <MdOutlineAddComment />{" "}
                <span>Comments ({post.commentsCount})</span>
              </button>
            </div>
            <div className="mt-6">
              {comments[post.id]?.map((comment) => (
                <div
                  key={comment.id}
                  className="relative bg-gray-50 p-4 rounded-lg mb-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">
                        {comment.userName || "Anonymous"}
                      </p>
                      {editCommentId === comment.id ? (
                        <>
                          <textarea
                            className="w-full border p-2 rounded mt-1"
                            value={editCommentContent}
                            onChange={(e) =>
                              setEditCommentContent(e.target.value)
                            }
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => saveEditedComment(post.id)}
                              className="text-green-500 text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditCommentId(null)}
                              className="text-gray-500 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-600 text-sm mt-1">
                          {comment.content}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen((prev) => ({
                            ...prev,
                            [comment.id]: !prev[comment.id],
                          }))
                        }
                      >
                        <FiMoreHorizontal className="text-gray-400" />
                      </button>
                      {menuOpen[comment.id] && (
                        <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-md border">
                          <button
                            onClick={() =>
                              startEditing(comment.id, comment.content)
                            }
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteComment(post.id, comment.id)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reply input */}
                  <div className="mt-3">
                    <input
                      placeholder="Reply..."
                      value={newReply[comment.id] || ""}
                      onChange={(e) =>
                        setNewReply((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      className="w-full border p-2 rounded"
                    />
                    <button
                      onClick={() =>
                        addReply(comment.id, newReply[comment.id], post.id)
                      }
                      className="text-blue-500 text-sm mt-2"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 border p-2 rounded"
                />
                <button
                  onClick={() => addComment(post.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}
