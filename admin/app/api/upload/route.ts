import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

export const runtime = 'nodejs';

function saveLocally(fileName: string, buffer: Buffer): string {
  const adminUploadDir = path.join(process.cwd(), 'public', 'uploads');
  const websiteUploadDir = path.join(process.cwd(), '..', 'website', 'public', 'uploads');

  try {
    if (!fs.existsSync(adminUploadDir)) {
      fs.mkdirSync(adminUploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(adminUploadDir, fileName), buffer);
  } catch (e) {
    console.warn('Could not write to admin uploads:', e);
  }

  try {
    if (!fs.existsSync(websiteUploadDir)) {
      fs.mkdirSync(websiteUploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(websiteUploadDir, fileName), buffer);
  } catch (e) {
    console.warn('Could not write to website uploads:', e);
  }

  return `/uploads/${fileName}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'protocol';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const isHeic =
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    let outputBuffer: Buffer;
    let outputExt = 'jpg';
    let outputContentType = 'image/jpeg';

    try {
      // Automatically auto-rotate using EXIF and convert/compress to JPEG
      outputBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({ width: 1600, height: 2000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
    } catch (sharpErr: any) {
      console.warn('Sharp processing failed, falling back:', sharpErr);
      if (isHeic) {
        return NextResponse.json(
          {
            error:
              'HEIC image could not be converted on server. Please export as JPG or PNG from your iPhone / Mac Photos app before uploading.',
          },
          { status: 400 }
        );
      }
      outputBuffer = inputBuffer;
      outputExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      outputContentType = file.type || 'image/jpeg';
    }

    const fileName = `${folder}-${Date.now()}.${outputExt}`;

    try {
      const supabase = await createClient();
      const { data, error: uploadError } = await supabase.storage
        .from('inventory-photos')
        .upload(fileName, outputBuffer, {
          contentType: outputContentType,
          upsert: true,
        });

      if (!uploadError && data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('inventory-photos').getPublicUrl(fileName);

        // Also cache locally for instant reliability
        saveLocally(fileName, outputBuffer);

        return NextResponse.json({
          url: publicUrl,
          fileName,
          success: true,
        });
      }

      console.warn('Supabase storage upload returned error, falling back to local file storage:', uploadError);
    } catch (sbErr) {
      console.warn('Supabase storage exception, falling back to local storage:', sbErr);
    }

    // Resilient local fallback
    const localUrl = saveLocally(fileName, outputBuffer);

    return NextResponse.json({
      url: localUrl,
      fileName,
      success: true,
    });
  } catch (err: any) {
    console.error('Upload API route error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal upload error' },
      { status: 500 }
    );
  }
}

