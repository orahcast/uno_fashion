/**
 * Client-side HEIC/HEIF to JPEG converter for Uno Fashion Admin.
 *
 * Tries:
 * 1. Native browser decoding (Apple Safari on macOS / iOS via createImageBitmap + Canvas)
 * 2. WebAssembly decoder (heic2any loaded dynamically via CDN for Chrome / Edge / Firefox)
 */

export async function convertHeicToJpeg(file: File): Promise<File> {
  const isHeic =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  if (!isHeic) {
    return file;
  }

  // 1. Try native browser decoding (works out of the box in Safari on macOS / iOS)
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(bitmap, 0, 0);
      const jpegBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      );
      if (jpegBlob) {
        const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
        return new File([jpegBlob], newFileName, { type: 'image/jpeg' });
      }
    }
  } catch (nativeErr) {
    // Native decoding failed (e.g. Google Chrome or Firefox)
    console.info('Native HEIC decoding not supported by browser, falling back to WebAssembly converter...');
  }

  // 2. Load heic2any dynamically from CDN (works inside Chrome, Firefox, Edge via WebAssembly)
  if (typeof window !== 'undefined') {
    try {
      if (!(window as any).heic2any) {
        await new Promise<void>((resolve, reject) => {
          // Check if already in DOM
          const existingScript = document.querySelector('script[src*="heic2any"]');
          if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject(new Error('Failed to load heic2any')));
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => {
            // Fallback to unpkg if jsdelivr fails
            const unpkgScript = document.createElement('script');
            unpkgScript.src = 'https://unpkg.com/heic2any@0.0.4/dist/heic2any.min.js';
            unpkgScript.onload = () => resolve();
            unpkgScript.onerror = () => reject(new Error('Failed to load HEIC converter from CDN'));
            document.head.appendChild(unpkgScript);
          };
          document.head.appendChild(script);
        });
      }

      const heic2any = (window as any).heic2any;
      if (heic2any) {
        const result = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.88,
        });

        const jpegBlob = Array.isArray(result) ? result[0] : result;
        const newFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
        return new File([jpegBlob], newFileName, { type: 'image/jpeg' });
      }
    } catch (wasmErr) {
      console.warn('WebAssembly HEIC conversion failed:', wasmErr);
    }
  }

  throw new Error(
    'HEIC images cannot be converted in this browser. Please export this photo as JPG or PNG from your Mac Photos app (File → Export → Export 1 Photo as JPEG) before uploading, or use Safari.'
  );
}

