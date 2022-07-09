import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
	{
		title: String,
		postNum: Number,
	},
	{ collection: "counter" },
);

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
