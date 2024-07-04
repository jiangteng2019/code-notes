## chrome全屏api使用

```js
function requestFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        // 使用vue3开发的ref对象调用requestFullscreen方法
        countdownContainer.value.requestFullscreen()
    }
}
```
