// Script to seed the database with more than 10 videos for testing/demo purposes
const mongoose = require("mongoose");
const VideoDataModel = require("./Models/videos");
const UserModel = require("./Models/user");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/youtube-clone";

async function seedVideos() {
  await mongoose.connect(MONGO_URI);

  // Find a user to associate videos with (or create one)
  let user = await UserModel.findOne();
  if (!user) {
    user = new UserModel({
      name: "Demo User",
      email: "demo@example.com",
      password: "demo1234",
      channelName: "DemoChannel",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
      videos: [],
      thumbnails: []
    });
    await user.save();
  }

  // Remove existing videos for a clean slate
  await VideoDataModel.deleteMany({ email: user.email });

  const now = new Date();
  const videos = [];
  for (let i = 1; i <= 12; i++) {
    videos.push({
      thumbnailURL: `https://picsum.photos/seed/thumb${i}/320/180`,
      uploader: user.channelName,
      videoURL: `https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_${i}.mp4`,
      ChannelProfile: user.profilePic,
      Title: `Sample Video ${i}`,
      Description: `This is a description for sample video ${i}.`,
      Tags: `sample,video,${i}`,
      videoLength: 60 + i * 10,
      uploaded_date: now.toISOString(),
      visibility: "Public",
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      comments: []
    });
  }

  const videoDoc = new VideoDataModel({
    email: user.email,
    VideoData: videos
  });
  await videoDoc.save();

  console.log("Seeded 12 videos for user:", user.email);
  await mongoose.disconnect();
}

seedVideos().catch(err => {
  console.error(err);
  process.exit(1);
});
