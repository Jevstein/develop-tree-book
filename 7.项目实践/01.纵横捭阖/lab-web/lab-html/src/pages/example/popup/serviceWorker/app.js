
// app.js - 主页面逻辑

const logContainer = document.getElementById('log-container');
const swStatusBadge = document.getElementById('sw-status-badge');
const permStatusBadge = document.getElementById('perm-status-badge');
const btnRegister = document.getElementById('btn-register-sw');
const btnRequestPerm = document.getElementById('btn-request-perm');
const btnSendNotif = document.getElementById('btn-send-notif');
const btnClearAll = document.getElementById('btn-clear-all');

let serviceWorkerRegistration = null;

// 日志工具
function log(message, type = 'info') {
    const div = document.createElement('div');
    const time = new Date().toLocaleTimeString();
    div.textContent = `[${time}] ${message}`;
    
    if (type === 'error') div.className = 'text-red-400';
    else if (type === 'success') div.className = 'text-blue-400';
    else if (type === 'warn') div.className = 'text-yellow-400';
    
    logContainer.appendChild(div);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// 更新 UI 状态
function updateStatus() {
    // SW 状态
    if (serviceWorkerRegistration) {
        swStatusBadge.textContent = '已激活';
        swStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800';
    } else {
        swStatusBadge.textContent = '未注册';
        swStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800';
    }

    // 权限状态
    const permission = Notification.permission;
    permStatusBadge.textContent = permission;
    if (permission === 'granted') {
        permStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800';
        btnSendNotif.disabled = false;
        btnSendNotif.classList.remove('opacity-50', 'cursor-not-allowed');
    } else if (permission === 'denied') {
        permStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800';
        btnSendNotif.disabled = true;
        btnSendNotif.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        permStatusBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800';
        btnSendNotif.disabled = true;
        btnSendNotif.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

// 1. 注册 Service Worker
async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        log('浏览器不支持 Service Worker', 'error');
        return;
    }

    try {
        log('正在注册 Service Worker...');
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

        serviceWorkerRegistration = registration;
        log('Service Worker 注册成功', 'success');
        
        // 监听更新
        registration.addEventListener('updatefound', () => {
            log('发现新的 Service Worker 版本');
        });

        updateStatus();
    } catch (error) {
        log(`注册失败: ${error.message}`, 'error');
    }
}

// 2. 请求通知权限
async function requestPermission() {
    if (!('Notification' in window)) {
        log('浏览器不支持通知 API', 'error');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        log(`权限状态: ${permission}`, permission === 'granted' ? 'success' : 'warn');
        updateStatus();
    } catch (error) {
        log(`权限请求出错: ${error.message}`, 'error');
    }
}

// 3. 发送通知 (通过 postMessage 给 SW)
function sendNotification() {
    if (!serviceWorkerRegistration) {
        log('Service Worker 未注册', 'error');
        return;
    }

    if (Notification.permission !== 'granted') {
        log('未获得通知权限', 'error');
        return;
    }

    const title = document.getElementById('notif-title').value || '通知标题';
    const body = document.getElementById('notif-body').value || '通知内容';
    const iconUrl = document.getElementById('notif-icon').value;
    const tag = document.getElementById('notif-tag').value || 'default-tag';

    const options = {
        body: body,
        icon: iconUrl || 'https://picsum.photos/100/100?random=1', // 默认随机图片
        badge: 'https://picsum.photos/50/50?random=2',
        tag: tag,
        renotify: true, // 如果 tag 相同，是否重新显示
        requireInteraction: false, // 是否要求用户交互后才消失
        data: {
            url: window.location.href // 点击后跳转的地址
        },
        actions: [
            { action: 'explore', title: '查看详情' },
            { action: 'close', title: '忽略' }
        ]
    };

    // 通过 postMessage 告诉 SW 显示通知
    // 注意：也可以直接在主线程使用 new Notification()，但那样不会经过 SW，且页面关闭后无法管理
    // 使用 SW 的 showNotification 可以确保通知是“持久”的，并且可以由 SW 统一管理
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            payload: {
                title: title,
                options: options
            }
        });
        log(`已发送通知请求: "${title}"`, 'success');
    } else {
        // 如果 SW 尚未控制页面（例如刚刷新），尝试直接使用 API 或等待
        log('Service Worker 尚未控制当前页面，尝试直接显示...', 'warn');
        //  fallback: 直接显示（非持久化，页面关闭即消失）
        try {
            const n = new Notification(title, options);
            n.onclick = () => {
                window.focus();
                n.close();
            };
        } catch (e) {
            log(`直接显示失败: ${e.message}`, 'error');
        }
    }
}

// 4. 清除所有通知
function clearAllNotifications() {
    if (!serviceWorkerRegistration) {
        log('Service Worker 未注册', 'error');
        return;
    }

    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'CLEAR_NOTIFICATIONS'
        });
        log('已发送清除所有通知请求', 'success');
    } else {
        log('Service Worker 尚未控制当前页面', 'warn');
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updateStatus();
    
    // 检查是否已有注册的 SW
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
                serviceWorkerRegistration = reg;
                log('发现已存在的 Service Worker', 'success');
                updateStatus();
            }
        });
    }
});

// 事件绑定
btnRegister.addEventListener('click', registerServiceWorker);
btnRequestPerm.addEventListener('click', requestPermission);
btnSendNotif.addEventListener('click', sendNotification);
btnClearAll.addEventListener('click', clearAllNotifications);

// 监听来自 SW 的消息（可选，用于双向通信）
navigator.serviceWorker.addEventListener('message', (event) => {
    log(`收到 SW 消息: ${JSON.stringify(event.data)}`);
});
