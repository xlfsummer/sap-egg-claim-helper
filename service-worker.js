self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open("v1")
    )
});
