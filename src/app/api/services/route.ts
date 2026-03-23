// ═══════════════════════════════════════
// API Route: GET /api/services
// Fetch active services from Supabase
// ═══════════════════════════════════════

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export const GET = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('Services')
      .select('*')
      .eq('isActive', true)
      .order('code', { ascending: true });

    if (error) {
      console.error('[API /services] Supabase error:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch services', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ services: data || [] });
  } catch (err) {
    console.error('[API /services] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
