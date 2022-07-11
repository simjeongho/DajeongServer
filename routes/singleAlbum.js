import mongoose from "mongoose";
import express from "express";
import uploadImage from "../multer.js";
import Counter from "./counter.js";
export const singleAlbumRouter = express.Router();
const singleAlbumSchema = new mongoose.Schema({
	title: String,
	content: String,
	filePath: String,
	postNum: Number,
});

const SingleAlbum = mongoose.model("singleAlbum", singleAlbumSchema);

singleAlbumRouter.post("/uploadSingleAlbumPost", uploadImage.single("singleImage"), (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3001");
	if (next) {
		const imageUrl = "http://localhost:5000/public/singleAlbum";
		const body = req.body;
		Counter.findOne({ name: "counter" })
			.exec()
			.then((counter) => {
				body.postNum = counter.postNum;
				console.log(body);
				console.log(req.file);

				const singleAlbum = new SingleAlbum({ ...body, filePath: res.req.file.path });
				singleAlbum
					.save()
					.then(() => {
						Counter.updateOne({ name: "counter" }, { $inc: { postNum: 1 } }).then(() => {
							res.setHeader("Access-Control-Allow-Origin", "*");

							res
								.status(200)
								.json({ success: true, filePath: `${imageUrl}${res.req.file.path}`, text: "몽고 DB 저장 성공" });
						});
					})
					.catch((err) => {
						res.status(400).json({ success: false });
					});
			});
	} else {
		res.send("SingleImageTestSuccess!");
	}
});

singleAlbumRouter.get("/getList", (req, res, next) => {
	SingleAlbum.find()
		.exec()
		.then((doc) => {
			res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
			res.setHeader("X-Content-Type-Options", "nosniff");
			res.status(200).json({ success: true, singleAlbumList: doc });
		})
		.catch((err) => {
			res.status(400).json({ success: false });
		});
});

singleAlbumRouter.get("/getDetail/:postNum", (req, res, next) => {
	console.log(req);
	SingleAlbum.findOne({ postNum: Number(req.params.postNum) })
		.exec()
		.then((doc) => {
			console.log(doc);
			res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
			res.setHeader("X-Content-Type-Options", "nosniff");
			res.status(200).json({ success: true, singleAlbumDetail: doc });
		})
		.catch((err) => {
			res.status(400).json({ success: false });
		});
});

export default SingleAlbum;
