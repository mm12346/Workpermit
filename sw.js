// sw.js - Service Worker

const CACHE_NAME = 'work-permit-cache-v1';
// รายการไฟล์ที่จำเป็นสำหรับ App Shell ที่จะถูกแคชไว้
const urlsToCache = [
  './', // แคชหน้าแรก (index.html)
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js',
  'https://unpkg.com/html5-qrcode',
  'https://placehold.co/192x192/166534/FFFFFF?text=WP',
  'https://placehold.co/512x512/166534/FFFFFF?text=WP'
];

// Event: install
// เกิดขึ้นเมื่อ Service Worker ถูกติดตั้งเป็นครั้งแรก
self.addEventListener('install', event => {
  // รอจนกว่าการแคชไฟล์ทั้งหมดจะเสร็จสิ้น
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: fetch
// เกิดขึ้นทุกครั้งที่มีการร้องขอ (request) ไปยังเซิร์ฟเวอร์ เช่น การโหลดรูปภาพ, script, หรือหน้าเว็บ
self.addEventListener('fetch', event => {
  event.respondWith(
    // ตรวจสอบว่ามีข้อมูลที่ร้องขออยู่ในแคชหรือไม่
    caches.match(event.request)
      .then(response => {
        // ถ้ามีข้อมูลในแคช, ส่งข้อมูลจากแคชกลับไป
        if (response) {
          return response;
        }
        // ถ้าไม่มี, ทำการร้องขอไปยังเซิร์ฟเวอร์ตามปกติ
        return fetch(event.request);
      })
  );
});

// Event: activate
// เกิดขึ้นเมื่อ Service Worker เริ่มทำงาน และใช้สำหรับจัดการแคชเก่า
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // ลบแคชเวอร์ชันเก่าที่ไม่ต้องการแล้ว
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
