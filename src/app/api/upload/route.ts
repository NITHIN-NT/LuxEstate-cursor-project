import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: "Cloudinary credentials are not configured" }, { status: 500 });
        }

        const uploadPromises = files.map(async (file) => {
            // 1. Convert File to Buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // 2. Convert to WebP using sharp
            const webpBuffer = await sharp(buffer)
                .webp({ quality: 80 })
                .toBuffer();

            // 3. Upload to Cloudinary
            return new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "luxestate",
                        format: "webp",
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            reject(error);
                        } else {
                            resolve(result!.secure_url);
                        }
                    }
                );
                uploadStream.end(webpBuffer);
            });
        });

        const urls = await Promise.all(uploadPromises);

        return NextResponse.json({ urls });
    } catch (error: unknown) {
        console.error("Upload handler error:", error);
        return NextResponse.json({ error: (error as Error).message || "Failed to upload images" }, { status: 500 });
    }
}
