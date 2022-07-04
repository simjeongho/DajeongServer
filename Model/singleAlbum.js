import mongoose from "mongoose";
import express from "express";
import uploadImage from "../multer.js";
export const singleAlbumRouter = express.Router();
const singleAlbumSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const SingleAlbum = mongoose.model("singleAlbum", singleAlbumSchema);

singleAlbumRouter.post("/uploadImage", uploadImage.single("singleImage"), (req, res, next) => {
	if (next) {
		const body = req.body;
		console.log(body);
		console.log(req.file);
		res.status(200).json({ success: true, filePath: res.req.file.path });
		const singleAlbum = new SingleAlbum(body);
		singleAlbum
			.save()
			.then(() => {
				res.status(200).json({ success: true, text: "몽고DB저장 성공" });
			})
			.catch((err) => {
				res.status(400).json({ success: false });
			});
	} else {
		res.send("SingleImageTestSuccess!");
	}
});

export default SingleAlbum;
