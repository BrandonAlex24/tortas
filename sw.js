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
			"/tortas/js/pedidos.js",
			"/tortas/",
			"/tortas/index.html",
			"/tortas/css/style.css",
			"/tortas/js/scripts.js",
			"/tortas/sw.js",
			"/tortas/manifest.js",
			"/tortas/css/styles.css",			
			"/tortas/img/to1.png",
			"/tortas/img/to2.png",
			"/tortas/img/torta.png",
			"/tortas/img/torta1.jpg",
			"/tortas/img/torta2.jpg",
			"/tortas/img/torta3.jpg",
			"/tortas/img/torta4.jpg",
			"/tortas/img/torta5.jpg",
			"/tortas/img/torta6.jpg",
			"/tortas/img/torta7.jpg",
			"/tortas/img/torta8.jpg",
			"/tortas/img/torta9.jpg",
			"/tortas/img/torta10.jpg",
			"/tortas/img/acept.png",
			"/tortas/img/cart.png",
			"/tortas/img/e96074826f24bff572e12999ebc7bb1f_400x400.png",
			"/tortas/img/edit.png",
			"/tortas/img/eliminar.png",			
			"/tortas/img/estrellas.png",
		]);
	});
	//cache inmutable no se modifica
	const cacheInm = caches.open(CacheInmutable).then((cache) => {
		cache.addAll([
			"/tortas/manifest.json",
            "/tortas/css/bootstrap.min.css",
            "/tortas/css/fontawesome.min.css",
            "/tortas/js/bootstrap.bundle.min.js",
            "/tortas/js/fontawesome.min.js",
            "/tortas/js/jquery.min.js",
            "/tortas/js/cookies.min.js",            
			"/tortas/error.png",
			"/tortas/404.html",
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
								return caches.match("/tortas/error.png");
							}
							return caches.match("/tortas/404.html");
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
							return caches.match("/tortas/error.png");
						}
						return caches.match("/tortas/404.html");
					}
					return newRes;
				});
		});
	e.respondWith(respuesta);
});