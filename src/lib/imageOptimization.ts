/**
 * Ottimizza URL Cloudinary per la galleria
 * Aggiunge parametri di trasformazione per ridurre dimensioni e migliorare performance
 */
export function optimizeCloudinaryUrl(url: string, options: {
  width?: number;
  quality?: number;
} = {}): string {
  const { width = 800, quality = 75 } = options;
  
  // Verifica se è un URL Cloudinary
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  // Pattern: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  // Inserisci i parametri di trasformazione dopo "/upload/"
  const beforeUpload = url.substring(0, uploadIndex + 8); // include "/upload/"
  const afterUpload = url.substring(uploadIndex + 8);
  
  // Parametri Cloudinary:
  // w_ = width
  // q_ = quality
  // f_auto = formato automatico (webp dove supportato)
  // c_limit = non upscale, solo downscale
  const transformations = `w_${width},q_${quality},f_auto,c_limit/`;
  
  return `${beforeUpload}${transformations}${afterUpload}`;
}

