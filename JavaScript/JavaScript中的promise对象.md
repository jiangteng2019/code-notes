## JavaScript中的promise对象

除了正常使用promise对象，一些边界情况需要注意一下：

### 1. resolve或reject并不会终结 Promise 的参数函数的执行

```javascript
new Promise((resolve, reject) => {
    resolve(1)
    console.log(2)
}).then((r) => {
    console.log(r)
})
// 2
// 1
```

### 2. promise对象状态传递

resolve函数可以可以传入一个promise对象，此时当前的promise对象的状态由resolve函数接收的这个promise对象决定。

```javascript
const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p2.then((result) => console.log(result)).catch((error) => console.log(error))
// Error: fail
```

### 3. resolve 方法总是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。属于微任务。

```javascript
let promise = new Promise(function (resolve, reject) {
    console.log('Promise')
    resolve()
})

promise.then(function () {
    console.log('resolved.')
})

console.log('Hi!')

// Promise
// Hi!
// resolved
```

### 4. promise之所以可以链式调用，是因为then方法返回了另一个promise示例，不是当前new的这个promise实例。

### 5. then方法中的任何错误都会被后续的catch方法捕获：当然promise对象本身的错误也会被捕获

```javascript
Promise.resolve(3).then(res => {
    throw new Error('error')
}).catch(err => console.log(err));

// VM1448:3 Error: error
    at <anonymous>:2:11
```

### 6. Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。

```javascript
getJSON('/post/1.json')
    .then(function (post) {
        return getJSON(post.commentURL)
    })
    .then(function (comments) {
        // some code
    })
    .catch(function (error) {
        // 处理前面三个Promise产生的错误
    })
```

### 7. Promise 对象抛出的错误不会传递到外层代码

```javascript
new Promise((resolve,reject) => {
    z = x + u
})
console.log("still log")
VM5070:4 still log
// Promise 会吃掉错误
```

### 8. catch()方法返回的还是一个 Promise 对象，可以接着调用then()

```javascript
const someAsyncThing = function () {
    return new Promise(function (resolve, reject) {
        // 下面一行会报错，因为x没有声明
        resolve(x + 2)
    })
}

someAsyncThing()
    .catch(function (error) {
        console.log('oh no', error)
    })
    .then(function () {
        console.log('carry on')
    })
// oh no [ReferenceError: x is not defined]
// carry on
```

### 9. Promise.race 与 Promise.any 有什么区别？

`Promise.race` 和 `Promise.any` 都是 JavaScript 中 Promise API 的方法，它们用于处理多个 Promise 对象，但有一些关键的区别。

### Promise.race

`Promise.race` 接收一个包含多个 Promise 对象的可迭代对象（通常是数组），并返回一个新的 Promise。这个新的 Promise 将与第一个完成（settled）的 Promise 的状态相同，无论是成功（fulfilled）还是失败（rejected）。它只关注最先完成的 Promise。

```javascript
const promise1 = new Promise((resolve) => setTimeout(resolve, 100, 'One'))
const promise2 = new Promise((resolve, reject) =>
    setTimeout(reject, 200, 'Two')
)

Promise.race([promise1, promise2])
    .then((value) => {
        console.log(value) // 'One'，因为 promise1 先完成
    })
    .catch((reason) => {
        // 这里不会执行，因为 race 只关心第一个完成的 Promise
    })
```

### Promise.any

`Promise.any` 也接收一个包含多个 Promise 对象的可迭代对象，并返回一个新的 Promise。但与`Promise.race` 不同的是，`Promise.any` 只要有一个 Promise 被成功解决（fulfilled），就会将新的 Promise 状态设置为成功。如果所有 Promise 都被拒绝（rejected），则将新的 Promise 状态设置为拒绝，并返回一个聚合了所有拒绝原因的 AggregateError 对象。

```javascript
const promise1 = new Promise((resolve) => setTimeout(resolve, 100, 'One'))
const promise2 = new Promise((resolve, reject) =>
    setTimeout(reject, 200, 'Two')
)

Promise.any([promise1, promise2])
    .then((value) => {
        console.log(value) // 'One'，因为 promise1 先完成
    })
    .catch((reason) => {
        // 这里不会执行，因为 any 只关心第一个成功的 Promise
    })
```

总结：

-   `Promise.race` 只关心第一个完成的 Promise，不论是成功还是失败。
-   `Promise.any` 只关心第一个成功的 Promise，如果所有 Promise 都失败，则会返回一个包含所有拒绝原因的 AggregateError 对象。
