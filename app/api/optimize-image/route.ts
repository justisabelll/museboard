import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 95, lossless: false, nearLossless: true })
      .toBuffer();

    // Convert the buffer to base64
    const base64Image = `data:image/webp;base64,${optimizedBuffer.toString(
      'base64'
    )}`;

    return NextResponse.json({
      optimizedImage: base64Image,
      filename: `${file.name.split('.')[0]}_optimized.webp`,
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    return NextResponse.json(
      { error: 'Failed to optimize image' },
      { status: 500 }
    );
  }
}
