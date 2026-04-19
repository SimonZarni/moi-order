type PixelCrop = { x: number; y: number; width: number; height: number };

export function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('No canvas context')); return; }
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
      );
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    });
    image.addEventListener('error', reject);
    image.src = imageSrc;
  });
}
