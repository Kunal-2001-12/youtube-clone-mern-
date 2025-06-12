import "../Css/browse.css";
import { useEffect, useState } from "react";
import LeftPanel from "./LeftPanel";
import Navbar from "./Navbar";
import "../Css/theme.css";
import { useSelector } from "react-redux";
import { backendURL } from "../config";
import { useNavigate } from "react-router-dom";

function Browse() {
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [theme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu-light");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  // --- YouTube-like filter categories ---
  const filterCategories = [
    { label: "All", value: "All" },
    { label: "Music", value: "Music" },
    { label: "Trending", value: "Trending" },
    { label: "Web Development", value: "Web Development" },
    { label: "News", value: "News" },
    { label: "AI", value: "AI" },
    { label: "Gaming", value: "Gaming" },
    { label: "Live", value: "Live" },
    { label: "Sports", value: "Sports" },
    { label: "Learning", value: "Learning" },
    { label: "Podcasts", value: "Podcasts" },
    { label: "Movies", value: "Movies" },
    { label: "Recently uploaded", value: "Recently uploaded" },
    { label: "Watched", value: "Watched" },
    { label: "New to you", value: "New to you" },
  ];
  const [selectedFilter, setSelectedFilter] = useState("All");

  // --- Channel creation CTA for new users ---
  // Show a floating button if user is signed in and has no channel
  const [hasChannel, setHasChannel] = useState(true);
  useEffect(() => {
    async function checkChannel() {
      if (user?.email) {
        try {
          const res = await fetch(`${backendURL}/getchannel/${user.email}`);
          const data = await res.json();
          setHasChannel(data.hasChannel);
        } catch (e) {
          setHasChannel(true); // fallback: hide button
        }
      }
    }
    checkChannel();
  }, [user]);

  // --- Remove sampleVideos and use backend data ---
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${backendURL}/getvideos`);
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        // Transform backend arrays into array of video objects
        const videosArr = (data.videoID || []).map((id, idx) => ({
          _id: id,
          title: data.titles?.[idx] || "",
          uploader: data.Uploader?.[idx] || "",
          videoURL: data.videoURLs?.[idx] || "", // <-- use videoURL (uppercase URL)
          thumbnailUrl: data.thumbnailURLs?.[idx] || "",
          profilePic: data.Profile?.[idx] || "",
          views: data.views?.[idx] || 0,
          uploadDate: data.uploadDate?.[idx] || "",
          category: data.Visibility?.[idx] || "",
        }));
        setVideos(videosArr);
      } catch (err) {
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  // Fallback dummy video if backend fails or no videos
  const dummyVideos = [
    {
      _id: "dummy1",
      title: "Demo Video",
      uploader: "Demo Channel",
      videoURL: "https://www.w3schools.com/html/mov_bbb.mp4",
      thumbnailUrl: "/img/fallback-thumbnail.png",
      profilePic: "/img/avatar.png",
      views: 1234,
      uploadDate: "2025-06-10",
      category: "All"
    }
  ];

  // Filter and search logic
  const filteredVideos = (videos.length > 0 ? videos : dummyVideos).filter(
    v => selectedFilter === "All" || v.category === selectedFilter
  );

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className={theme ? "browse" : "browse light-mode"}>
        {/* Floating create channel button for new users */}
        {user?.email && hasChannel === false && (
          <button
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
              background: '#3eaffe',
              color: '#fff',
              border: 'none',
              borderRadius: 24,
              padding: '14px 28px',
              fontWeight: 700,
              fontSize: 18,
              boxShadow: '0 2px 12px #0002',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={() => navigate('/studio')}
            title="Create your channel to upload and manage videos!"
          >
            + Create Channel
          </button>
        )}
        <div className={menuClicked === true ? `browse-data ${theme ? "" : "light-mode"}` : `browse-data2 ${theme ? "" : "light-mode"}`}
          style={menuClicked === false ? { left: "74px" } : { left: "250px" }}>
          {/* Filter row */}
          <div className="filter-bar" role="tablist" aria-label="Video categories">
            {filterCategories.map(cat => (
              <button
                key={cat.value}
                className={`filter-btn${selectedFilter === cat.value ? ' active' : ''}`}
                onClick={() => setSelectedFilter(cat.value)}
                role="tab"
                aria-selected={selectedFilter === cat.value}
                tabIndex={0}
                style={{
                  outline: selectedFilter === cat.value ? '2px solid #3ea6ff' : 'none',
                  fontWeight: selectedFilter === cat.value ? 700 : 500,
                  background: selectedFilter === cat.value ? '#3ea6ff' : '',
                  color: selectedFilter === cat.value ? '#fff' : '',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Main content: video grid */}
          <div className="video-section" style={{ marginLeft: menuClicked ? "40px" : "40px" }}>
            <div className="uploaded-videos">
              {loading ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', marginTop: 40 }}>
                  <img src="/img/loading.gif" alt="Loading..." style={{ width: 60, height: 60, marginBottom: 12 }} />
                  <p style={{ color: theme ? '#fff' : '#222', fontSize: '1.2rem' }}>Loading videos...</p>
                </div>
              ) : error ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', marginTop: 40 }}>
                  <img src="/img/error.png" alt="Error" style={{ width: 60, height: 60, marginBottom: 12 }} />
                  <p style={{ color: 'red', fontSize: '1.2rem' }}>{error}</p>
                </div>
              ) : filteredVideos.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', marginTop: 40 }}>
                  <img src="/img/nothing.png" alt="No videos" style={{ width: 60, height: 60, marginBottom: 12 }} />
                  <p style={{ color: theme ? '#fff' : '#222', fontSize: '1.2rem' }}>No videos to display.</p>
                </div>
              ) : (
                filteredVideos.map(video => (
                  <div key={video._id} className="video-data">
                    <img 
                      className="browse-thumbnails"
                      src={video.thumbnailUrl || "/img/fallback-thumbnail.png"} 
                      alt={video.title} 
                      onError={e => { e.target.onerror = null; e.target.src = '/img/fallback-thumbnail.png'; }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        // If dummy video, open directly, else use normal navigation
                        if (video._id === "dummy1") {
                          window.open(video.videoURL, '_blank');
                        } else {
                          navigate(`/video/${video._id}`);
                        }
                      }}
                    />
                    <div className="channel-basic-data">
                      <img src={video.profilePic || "/img/default-profile.png"} alt={video.uploader || "Channel"} className="channel-profile" />
                      <div className="channel-text-data">
                        <div className="title">{video.title}</div>
                        <div className="uploader">{video.uploader || "Channel"}</div>
                        <div className="view-time">{video.views || 0} views • {video.uploadDate || ""}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Browse;
