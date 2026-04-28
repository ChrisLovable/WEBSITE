import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET(request: Request) {
  const pw = request.headers.get('x-admin-password');
  if (pw !== '11274') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const service = searchParams.get('service');
  const limit = Math.min(Number(searchParams.get('limit') || 50), 200);
  const offset = Number(searchParams.get('offset') || 0);

  let query = supabase
    .from('interest_submissions')
    .select('*', { count: 'exact' })
    .order('submitted_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);
  if (service) query = query.ilike('service_required', `%${service}%`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const newCount = rows.filter((r) => r.status === 'new').length;
  const todayCount = rows.filter((r) => new Date(r.submitted_at) >= todayStart).length;

  const { count: totalNewCount } = await supabase
    .from('interest_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');

  return NextResponse.json({
    submissions: rows,
    total: count ?? rows.length,
    new_count: totalNewCount ?? newCount,
    today_count: todayCount,
  });
}
