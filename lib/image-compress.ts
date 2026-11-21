/**
 * Compresses an image File to a Base64 Data URL.
 * Max dimensions: 800×800px. Target size: < 150 KB.
 * Uses canvas toDataURL with stepped quality reduction.
 */
export async function compressImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const MAX_PX = 800;
    const TARGET_BYTES = 150 * 1024; // 150 KB

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calculate scaled dimensions
      let { width, height } = img;
      if (width > MAX_PX || height > MAX_PX) {
        const ratio = Math.min(MAX_PX / width, MAX_PX / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // Try quality steps: 0.85, 0.70, 0.55, 0.40, 0.25
      const qualities = [0.85, 0.70, 0.55, 0.40, 0.25];
      let dataUrl = "";

      for (const q of qualities) {
        dataUrl = canvas.toDataURL("image/jpeg", q);
        // Rough byte estimate: base64 length * 0.75
        const estimatedBytes = (dataUrl.length * 3) / 4;
        if (estimatedBytes <= TARGET_BYTES) break;
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
}

/** Returns approximate byte size of a base64 Data URL */
export function base64ByteSize(dataUrl: string): number {
  const base64Part = dataUrl.split(",")[1] ?? "";
  return Math.round((base64Part.length * 3) / 4);
}

/** Format bytes to human-readable KB string */
export function formatBytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}
