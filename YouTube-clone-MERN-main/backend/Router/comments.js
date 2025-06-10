require("dotenv").config();
require("../Database/database");
const express = require("express");
const userData = require("../Models/user");
const videodata = require("../Models/videos");
const Comments = express.Router();
const requireAuth = require("./requireAuth");

Comments.post("/comments/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, channelID } = req.body;
    const user = await userData.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const video = await videodata.find({});

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const vid = video.find((vidData) =>
      vidData.VideoData.some((data) => data._id.toString() === id)
    );

    if (!vid) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = vid.VideoData.findIndex(
      (data) => data._id.toString() === id
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const newComment = {
      username: user.channelName,
      videoid: id,
      user_profile: user.profilePic,
      comment: comment,
      channel_id: channelID,
      time: new Date().toISOString(),
      likes: 0,
      user_email: user.email,
    };

    vid.VideoData[videoIndex].comments.push(newComment);

    await vid.save();

    res.status(200).json({ message: "Uploaded", commentData: newComment });
  } catch (error) {
    res.json(error.message);
  }
});

Comments.post("/likecomment/:videoId/:commentId", requireAuth, async (req, res) => {
  try {
    const { videoId, commentId } = req.params;

    const video = await videodata.findOne({ "VideoData._id": videoId });
    const user = await userData.findById(req.userId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;

    const commentIndex = comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = comments[commentIndex];

    const likedCommentIndex = user.likedComments.findIndex(
      (likedComment) => likedComment.comment_ID === commentId
    );

    if (likedCommentIndex === -1) {
      user.likedComments.push({ comment_ID: commentId });
      comment.likes += 1;
      await user.save();
      await video.save();
      return res
        .status(200)
        .json({ message: "Comment liked successfully", likes: comments });
    } else {
      user.likedComments.splice(likedCommentIndex, 1);
      comment.likes -= 1;
      await user.save();
      await video.save();
      return res
        .status(200)
        .json({ message: "Comment disliked successfully", likes: comments });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Comments.post("/heartcomment/:videoId/:commentID", requireAuth, async (req, res) => {
  try {
    const { videoId, commentID } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;
    const findComment = comments.find(
      (item) => item._id.toString() === commentID.toString()
    );

    if (findComment.heartComment === true) {
      findComment.heartComment = false;
    } else {
      findComment.heartComment = true;
    }

    await video.save();

    res.json(findComment?.heartComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Comments.get("/getheartcomment/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoId });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );
    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video entry not found" });
    }
    const comments = video.VideoData[videoIndex].comments || [];
    // Only return heartComment if comments exist
    const heart = comments.length > 0 ? comments.flatMap((item) => item.heartComment) : [];
    res.status(200).json(heart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

Comments.get("/likecomment/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoId });

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;

    res.json(comments);
  } catch (error) {
    res.json(error.message);
  }
});

Comments.get("/getcomments/:id", async (req, res) => {
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
    const comments = video.VideoData[videoIndex].comments;
    res.json(comments);
  } catch (error) {
    res.json(error.message);
  }
});

Comments.post("/deletecomment/:videoId/:commentId", requireAuth, async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const video = await videodata.findOne({ "VideoData._id": videoId });
    const user = await userData.findById(req.userId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const videoIndex = video.VideoData.findIndex(
      (data) => data._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comments = video.VideoData[videoIndex].comments;

    const existingCommentIndex = comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (existingCommentIndex !== -1) {
      // Remove the comment from the comments array
      comments.splice(existingCommentIndex, 1);

      // Save the updated video document
      await video.save();

      res
        .status(200)
        .json({ message: "Comment Deleted", commentData: comments });
    } else {
      return res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    res.json(error.message);
  }
});

module.exports = Comments;
