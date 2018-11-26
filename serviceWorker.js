const currentVersion = 'v0.0.7';

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
		caches.match(e.request).then(resp => {
			return resp || fetch(e.request).then(response => {
				return caches.open(currentVersion).then(cache => {
					cache.put(e.request, response.clone());
					return response;
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