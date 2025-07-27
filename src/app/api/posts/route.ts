// src/app/api/posts/route.ts
import { getPosts } from '@/app/lib/wp';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page     = Number(searchParams.get('page')     ?? '1');
  const per_page = Number(searchParams.get('per_page') ?? '2');

  const posts = await getPosts({ page, per_page });
  return NextResponse.json({ posts });
}
