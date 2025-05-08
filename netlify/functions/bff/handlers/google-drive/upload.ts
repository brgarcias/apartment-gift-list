import { google } from "googleapis";
import { HandlerEvent } from "@netlify/functions";
import { errorResponse, jsonResponse } from "@/lib/response";
import { uploadProfileImage } from "../users/update";
import { Readable } from "node:stream";
import { parseMultipartForm } from "../utils/parse.utils";

export const runtime = "edge";

export async function uploadImage(event: HandlerEvent) {
  const userId = event.path.split("/").pop();
  if (!userId || isNaN(parseInt(userId))) {
    return errorResponse(400, "Invalid user ID");
  }

  try {
    const formData: any = await parseMultipartForm(event);
    const file = formData.file;

    if (!file) {
      return errorResponse(400, "No file uploaded");
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const fileMetadata = {
      name: `profile_${Date.now()}_${file.filename.filename}`,
      parents: [folderId || ""],
    };

    const media = {
      mimeType: file.mimetype,
      body: Readable.from(file.content),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
      supportsAllDrives: true,
    });

    await drive.permissions.create({
      fileId: response.data.id || "",
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const imageUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

    const updatedUser = await uploadProfileImage(userId, imageUrl);

    return jsonResponse(200, {
      updatedUser,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return errorResponse(500, `Failed to upload file: ${error.message}`);
  }
}

export async function uploadGiftImage(file: {
  content: Buffer;
  filename: string;
  mimetype: string;
}): Promise<string> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    const folderId = process.env.GOOGLE_DRIVE_GIFT_FOLDER_ID;

    const fileMetadata = {
      name: `gift_${Date.now()}_${file.filename}`,
      parents: [folderId || ""],
    };

    const media = {
      mimeType: file.mimetype,
      body: Readable.from(file.content),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
      supportsAllDrives: true,
    });

    await drive.permissions.create({
      fileId: response.data.id || "",
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return `https://drive.google.com/uc?export=view&id=${response.data.id}`;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}
