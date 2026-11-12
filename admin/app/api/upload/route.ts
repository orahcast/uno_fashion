import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import sharp from 'sharp';

export const runtime = 'nodejs';

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

    const supabase = await createClient();
    const { data, error: uploadError } = await supabase.storage
      .from('inventory-photos')
      .upload(fileName, outputBuffer, {
        contentType: outputContentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        {
          error: uploadError.message,
          hint: 'Ensure inventory-photos storage bucket exists in Supabase Storage with proper RLS policies.',
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('inventory-photos').getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrl,
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

