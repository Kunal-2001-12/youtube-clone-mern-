require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const requireAuth = require("./requireAuth");
const Likes = express.Router();

Likes.post("/like/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userData.findById(req.userId);

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedData = video.VideoData[videoIndex];

    const existingLikedVideo = user.likedVideos.find(
      (likedVideo) => likedVideo.likedVideoID === likedData._id.toString()
    );

    if (!existingLikedVideo) {
      user.likedVideos.push({
        email: user.email,
        videoURL: likedData.videoURL,
        thumbnailURL: likedData.thumbnailURL,
        uploader: likedData.uploader,
        ChannelProfile: likedData.ChannelProfile,
        Title: likedData.Title,
        videoLength: likedData.videoLength,
        views: likedData.views,
        uploaded_date: likedData.uploaded_date,
        likedVideoID: likedData._id,
        videoprivacy: likedData.visibility,
      });
      video.VideoData[videoIndex].likes += 1;
      res
        .status(200)
        .json({ message: "Liked", likes: video?.VideoData[videoIndex]?.likes });
    } else {
      user.likedVideos = user.likedVideos.filter(
        (likedVideo) => likedVideo.likedVideoID !== likedData._id.toString()
      );
      video.VideoData[videoIndex].likes -= 1;
      res
        .status(200)
        .json({
          message: "Disliked",
          likes: video?.VideoData[videoIndex]?.likes,
        });
    }

    await user.save();
    await video.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Likes.get("/getlike/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likes = video.VideoData[videoIndex].likes;

    res.json(likes);
  } catch (error) {
    res.json(error.message);
  }
});

Likes.get("/getuserlikes/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userData.findById(req.userId);

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedData = video.VideoData[videoIndex];

    const existingLikedVideo = user.likedVideos.find(
      (likedVideo) => likedVideo.likedVideoID === likedData._id.toString()
    );

    res.json({ existingLikedVideo });
  } catch (error) {
    res.json(error.message);
  }
});

Likes.post("/dislikevideo/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userData.findById(req.userId);

    const video = await videodata.findOne({ "VideoData._id": id });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const likedData = video.VideoData[videoIndex];
    const videoLikes = video.VideoData[videoIndex].likes;

    const existingLikedVideo = user.likedVideos.find(
      (likedVideo) => likedVideo.likedVideoID === likedData._id.toString()
    );

    if (videoLikes > 0 && existingLikedVideo) {
      user.likedVideos = user.likedVideos.filter(
        (likedVideo) => likedVideo.likedVideoID !== likedData._id.toString()
      );
      video.VideoData[videoIndex].likes -= 1;
    }

    await user.save(); // Save changes to the user object
    await video.save(); // Save changes to the video object

    res.status(200).json({ message: "Disliked", likes: video?.VideoData[videoIndex]?.likes });
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = Likes;
