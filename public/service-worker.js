const CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/db.js",
    "/index.js",
    "/styles.css",
    "/dist/app.bundle.js",
    "/dist/db.bundle.js",
    "/dist/icon_72x72.png",
    "/dist/icon_96x96.png",
    "/dist/icon_128x128.png",
    "/dist/icon_144x144.png",
    "/dist/icon_152x152.png",
    "/dist/icon_192x192.png",
    "/dist/icon_384x384.png",
    "/dist/icon_512x512.png",
    "/dist/manifest.json"
];

// install
self.addEventListener("install", function (event) {
  
  console.log("install");

  // pre cache transactions data
  const cacheImageData = async () => {
    const cache = await caches.open(DATA_CACHE_NAME);
    return cache.add("/api/transaction");
  }
  
  // pre cache all static assets
  const cacheResources = async () => {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(FILES_TO_CACHE);
  }

  event.waitUntil(cacheImageData());

  event.waitUntil(cacheResources());

  // tell the browser to activate this service worker immediately once it
  // has finished installing
  self.skipWaiting();

});

// activate
self.addEventListener("activate", function(event) {

  console.log("activate");

  const removeOldCache = async () => {
    const cacheKeyArray = await caches.keys();
  
    const cacheResultPromiseArray = cacheKeyArray.map(key => {
      if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
        console.log("Removing old cache data", key);
        return caches.delete(key);
      }
    });  
    return Promise.all(cacheResultPromiseArray);
  }

  event.waitUntil(removeOldCache()); 

  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function(event) {
  
  const handleAPIDataRequest = async (event) => {
    try {
      const response = await fetch(event.request);
      // If the response was good, clone it and store it in the cache.
      if (response.status === 200) {
        console.log(`Adding API request to cache now: ${event.request.url}`);

        const apiCache = await caches.open(DATA_CACHE_NAME);
        await apiCache.put(event.request.url, response.clone());

        return response;
      }
    } catch(error) {
      // Network request failed, try to get it from the cache.
      console.log(`Network error occurred with API request. Now retrieving it from the cache: ${event.request.url}`)
      return await caches.match(event.request);
    }
  }
  
  const handleResourceRequest = async (event) => {
    const matchedCache = await caches.match(event.request);
    return matchedCache ||  await fetch(event.request);
  }

  if (event.request.url.includes("/api/")) {
    event.respondWith(handleAPIDataRequest(event));
  } 
  // I don't think I need this else statement since we will only be making /api request (single html page)
  else {
    event.respondWith(handleResourceRequest(event));
  }
});