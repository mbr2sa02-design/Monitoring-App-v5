/* RC Monitoring service worker — app shell cached for offline start; data/API calls always go to the network */
var V='rc-monitor-v3', SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){});}));}).catch(function(){}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V;}).map(function(x){return caches.delete(x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET') return;
  var u=new URL(r.url);
  if(u.origin===location.origin){            // own files: network first, fall back to cache (so updates arrive when online)
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});return res;}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./index.html');});}));
  } else if(/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(u.host)){   // fonts & libraries: cache after first use
    e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){var cp=res.clone();caches.open(V).then(function(c){c.put(r,cp);});return res;});}));
  }
});
self.addEventListener('push',function(e){var d={};try{d=e.data.json();}catch(x){d={title:'RC Monitor',body:e.data?e.data.text():''};}
  e.waitUntil(self.registration.showNotification(d.title||'RC Monitor',{body:d.body||'',icon:'icon-192.png'}));});
self.addEventListener('notificationclick',function(e){e.notification.close();e.waitUntil(clients.openWindow('./'));});
