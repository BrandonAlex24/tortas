const CacheStatic = "estatico-1";
const CacheDinamic = "dinamico-1";
const CacheInmutable = "inmutable-1";

self.addEventListener("install", (event) => {
	const cacheStatic = caches.open(CacheStatic).then((cache) => {
		cache.addAll([
            "js/pedidos.js",
			"/",
			"index.html",
			"css/style.css",
			"js/scripts.js",
			"sw.js",
			"manifest.js",
			"css/styles.css",			
			"img/to1.png",
			"img/to2.png",
			"img/torta.png",
			"img/torta1.jpg",
			"img/torta2.jpg",
			"img/torta3.jpg",
			"img/torta4.jpg",
			"img/torta5.jpg",
			"img/torta6.jpg",
			"img/torta7.jpg",
			"img/torta8.jpg",
			"img/torta9.jpg",
			"img/torta10.jpg",
			"img/acept.png",
			"img/cart.png",
			"img/e96074826f24bff572e12999ebc7bb1f_400x400.png",
			"img/edit.png",
			"img/eliminar.png",			
			"img/estrellas.png",
		]);
	});
	const cacheInmutable = caches.open(CacheInmutable).then((cache) => {
		cache.addAll([
			"manifest.json",
            "css/bootstrap.min.css",
            "css/fontawesome.min.css",
            "js/bootstrap.bundle.min.js",
            "js/fontawesome.min.js",
            "js/jquery.min.js",
            "js/cookies.min.js",            
			"error.png",
			"404.html",
		]);
	});
	event.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
	console.log("Instalado");
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log("Evento activate");
	caches.keys().then((keys) => {
		keys.forEach((cache) => {
			if (cache.includes("estatico") && !cache.includes(CacheStatic)) {
				caches.delete(cache);
			}
		});
	});
});

self.addEventListener("fetch", (event) => {
	const respuesta = fetch(event.request)
		.then((res) => {
			if (res) {
				caches.match(event.request).then((cache) => {
					if (!cache) {
						caches.open(CacheDinamic).then((cache) => {
							cache.add(event.request.url);
						});
					}
				});
				return res;
			} else {
				return caches.match(event.request.url).then((newRes) => {
					if (newRes) {
						return newRes;
					} else {
						if (/\.(png|jpg)$/.test(event.request.url)) {
							return caches.match("error.png");
						}
						return caches.match("error.html");
					}
				});
			}
		})
		.catch((error) => {
			return caches.match(event.request.url).then((newRes) => {
				if (newRes) {
					return newRes;
				} else {
					if (/\.(png|jpg)$/.test(event.request.url)) {
						return caches.match("error.png");
					}
					return caches.match("error.html");
				}
			});
		});
	event.respondWith(respuesta);
});
