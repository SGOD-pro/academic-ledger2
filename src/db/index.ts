import mongoose from "mongoose";

type connectObj = {
	isConnected?: number;
};

const connection: connectObj = {
	isConnected: 0,
};
export default async function connectDb(): Promise<void> {
	if (connection.isConnected) {
		console.log("Already connected!");
		return;
	}
	try {
		const con = await mongoose.connect(process.env.MONGO_URI!);
		con.connection.on("error", (error) => {
			console.log("Mongoose connection error");
			throw new Error(error);
		});
		con.connection.on("connection", () => {
			console.log("Mongodb connected.");
		});
		connection.isConnected = con.connections[0].readyState;
	} catch (error) {
		console.log("Server error: " + error);
		process.exit(1);
	}
}
