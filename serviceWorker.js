const currentVersion = 'v0.0.1';

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(currentVersion).then(cache => cache.addAll([
			'',
			'index.html',
			'js/load.min.js',
			'lib/db.js/js/db.min.js',
			'css/style.min.css'
		]))
	);
});

self.addEventListener('fetch', e => {
	e.respondWith(
		caches.open(currentVersion).then(cache => {
			return cache.match(e.request).then(resp => {
				return resp || fetch(e.request).then(response => {
					cache.put(e.request, response.clone());
					return response;
				}).catch(() => {
					return caches.match(e.request).then(fallback => {
						return fallback;
					});
				});
			});
		})
	);
});

self.addEventListener('activate', e => {
	e.waitUntil(
		caches.keys().then(keyList => 
			Promise.all(keyList.map(key => key != currentVersion ? caches.delete(key) : Promise.resolve()))
		)
	);
});