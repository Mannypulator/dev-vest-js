import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!process.env.MONGODB_URI) {
		throw new Error('MONGODB_URI is not defined in the environment variables');
	}

	if (!cached.promise) {
		console.log('🔗 Connecting to MongoDB...');
		const opts = { bufferCommands: false };

		cached.promise = mongoose
			.connect(process.env.MONGODB_URI, opts)
			.then((mongoose) => {
				console.log('✅ MongoDB Connected');
				return mongoose;
			})
			.catch((err) => {
				console.error('❌ MongoDB Connection Failed:', err.message);
				throw err; // Re-throw to handle in caller
			});
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (err) {
		cached.promise = null;
		throw err;
	}
}

export default connectDB;
