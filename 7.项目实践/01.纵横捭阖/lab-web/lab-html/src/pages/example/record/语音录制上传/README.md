
# 语音录制上传应用

## 功能特点

- 使用现代Web API实现浏览器内语音录制
- 实时音频可视化波形动画
- 录制时长计时器
- 录音预览播放控制
- MP3格式音频生成与上传
- 响应式设计，支持移动端使用
- 美观的UI界面与交互动效

## 技术实现

- 原生JavaScript + HTML5 MediaRecorder API
- RecordRTC库处理音频编码
- TailwindCSS实现响应式布局
- Font Awesome图标库
- Blob对象处理音频数据

## 使用说明

1. 点击"开始录制"按钮启动录音
2. 点击"停止录制"结束录音
3. 使用播放/停止按钮预览录音
4. 点击"上传MP3"将音频文件上传到服务器

## 浏览器兼容性

- Chrome 60+
- Firefox 52+
- Edge 79+
- Safari 14.1+

注意：需要HTTPS环境或localhost才能使用麦克风权限
