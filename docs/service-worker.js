const CACHE_NAME = 'v9';
const API_URL = 'https://utm210012ti-default-rtdb.firebaseio.com/.json';

// Archivos que se agregarán al caché
const FILES_TO_CACHE = [
  '/',
  '/docs/index.html',
  '/docs/css/style.css',
  '/docs/app.js',
  '/docs/manifest.json',
  '/docs/images/brendaZ.jpeg',
  '/docs/images/wendigo.jpeg',
  '/docs/images/merodeador.jpeg',
  '/docs/images/cosechador.jpeg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        // Verificar que cada archivo en FILES_TO_CACHE sea accesible
        const cachePromises = FILES_TO_CACHE.map(async (url) => {
          const request = new Request(url, { mode: 'no-cors' });
          const response = await fetch(request);
          if (!response.ok) {
            throw new Error(`Request for ${url} failed with status ${response.status}`);
          }
          return cache.put(url, response);
        });
        return await Promise.all(cachePromises);
      } catch (error) {
        console.error('Error al agregar recursos al caché:', error);
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url === API_URL) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request).then(response => {
            if (response) {
              return response;
            } else {
              return new Response(JSON.stringify({ results: [] }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          let responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache).catch(error => {
              console.error('Error al almacenar la respuesta en caché:', error);
            });
          });
          return networkResponse;
        });
      }).catch(async error => {
        console.error('Error al manejar la solicitud:', error);
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) {
          return offlineResponse;
        }
        return new Response('Página no disponible sin conexión y no se encuentra un recurso de reserva.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
