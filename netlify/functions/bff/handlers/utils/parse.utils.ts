import { HandlerEvent } from "@netlify/functions";
import Busboy from "busboy";

export const runtime = "edge";

export async function parseMultipartForm(event: HandlerEvent) {
  return new Promise((resolve, reject) => {
    const fields: any = {};
    let fileProcessed = false;

    const busboy = Busboy({
      headers: event.headers,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    });

    busboy.on(
      "file",
      (
        fieldname: any,
        fileStream: any,
        filename: any,
        encoding: any,
        mimetype: any
      ) => {
        if (fieldname !== "file") {
          fileStream.resume();
          return;
        }

        fileProcessed = true;
        const chunks: Buffer[] = [];

        fileStream.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        fileStream.on("end", () => {
          return (fields.file = {
            content: Buffer.concat(
              chunks.map((chunk) => Uint8Array.from(chunk))
            ),
            filename,
            mimetype,
          });
        });

        fileStream.on("error", (err: any) => {
          reject(new Error("Error processing file stream"));
        });
      }
    );

    busboy.on("error", (err: any) => {
      reject(err);
    });

    busboy.on("finish", () => {
      if (!fileProcessed) {
        reject(new Error("No file was uploaded"));
      } else {
        resolve(fields);
      }
    });

    // Convert event.body to Buffer if it's not already
    const bodyBuffer = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "");

    busboy.write(bodyBuffer);
    busboy.end();
  });
}
