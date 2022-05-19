const CacheEstatico = "st-1";
const CacheInmutable = "in-1";
const CacheDinamico = "din-1";

// function LimpiarCache(cacheName, numeroItems) {
// 	caches.open(cacheName).then((cache) => {
// 		return cache.keys().then((keys) => {
// 			//console.log(keys);
// 			if (keys.length > numeroItems)
// 				cache.delete(keys[0]).then(LimpiarCache(cacheName, numeroItems)); //Recursividad la funcion se llama a si misma
// 		});
// 	});
// }

self.addEventListener("install", (e) => {
	const cacheProm = caches.open(CacheEstatico).then((cache) => {
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
	//cache inmutable no se modifica
	const cacheInm = caches.open(CacheInmutable).then((cache) => {
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
	e.waitUntil(Promise.all([cacheProm, cacheInm]));
	self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
	//Network with cache fallback
	const respuesta = fetch(e.request)
		.then((res) => {
			//la app solicita un recurso de internet
			if (!res)
				//si falla (false or null)
				return caches
					.match(e.request) //lo busca y lo regresa al cache
					.then((newRes) => {
						if (!newRes) {
							if (/\.(png|jpg|webp|jfif)$/.test(e.request.url)) {
								return caches.match("error.png");
							}
							return caches.match("404.html");
						}
						return newRes;
					});

			caches.match(e.request).then((cacheRes) => {
				if (!cacheRes) {
					caches.open(CacheDinamico).then((cache) => {
						//abre el cache dinamico
						cache.add(e.request.url); //mete el recurso que no existia en el cache
						LimpiarCache(CacheDinamico, 100); // limpia hasta 100 elementos de cache
					});
				}
			});
			return res; //devuelve la respuesta
		})
		.catch((err) => {
			// en caso de que encuetre algun error devuleve el archivo de cache
			return caches
				.match(e.request) //lo busca y lo regresa al cache
				.then((newRes) => {
					if (!newRes) {
						if (/\.(png|jpg|webp|jfif)$/.test(e.request.url)) {
							return caches.match("error.png");
						}
						return caches.match("404.html");
					}
					return newRes;
				});
		});
	e.respondWith(respuesta);
});