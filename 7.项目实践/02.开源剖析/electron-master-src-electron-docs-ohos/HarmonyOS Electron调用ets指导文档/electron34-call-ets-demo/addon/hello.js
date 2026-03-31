const addon = require('bindings')('electron-addon');

console.log(addon.hello()); // 'world'
