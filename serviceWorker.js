const staticMetSite = "MET-app"
const assets = [
  "/login.html",
  "/static/styles.css",
  "/static/app.js",
  "/static/icons/met-logo.png",
  "/static/icons/met-gray-logo.png",
  "/static/icons/met-icon-36.png",
  "/static/icons/met-icon-36-maskable.png",
  "/static/icons/met-icon-48.png",
  "/static/icons/met-icon-48-maskable.png",
  "/static/icons/met-icon-72.png",
  "/static/icons/met-icon-72-maskable.png",
  "/static/icons/met-icon-96.png",
  "/static/icons/met-icon-96-maskable.png",
  "/static/icons/met-icon-120.png",
  "/static/icons/met-icon-128.png",
  "/static/icons/met-icon-144.png",
  "/static/icons/met-icon-144-maskable.png",
  "/static/icons/met-icon-152.png",
  "/static/icons/met-icon-180.png",
  "/static/icons/met-icon-192.png",
  "/static/icons/met-icon-192-maskable.png",
  "/static/icons/met-icon-384.png",
  "/static/icons/met-icon-512.png",
  "/static/icons/met-icon-512-maskable.png"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticMetSite).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
})