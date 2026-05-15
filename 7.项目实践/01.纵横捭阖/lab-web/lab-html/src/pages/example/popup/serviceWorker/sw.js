
// sw.js - Service Worker 逻辑

const CACHE_NAME = 'notification-demo-v1';

// 安装事件：缓存必要资源（可选）
self.addEventListener('install', (event) => {
    console.log('[SW] Installed');
    self.skipWaiting(); // 立即激活新的 SW
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
    console.log('[SW] Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // 立即接管页面
});

// 处理来自页面的消息（例如手动触发通知）
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, options } = event.data.payload;
        
        // 显示通知
        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } else if (event.data && event.data.type === 'CLEAR_NOTIFICATIONS') {
        // 清除所有通知
        event.waitUntil(
            self.registration.getNotifications().then((notifications) => {
                notifications.forEach(notification => notification.close());
            })
        );
    }
});

// 处理推送事件（Push API）
// 注意：这需要后端支持 VAPID 密钥和 Push Server，本示例主要演示 showNotification
self.addEventListener('push', (event) => {
    console.log('[SW] Push received');
    
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        data = { title: '新推送', body: '收到一条推送消息' };
    }

    const title = data.title || '新消息';
    const options = {
        body: data.body || '您有一条新消息',
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/badge-72x72.png',
        tag: data.tag || 'default-tag',
        data: data.url || '/', // 点击后跳转的 URL
        actions: [
            { action: 'explore', title: '查看', icon: '/checkmark.png' },
            { action: 'close', title: '关闭', icon: '/cancel.png' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 处理通知点击事件
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    
    // 关闭被点击的通知
    event.notification.close();

    // 处理动作
    if (event.action === 'close') {
        return;
    }

    // 默认动作：打开窗口或聚焦已有窗口
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // 检查是否已经有该 URL 的窗口打开
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // 如果没有，则打开新窗口
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// 处理通知关闭事件
self.addEventListener('notificationclose', (event) => {
    console.log('[SW] Notification closed', event.notification.tag);
});
