## npm脚本执行顺序

### 这是package.json 的脚本配置：

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "generate": "powershell -ExecutionPolicy Bypass -File generate.ps1 && git add .",
    "build": "powershell -ExecutionPolicy Bypass -File build.ps1",
    "prepare": "husky install"
  },
```

### 并行执行:

顾名思义，脚本是一起执行的:

```sh
 "generate": "powershell -ExecutionPolicy Bypass -File generate.ps1 & git add .",
```

这种的显然在代码逻辑中是不合适的。

### 继发执行：

前一个任务成功，才执行下一个任务

```sh
 "generate": "powershell -ExecutionPolicy Bypass -File generate.ps1 && git add .",
```

这两个符号是 Bash 的功能，在powershell也可以用。

我们配置一下脚本:

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "testNode": "node ./testNode.js",
    "testShell": "powershell -File testShell.ps1",
    "testAll1": "npm run testNode & npm run testShell",
    "testAll2": "npm run testNode && npm run testShell"
  },
```

其中testNode.js:

```js
console.log('node')
throw new Error()
```

testShell:

```
Write-Host "shell"
```

然后运行测试：

testAll1 脚本在testNode脚本发生错误后继续执行testShell脚本。

testAll2 脚本在testNode脚本发生错误后不再执行testShell脚本。
