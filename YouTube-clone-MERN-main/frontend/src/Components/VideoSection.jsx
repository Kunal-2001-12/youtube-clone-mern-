import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Share from "./Share";
import "../Css/videoSection.css";
import "plyr/dist/plyr.css";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { LiaDownloadSolid } from "react-icons/lia";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import avatar from "../img/avatar.png";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { backendURL } from "../config";

function VideoSection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [shareClicked, setShareClicked] = useState(false);
  const [usermail, setUserMail] = useState();
  const [channelID, setChannelID] = useState();
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [VideoLikes, setVideoLikes] = useState(0);
  const [commentLikes, setCommentLikes] = useState();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [UserPlaylist, setUserPlaylist] = useState([]);
  const [playlistID, setplaylistID] = useState([]);
  const [theme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const [checkTrending, setCheckTrending] = useState([]);
  const videoRef = useRef(null);

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  //TOAST FUNCTIONS

  const playlistNotify = () =>
    toast.success("Video added to the playlist!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const watchLaterNotify = () =>
    toast.success("Video saved to watch later!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const LikedNotify = () =>
    toast.success("Video liked!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const CommentDeleteNotify = () =>
    toast.success("Comment deleted!", {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  // USE EFFECTS

  useEffect(() => {
    const handleClick = () => {
      setShareClicked(false);
      document.body.classList.remove("bg-css");
    };

    const cancelShare = document.querySelector(".cancel-share");

    if (cancelShare) {
      cancelShare.addEventListener("click", handleClick);
    }

    return () => {
      if (cancelShare) {
        cancelShare.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const getTrendingData = async () => {
      try {
        if (id) {
          const response = await fetch(`${backendURL}/gettrendingdata/${id}`);
          const data = await response.json();
          setCheckTrending(data);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    getTrendingData();
  }, [id]);

  useEffect(() => {
    const PushTrending = async () => {
      try {
        if (id && usermail) {
          const response = await fetch(
            `${backendURL}/checktrending/${id}/${usermail}`
          );
          await response.json();
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    PushTrending();
  }, [id, usermail]);

  useEffect(() => {
    const getVideoData = async () => {
      try {
        if (id) {
          const token = localStorage.getItem("token");
          const response = await fetch(`${backendURL}/videodata/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
          const video = await response.json();
          setVideoData(video);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    getVideoData();
  }, [id]);

  useEffect(() => {
    const getLikes = async () => {
      try {
        if (id) {
          const response = await fetch(`${backendURL}/getlike/${id}`);
          const likes = await response.json();
          setVideoLikes(likes);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    getLikes();
  }, [id]);

  useEffect(() => {
    const LikeExists = async () => {
      try {
        if (id && user?.email) {
          const response = await fetch(
            `${backendURL}/getuserlikes/${id}/${user?.email}`
          );
          const { existingLikedVideo } = await response.json();
          if (!existingLikedVideo) {
            setIsLiked(false);
          } else {
            setIsLiked(true);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    LikeExists();
  }, [id, isLiked, user?.email]);

  useEffect(() => {
    const CommentLikes = async () => {
      try {
        if (id) {
          const response = await fetch(`${backendURL}/likecomment/${id}`);
          const result = await response.json();
          setCommentLikes(result);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    CommentLikes();
  }, [id]);

  useEffect(() => {
    const getWatchlater = async () => {
      try {
        if (id && user?.email) {
          const response = await fetch(
            `${backendURL}/checkwatchlater/${id}/${user?.email}`
          );
          const data = await response.json();
          if (data === "Found") {
            setIsSaved(true);
          } else {
            setIsSaved(false);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    getWatchlater();
  }, [id, user?.email, isSaved]);

  useEffect(() => {
    const getComments = async () => {
      try {
        if (id) {
          const response = await fetch(`${backendURL}/getcomments/${id}`);
          const result = await response.json();
          setComments(result);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    getComments();
  }, [id]);

  useEffect(() => {
    const getOtherChannel = async () => {
      try {
        if (id) {
          const response = await fetch(`${backendURL}/otherchannel/${id}`);
          const userEmail = await response.json();
          setUserMail(userEmail);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    getOtherChannel();
  }, [id]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (usermail) {
          const response = await fetch(
            `${backendURL}/getchannelid/${usermail}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    getChannelID();
  }, [usermail]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getplaylistdata/${user?.email}`
          );
          const playlists = await response.json();
          setUserPlaylist(playlists || "No playlists available...");
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    getPlaylists();
  }, [user?.email]);

  useEffect(() => {
    const getVideoAvailableInPlaylist = async () => {
      try {
        if (id !== undefined && user?.email) {
          const response = await fetch(
            `${backendURL}/getvideodataplaylist/${user?.email}/${id}`
          );
          const playlistIdsWithVideo = await response.json();
          setplaylistID(playlistIdsWithVideo);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    return () => getVideoAvailableInPlaylist();
  }, [user?.email, id]);

  //POST REQUESTS

  const uploadComment = async () => {
    try {
      setCommentLoading(true);
      const response1 = await fetch(
        `${backendURL}/getchannelid/${user?.email}`
      );
      const { channelID } = await response1.json();
      const data = {
        comment,
        email: user?.email,
        channelID,
      };
      const token = localStorage.getItem("token");
      const response = await fetch(`${backendURL}/comments/${id}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const { message, commentData } = await response.json();
      if (message === "Uploaded") {
        setComments([...comments, commentData]);
        setCommentLoading(false);
      } else {
        setCommentLoading(true);
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  if (!videoData) {
    return (
      <div className={theme ? "main-video-section2" : "main-video-section2 light-mode"}>
        <div className="spin23">
          <span className={theme ? "loader2" : "loader2-light"}></span>
          <p style={{marginTop: '15px'}}>Video data not found. Please try again later.</p>
        </div>
      </div>
    );
  }

  // --- Robustly extract the correct video object for the current video id ---
  let mainVideo = null;
  // If videoData is an array (backend bug or /getvideos), find the video by id
  if (Array.isArray(videoData)) {
    for (const v of videoData) {
      if (v.VideoData && Array.isArray(v.VideoData)) {
        // Try to find the video with matching _id
        const found = v.VideoData.find(vid => vid._id === id);
        if (found) {
          mainVideo = found;
          break;
        }
        // Fallback: just use the first
        if (!mainVideo && v.VideoData.length > 0) {
          mainVideo = v.VideoData[0];
        }
      }
    }
  } else if (videoData && videoData.VideoData && Array.isArray(videoData.VideoData)) {
    // If videoData is an object with VideoData array
    const found = videoData.VideoData.find(vid => vid._id === id);
    if (found) {
      mainVideo = found;
    } else if (videoData.VideoData.length > 0) {
      mainVideo = videoData.VideoData[0];
    }
  } else if (videoData && videoData.videoURL) {
    mainVideo = videoData;
  }

  if (!mainVideo || !mainVideo.videoURL) {
    // Enhanced error logging for debugging
    console.error("VideoSection: videoData fetch result:", videoData);
    return (
      <div className={theme ? "main-video-section2" : "main-video-section2 light-mode"}>
        <div className="spin23">
          <span className={theme ? "loader2" : "loader2-light"}></span>
          <p style={{marginTop: '15px', color: 'red', fontWeight: 600}}>
            Video cannot be played.<br />
            <span style={{fontWeight: 400, color: '#b00'}}>
              Reason: Video URL is missing or invalid.<br />
              <span style={{fontWeight: 400, color: '#333', fontSize: 13}}>
                <b>Debug info:</b><br />
                <b>videoURL:</b> {mainVideo ? mainVideo.videoURL?.toString() : 'undefined'}<br />
                <b>videoData:</b>
                <pre style={{fontSize: 11, background: '#f8f8f8', color: '#222', padding: 8, borderRadius: 6, maxWidth: 600, overflowX: 'auto'}}>
                  {JSON.stringify(videoData, null, 2)}
                </pre>
              </span>
            </span>
          </p>
        </div>
      </div>
    );
  }

  const {
    videoURL,
    Title,
    thumbnailURL,
    ChannelProfile,
    uploader,
    Description,
    views,
    uploaded_date,
    Tags: RawTags = [],
    _id,
  } = mainVideo || {};

  // Ensure Tags is always an array for mapping
  let Tags = [];
  if (Array.isArray(RawTags)) {
    Tags = RawTags;
  } else if (typeof RawTags === 'string') {
    // Support both comma and space separated tags, robust split
    Tags = RawTags.split(/[,\s]+/).map(tag => tag.trim()).filter(Boolean);
  }

  document.title = Title && Title !== undefined ? `${Title} - YouTube` : "YouTube";

  const likeVideo = async () => {
    try {
      setLikeLoading(true);

      const response = await fetch(
        `${backendURL}/like/${id}/${user?.email}/${usermail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { message, likes } = await response.json();
      // console.log(data);
      if (message === "Liked") {
        LikedNotify();
        setLikeLoading(false);
        setIsLiked(true);
        setVideoLikes(likes);
      } else {
        setLikeLoading(false);
        setIsLiked(false);
        setVideoLikes(likes);
      }
    } catch (error) {
      setLikeLoading(false);
      //console.log(error.message);
    }
  };
  const LikeComment = async (commentId) => {
    try {
      if (commentId !== undefined && id !== undefined && user?.email) {
        const response = await fetch(
          `${backendURL}/likecomment/${id}/${commentId}/${user?.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { message, likes } = await response.json();
        if (message === "Comment liked successfully") {
          setCommentLikes(likes);
        } else {
          setCommentLikes(likes);
        }
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const HeartComment = async (commentID) => {
    try {
      if (id !== undefined && channelID !== undefined) {
        const response = await fetch(
          `${backendURL}/heartcomment/${id}/${commentID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const DeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${backendURL}/deletecomment/${id}/${commentId}/${user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { message, commentData } = await response.json();
      if (message === "Comment Deleted") {
        CommentDeleteNotify();
        setComments(commentData);
      }
      // window.location.reload();
    } catch (error) {
      //console.log(error.message);
    }
  };

  const DislikeVideo = async () => {
    try {
      const response = await fetch(
        `${backendURL}/dislikevideo/${id}/${user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { message, likes } = await response.json();
      if (message === "Disliked") {
        setLikeLoading(false);
        setIsLiked(false);
        setVideoLikes(likes);
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = videoURL;
    link.target = "_blank";
    link.download = "video.mp4";
    link.click();
  };

  const saveVideo = async () => {
    try {
      if (id && user?.email) {
        const response = await fetch(
          `${backendURL}/watchlater/${id}/${user?.email}/${usermail}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data === "Saved") {
          watchLaterNotify();
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const createPlaylist = async () => {
    try {
      if (playlistName === "") {
        return;
      }
      const data = {
        email: user?.email,
        playlistName,
      };
      const response = await fetch(`${backendURL}/createplaylist`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, playlistID } = await response.json();
      if (message === "Playlist created") {
        setplaylistID([...playlistID, playlistID]);
        setUserPlaylist([...UserPlaylist, { playlistID, playlistName }]);
        setPlaylistName("");
        playlistNotify();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const addToPlaylist = async (id) => {
    try {
      const data = {
        videoID: id,
        email: user?.email,
        playlistID,
      };
      const response = await fetch(`${backendURL}/addtoplaylist`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();
      if (message === "Added to playlist") {
        playlistNotify();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const removeFromPlaylist = async (id) => {
    try {
      const data = {
        videoID: id,
        email: user?.email,
        playlistID,
      };
      const response = await fetch(`${backendURL}/removefromplaylist`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();
      if (message === "Removed from playlist") {
        setUserPlaylist(
          UserPlaylist.map((playlist) => {
            if (playlist.playlistID === playlistID) {
              return { ...playlist, videos: playlist.videos.filter((video) => video.videoID !== id) };
            }
            return playlist;
          })
        );
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  // Ensure UserPlaylist is always an array for mapping
  let safeUserPlaylist = [];
  if (Array.isArray(UserPlaylist)) {
    safeUserPlaylist = UserPlaylist;
  } else if (typeof UserPlaylist === 'object' && UserPlaylist !== null) {
    // If it's an object (e.g., error string), ignore or wrap in array if needed
    safeUserPlaylist = [];
  } else {
    safeUserPlaylist = [];
  }

  return (
    <>
      <Navbar />
      <div className={theme ? "main-video-section" : "main-video-section light-mode"}>
        <div className="video-section">
          <div className="video-container">
            <div className="video-wrapper">
              <video
                ref={videoRef}
                className="video-player"
                controls
                playsInline
                poster={thumbnailURL}
              >
                <source src={videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="video-info">
              <h1 className="video-title">{Title}</h1>
              <div className="video-details">
                <div className="uploader-info">
                  <div className="uploader-profile">
                    <img
                      src={ChannelProfile || avatar}
                      alt="Uploader"
                      className="uploader-avatar"
                    />
                  </div>
                  <div className="uploader-details">
                    <h2 className="uploader-name">{uploader}</h2>
                    <div className="uploader-stats">
                      <span className="video-views">{views} views</span>
                      <span className="video-date">
                        {new Date(uploaded_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="video-actions">
                  <button
                    className={`like-btn ${isLiked ? "liked" : ""}`}
                    onClick={likeVideo}
                    disabled={likeLoading}
                  >
                    {likeLoading ? (
                      <span className="loader"></span>
                    ) : (
                      <>
                        {isLiked ? (
                          <ThumbUpIcon fontSize="small" />
                        ) : (
                          <ThumbUpAltOutlinedIcon fontSize="small" />
                        )}
                        <span className="like-count">{VideoLikes}</span>
                      </>
                    )}
                  </button>
                  <button className="dislike-btn" onClick={DislikeVideo}>
                    <ThumbDownOutlinedIcon fontSize="small" />
                  </button>
                  <button className="share-btn" onClick={() => setShareClicked(true)}>
                    <ReplyIcon fontSize="small" />
                  </button>
                  <button className="save-btn" onClick={saveVideo}>
                    {isSaved ? (
                      <BookmarkAddedIcon fontSize="small" />
                    ) : (
                      <BookmarkAddOutlinedIcon fontSize="small" />
                    )}
                  </button>
                  <button className="download-btn" onClick={downloadVideo}>
                    <LiaDownloadSolid />
                  </button>
                </div>
              </div>
              <div className="video-description">
                <p>{Description}</p>
              </div>
              <div className="video-tags">
                {Tags.map((tag, index) => (
                  <span key={index} className="video-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="video-playlist">
                <h3>Playlists:</h3>
                <div className="playlist-container">
                  {safeUserPlaylist.length > 0 ? (
                    safeUserPlaylist.map((playlist) => (
                      <div key={playlist.playlistID} className="playlist-item">
                        <span className="playlist-name">{playlist.playlistName}</span>
                        <div className="playlist-actions">
                          <button
                            className="add-to-playlist-btn"
                            onClick={() => addToPlaylist(_id)}
                          >
                            Add
                          </button>
                          <button
                            className="remove-from-playlist-btn"
                            onClick={() => removeFromPlaylist(_id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No playlists available. Create a new playlist!</p>
                  )}
                </div>
                <div className="create-playlist-container">
                  <input
                    type="text"
                    className="playlist-name-input"
                    placeholder="New playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                  <button className="create-playlist-btn" onClick={createPlaylist}>
                    Create Playlist
                  </button>
                </div>
              </div>
              <div className="video-comments">
                <h3>Comments:</h3>
                <div className="comments-container">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-author">
                          <img
                            src={comment.userProfile || avatar}
                            alt="User"
                            className="comment-avatar"
                          />
                          <span className="comment-name">{comment.username}</span>
                        </div>
                        <div className="comment-content">
                          <p className="comment-text">{comment.comment}</p>
                          <div className="comment-actions">
                            <button
                              className="like-comment-btn"
                              onClick={() => LikeComment(comment._id)}
                            >
                              {commentLikes[comment._id] ? (
                                <ThumbUpIcon fontSize="small" />
                              ) : (
                                <ThumbUpAltOutlinedIcon fontSize="small" />
                              )}
                            </button>
                            <button
                              className="heart-comment-btn"
                              onClick={() => HeartComment(comment._id)}
                            >
                              <FavoriteBorderOutlinedIcon fontSize="small" />
                            </button>
                            {user?.email === comment.email && (
                              <button
                                className="delete-comment-btn"
                                onClick={() => DeleteComment(comment._id)}
                              >
                                <ClearRoundedIcon fontSize="small" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet. Be the first to comment!</p>
                  )}
                </div>
                <div className="comment-input-container">
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="submit-comment-btn" onClick={uploadComment}>
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="recommended-videos">
            <h3>Recommended Videos:</h3>
            <div className="recommended-videos-container">
              {checkTrending.length > 0 ? (
                checkTrending.map((video) => (
                  <div
                    key={video._id}
                    className="recommended-video-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/video/${video._id}`)}
                  >
                    <div className="recommended-video-thumbnail">
                      <img src={video.thumbnailURL} alt={video.Title} />
                    </div>
                    <div className="recommended-video-info">
                      <h4 className="recommended-video-title">{video.Title}</h4>
                      <p className="recommended-video-uploader">{video.uploader}</p>
                      <p className="recommended-video-views">
                        {video.views} views • {new Date(video.uploaded_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recommendations available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {shareClicked && <Share videoData={videoData} onClose={() => setShareClicked(false)} />}
    </>
  );
}

export default VideoSection;
