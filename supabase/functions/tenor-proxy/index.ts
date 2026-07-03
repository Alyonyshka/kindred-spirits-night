import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint') || 'search'; // 'search' | 'featured'
    const q = url.searchParams.get('q') || '';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '24', 10) || 24, 50);
    const mediaFilter = url.searchParams.get('media_filter') || 'tinygif';
    const searchFilter = url.searchParams.get('searchfilter') || '';

    if (endpoint !== 'search' && endpoint !== 'featured') {
      return new Response(JSON.stringify({ error: 'invalid endpoint' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (q.length > 100) {
      return new Response(JSON.stringify({ error: 'query too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const key = Deno.env.get('TENOR_API_KEY');
    if (!key) {
      return new Response(JSON.stringify({ error: 'server not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({
      key,
      limit: String(limit),
      media_filter: mediaFilter,
    });
    if (endpoint === 'search') params.set('q', q);
    if (searchFilter) params.set('searchfilter', searchFilter);

    const tenorUrl = `https://tenor.googleapis.com/v2/${endpoint}?${params.toString()}`;
    const res = await fetch(tenorUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'proxy failure' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
