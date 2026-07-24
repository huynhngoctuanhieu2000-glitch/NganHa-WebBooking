import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/api/withAuth';
import { apiResponse } from '@/lib/api/apiResponse';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const PUT = withAuth(async (req, { supabase }, params) => {
  const body = await req.json();
  const { id } = await params;

  const { data, error } = await supabase
    .from('Services')
    .update({ 
      media_url: body.media_url,
      media_type: body.media_type
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return apiResponse.error(error.message, 'DB_ERROR', 500);
  }

  return apiResponse.success(data);
});
