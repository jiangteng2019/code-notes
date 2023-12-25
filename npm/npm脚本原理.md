## npm脚本原理

每执行 npm run ..  就会新建一个shell，并且会将 node_modules/.bin 文件夹添加到环境变量。这就意味着bin目录下的可执行脚本都可以运行在当前的命令行上下文中，可以直接使用命令，而不需要加入路径。例如：
```json
"scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "test:unit": "vitest",
    "test:e2e": "start-server-and-test preview http://localhost:4173 'cypress run --e2e'",
    "test:e2e:dev": "start-server-and-test 'vite dev --port 4173' http://localhost:4173 'cypress open --e2e'",
    "build-only": "vite build",
    "type-check": "vue-tsc --build --force",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write src/"
  },
```
现在可以直接使用

    npm run test:unit

而不需要使用:

    .\node_modules\.bin\vitest

**npm能否运行的脚本不一定是node脚本，可以使任意脚本**

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "testNode": "node ./testNode.js",
    "testShell": "powershell -File testShell.ps1"
  },
```
```js
// testNode.js
console.log("node");
```
```sh
# testShell.ps1
Write-Host "shell"
```

