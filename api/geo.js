// ============================================================
//  winstep.io — /api/geo  (Vercel Edge Function)
//
//  Returns the visitor's country code from Vercel's edge header,
//  so cookie-consent.js can pick the right banner (US light bar vs
//  EU/UK opt-in CMP). No third party ever sees the IP.
//
//  DEPLOY: put this file in the repo at  /api/geo.js
//          (Vercel serves it automatically at  https://winstep.io/api/geo )
//  It returns e.g.  {"country":"US"}   or   {"country":"DE"}
// ============================================================

export const config = { runtime: 'edge' };

export default function handler(request) {
  // Vercel sets this header on every request, from edge geolocation.
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  return new Response(JSON.stringify({ country: country }), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
