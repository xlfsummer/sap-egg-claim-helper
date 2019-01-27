const CACHE_NAME = "1";

self.addEventListener("install", function(event){
    event.waitUtil(Promise.all(caches.keys().then(keys => keys.map(cacheName => {
            if(cacheName != CACHE_NAME){
                return caches.delete(cacheName);
            }
        }))
    ));
});

self.addEventListener("fetch", function(event){
    event.respondWith((async function(){
        /** @type {Request} */
        let req = event.request;
        /** @type {Response} */
        let cache = await caches.open(CACHE_NAME);
        let res = await cache.match(req);
        if(!res){
            hasCache = false;
            let responseFromWeb = await fetch(req.clone());
            cache.put(req.clone(), responseFromWeb.clone());
            return responseFromWeb;
        }
        return res;
    })());
});
