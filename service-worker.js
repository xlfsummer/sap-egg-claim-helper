const CACHE_NAME = "0.1.0";

self.addEventListener("install", function(event){
    caches.keys().then(keys => keys.map)

    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(cacheName => {
            if(cacheName != CACHE_NAME){
                return caches.delete(cacheName);
            }
            return Promise.resolve();
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
