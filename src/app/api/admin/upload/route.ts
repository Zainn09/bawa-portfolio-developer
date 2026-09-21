import { NextRequest } from "next/server";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { guard, reply, boundedBody, inputError } from "@/lib/cms/http";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const access = await guard(req);
  if (access.error) return access.error;
  try {
    const body = await boundedBody(req, 4 * 1024 * 1024 + 65536);
    const form = await new Request(req.url, {
      method: "POST",
      headers: { "Content-Type": req.headers.get("content-type") || "" },
      body: new Uint8Array(body),
    }).formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 4 * 1024 * 1024)
      return reply(
        { error: "Choose a JPEG, PNG, WebP, or AVIF image under 4 MB." },
        400,
      );
    const image = sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 24_000_000,
      animated: false,
    });
    const meta = await image.metadata();
    if (
      !["jpeg", "png", "webp", "avif", "heif"].includes(meta.format || "") ||
      (meta.pages || 1) > 1
    )
      return reply(
        {
          error:
            "Use a still JPEG, PNG, WebP, or AVIF image. SVG and animated files are not accepted.",
        },
        400,
      );
    const { data, info } = await image
      .rotate()
      .resize({
        width: 1600,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer({ resolveWithObject: true });
    const path = `${access.auth!.user.id}/${randomUUID()}.webp`;
    const { error } = await access
      .auth!.db.storage.from("blog-media")
      .upload(path, data, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
    if (error)
      return reply(
        {
          error: "Image upload failed. Check bucket permissions and try again.",
        },
        503,
      );
    const { data: publicURL } = access
      .auth!.db.storage.from("blog-media")
      .getPublicUrl(path);
    return reply(
      {
        media: {
          src: publicURL.publicUrl,
          width: info.width,
          height: info.height,
          alt: "",
        },
      },
      201,
    );
  } catch (e) {
    return e instanceof Error && e.message === "BODY_TOO_LARGE"
      ? inputError(e)
      : reply(
          {
            error:
              "This image could not be processed. Use a supported still image under 4 MB and 24 megapixels.",
          },
          400,
        );
  }
}
