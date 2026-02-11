import { CacheConstant } from '@/lib/constants/constants';
import { revalidateTag } from 'next/cache';

export async function POST() {
   // Recommended SWR-style behavior
   revalidateTag(CacheConstant.revalidateTag, 'max');

   return Response.json({ revalidated: true });
}