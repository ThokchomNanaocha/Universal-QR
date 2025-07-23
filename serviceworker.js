const CACHE_NAME = 'universal-qr-v2.0.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/ProductDisplayPage.html',
  '/AddNewProduct.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

console.log('🚀 Service Worker script loaded');
console.log('📦 Cache name:', CACHE_NAME);
console.log('📄 URLs to cache:', urlsToCache);

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  console.log('📋 Install event:', event);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache opened successfully');
        console.log('🔄 Adding URLs to cache...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All files cached successfully');
        console.log('⏭️ Skipping waiting...');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache installation failed:', error);
        console.error('💥 Error details:', error.message);
        console.error('📍 Error stack:', error.stack);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  console.log('📋 Activate event:', event);
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('🔍 Found caches:', cacheNames);
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            } else {
              console.log('✅ Keeping current cache:', cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        console.log('🎯 Claiming clients...');
        return self.clients.claim();
      })
      .then(() => {
        console.log('✅ All clients claimed');
      })
      .catch((error) => {
        console.error('❌ Activation failed:', error);
      })
  );
});

// Fetch files from cache
self.addEventListener('fetch', (event) => {
  // Only log important requests to avoid spam
  if (!event.request.url.includes('chrome-extension') && 
      !event.request.url.includes('_devtools')) {
    console.log('🌐 Fetch request:', event.request.url);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        console.log('🔄 Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            console.log('✅ Network fetch successful:', event.request.url);
            return networkResponse;
          })
          .catch((error) => {
            console.error('❌ Network fetch failed:', event.request.url, error);
            throw error;
          });
      })
      .catch((error) => {
        console.error('❌ Fetch failed for:', event.request.url, error);
        throw error;
      })
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Skipping waiting...');
    self.skipWaiting();
  }
});

console.log('✅ Service Worker script setup complete');