"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        console.log("☁️ Cloudinary configured");
    }
    async uploadFromBuffer(buffer, folder, publicId) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                public_id: publicId,
                overwrite: true,
                quality: "auto",
                fetch_format: "auto",
            }, (error, result) => {
                if (error || !result) {
                    return reject(error ?? new Error("Upload failed"));
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    format: result.format,
                    width: result.width,
                    height: result.height,
                });
            });
            uploadStream.end(buffer);
        });
    }
    async delete(publicId) {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
}
exports.CloudinaryService = CloudinaryService;
