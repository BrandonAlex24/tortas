const CacheEstatico = 'Estatico-1';
const CacheInmutable = 'Inmutable-1';
const CacheDinamico = 'Dinamico-1';

self.addEventListener('install', e=>{  

    const cacheProm = caches.open(CacheEstatico)
         .then(cache=>{
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
			"/tortas/img/estrellas.png"
             ]);
        });
        //cache inmutable no se modifica 
            const cacheInm= caches.open(CacheInmutable)
            .then(cache=>
                cache.add([
					"/tortas/manifest.json",
            "/tortas/css/bootstrap.min.css",
            "/tortas/css/fontawesome.min.css",
            "/tortas/js/bootstrap.bundle.min.js",
            "/tortas/js/fontawesome.min.js",
            "/tortas/js/jquery.min.js",
            "/tortas/js/cookies.min.js",            
			"/tortas/img/error.png",
			"/tortas/error.html",
				])
					);

         e.waitUntil(Promise.all([cacheProm,cacheInm]));

})

self.addEventListener('activate', e => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(!cache == CacheEstatico) {
                    console.log('Cache viejo eliminado' +cache);
                    return await caches.delete(cache);
                }
            })
        }) ()
    ) 
})

self.addEventListener('fetch', e=>{

    //cache with network fallback
    const respuesta = caches.match(e.request) //buscamos un recurso
    .then(res=>{
        if(res) return res;
        console.log('No existe el recurso en cache ->', e.request.url);

        return fetch(e.request).then (newResp=>{ //no existe el archivo vamos a internet

            caches.open(CacheDinamico)
            .then(cache=>{
                cache.put(e.request,newResp)
            })

            return newResp.clone();
        }).catch(err=>{
            return caches.match('/tortas/img/error.png'); //error-404/index.html | img/imagen sin conexion.jpg
        });
    });
    e.respondWith(respuesta);
})

self.addEventListener('fetch', e=>{    
    const respuesta = new Promise((resolve,reject)=>{
        let rechazada = false;
        const falloUno=()=>{
            if(rechazada){
                if(/\.(html)$/.test(e.request.url)){ 
                    resolve(caches.match('/tortas/error.html'));
                }
                else{
                    reject('7tortas/img/error.png'); 
                }
                            }
            else{
                rechazada = true; 
            }
        }


});
    e.respondWith(respuesta);
})


self.addEventListener('fetch', e=>{    
    const respuesta = new Promise((resolve,reject)=>{
        let rechazada = false;
        const falloUno=()=>{
            if(rechazada){ 
                if(/\.(jpg)$/.test(e.request.url)){ 
                    resolve(caches.match('/tortas/img/error.png'));
                }
                else{
                    reject('/tortas/img/error.png');
                }
                            }
            else{
                rechazada = true; 
            }
        }


});
    e.respondWith(respuesta);
})


