const APP_PREFIX = 'PWA-BudgetTracker-';
const VERSION = 'version_01';
const DATA_CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    
];


self.addEventListener('install', function (evnty) {
    evnty.waitUntil(
      caches.open(DATA_CACHE_NAME).then(function (cache) {
          console.log("Your files were successfull!");
          return cache.addAll(FILES_TO_CACHE)
      })
  )
});

self.addEventListener('activate', function (evnty) {
    evnty.waitUntil(
      caches.keys().then(function (keyList) {
          let cacheKeeplist = keyList.filter(function (key) {
              return key.indexOf(APP_PREFIX);
          });
          cacheKeeplist.push(DATA_CACHE_NAME);

          return Promise.all(keyList.map(function (key, i) {
              if (cacheKeeplist.indexOf(key) === -1) {
                  console.log('deleting cache : ' + keyList[i] );
                  return caches.delete(keyList[i]);
              }
          }));
      })
  )
});

self.addEventListener('fetch', function (evnty) {
  console.log('fetch request : ' + evnty.request.url);
  evnty.respondWith(
      caches.match(e.request).then(function (request) {
          if (request) { 
              console.log('Cache sending : ' + evnty.request.url);
              return request
          } else {      
              console.log('No cache is established : ' + evnty.request.url);
              return fetch(evnty.request)
          }

      })
  )
});