const CACHE='talentos-public-v2';
const PUBLIC_PAGES=new Set(['/','/privacy']);
const PUBLIC_ASSETS=new Set(['/icon.svg','/manifest.webmanifest']);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...PUBLIC_PAGES,...PUBLIC_ASSETS]))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
  if(PUBLIC_PAGES.has(url.pathname)&&!url.search){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(response=>response||caches.match('/'))));
  }else if(PUBLIC_ASSETS.has(url.pathname))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
