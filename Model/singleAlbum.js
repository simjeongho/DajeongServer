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
		console.log(req.body);
		console.log(req.file);
		res.status(200).json({ success: true, filePath: res.req.file.path });
		const singleAlbum = new singleAlbum();
		// singleAlbum
		// 	.save()
		// 	.then(() => {
		// 		res.status(200).json({ success: true, text: "성공이에요" });
		// 	})
		// 	.catch((err) => {
		// 		res.status(400).json({ success: false });
		// 	});
	} else {
		res.send("SingleImageTestSuccess!");
	}
});

singleAlbumRouter.post("/uploadText", (req, res, next) => {
	if (next) {
		console.log(req.body);
		console.log(req.file);
		//res.status(200).json({ success: true, filePath: res.req.file.path });
		const singleAlbum = new SingleAlbum(req.body);
		singleAlbum
			.save()
			.then(() => {
				res.status(200).json({ success: true, text: "몽고DB저장 성공" });
			})
			.catch((err) => {
				res.status(400).json({ success: false });
			});
	} else {
		res.send("SingleTextTestSuccess!");
	}
});

export default SingleAlbum;
