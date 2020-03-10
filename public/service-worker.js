const FILES_TO_CACHE = [
    "/",
    "index.js",
    "style.css"
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were cached successfully");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
})

self.addEventListener("activate", function(evt) {
    
})