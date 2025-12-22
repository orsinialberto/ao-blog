/**
 * Optimizes Cloudinary URLs for images
 * Adds transformation parameters to reduce size and improve performance
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    quality?: number;
    format?: "auto" | "webp" | "avif" | "jpg";
  } = {}
): string {
  const { width = 800, quality = 75, format = "auto" } = options;

  // Check if it's a Cloudinary URL
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  // Pattern: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
  const uploadIndex = url.indexOf("/upload/");
  if (uploadIndex === -1) {
    return url;
  }

  // Insert transformation parameters after "/upload/"
  const beforeUpload = url.substring(0, uploadIndex + 8); // includes "/upload/"
  const afterUpload = url.substring(uploadIndex + 8);

  // Cloudinary parameters:
  // w_ = width
  // q_ = quality
  // f_auto = automatic format (webp where supported)
  // f_webp, f_avif, f_jpg = specific format
  // c_limit = no upscale, only downscale
  const formatParam = format !== "auto" ? `f_${format}` : "f_auto";
  const transformations = `w_${width},q_${quality},${formatParam},c_limit/`;

  return `${beforeUpload}${transformations}${afterUpload}`;
}

