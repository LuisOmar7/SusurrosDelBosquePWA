self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v2').then(async (cache) => {
      try {
        return await cache.addAll([
          '/',
          '/index.html',
          '/src/css/style.css',
          '/src/app.js',
          '/src/manifest.json',
          '/src/images/icon-128.png',
          '/src/images/icon-512.png'
        ]);
      } catch (error) {
        console.error('Error al agregar recursos al caché:', error);
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si hay una respuesta en el caché, la devuelve
        if (response) {
          return response;
        }

        // Clona la solicitud para hacer una llamada de red
        let fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((networkResponse) => {
          // Verifica si la respuesta es válida
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          // Clona la respuesta antes de almacenarla en caché
          let responseToCache = networkResponse.clone();

          caches.open('v2').then((cache) => {
            cache.put(event.request, responseToCache).catch((error) => {
              console.error('Error al almacenar la respuesta en caché:', error);
            });
          });

          return networkResponse;
        });
      }).catch(async (error) => {
        console.error('Error al manejar la solicitud:', error);
        // Devolver una página de reserva en caso de error
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
});
