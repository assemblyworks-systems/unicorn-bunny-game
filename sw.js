/* Small network/cache layer retained for existing installed apps. No offline pack. */
const CACHE = 'playbox-v2-20260907-1';
const BASE = new URL('./', self.location.href);
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{ const keys=await caches.keys(); await Promise.all(keys.filter(k=>(k.startsWith('playbox-v2-')||k.startsWith('playbox-cache-'))&&k!==CACHE).map(k=>caches.delete(k))); await self.clients.claim(); })());
});
async function rangeResponse(request,response) {
  const range=request.headers.get('range');
  if(!range || response.status!==200) return response;
  const match=/^bytes=(\d*)-(\d*)$/.exec(range); if(!match) return response;
  const bytes=await response.arrayBuffer(), length=bytes.byteLength;
  let start=match[1]?Number(match[1]):Math.max(0,length-Number(match[2]));
  let end=match[1]?(match[2]?Math.min(Number(match[2]),length-1):length-1):length-1;
  if(start>=length||start>end) return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});
  const headers=new Headers(response.headers); headers.set('Content-Range','bytes '+start+'-'+end+'/'+length); headers.set('Content-Length',String(end-start+1)); headers.set('Accept-Ranges','bytes');
  return new Response(bytes.slice(start,end+1),{status:206,headers});
}
self.addEventListener('fetch', event => {
  const req=event.request, url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)) return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cacheKey=req.mode==='navigate'?url.origin+url.pathname:req.url;
    const cached=await cache.match(cacheKey);
    if(cached && /\.(mp3|png|svg)$/.test(url.pathname)) return rangeResponse(req,cached);
    const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),4000);
    try {
      const fresh=await fetch(req,{cache:'no-store',signal:controller.signal});
      if(!fresh.ok) { if(cached) return rangeResponse(req,cached); return fresh; }
      if(fresh.status===200) { const copy=fresh.clone(); event.waitUntil(cache.put(cacheKey,copy).catch(()=>{})); }
      return fresh;
    } catch(error) { if(cached) return rangeResponse(req,cached); throw error; }
    finally { clearTimeout(timeout); }
  })());
});
