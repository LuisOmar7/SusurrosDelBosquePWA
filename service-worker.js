self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/css/style.css',
        '/src/app.js',
        '/src/manifest.json',
        '/src/images/icon-128.png',
        '/src/images/icon-512.png'
      ]).catch((error) => {
        console.error('Error al agregar recursos al caché:', error);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch((error) => {
      console.error('Error al manejar la solicitud:', error);
    })
  );
});
