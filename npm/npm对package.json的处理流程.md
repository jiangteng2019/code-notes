## npm对package.json的处理流程

当您通过 npm 或 yarn 安装 Husky 或任何其他 Node.js 包时，包管理器会自动处理该包的安装过程，包括将可执行文件放置在 node_modules/.bin 目录下。这是 Node.js 包管理器处理依赖项安装的标准部分。以下是详细过程：

安装过程

1. 下载包：当您运行 npm install husky（或使用 yarn），包管理器会从 npm 注册表下载 Husky 包。

1. 解析 package.json：包管理器会读取 Husky 的 package.json 文件，这个文件包含了包的元数据，包括依赖项、版本信息、脚本命令以及可执行文件的定义。

1. 安装依赖：如果 Husky 有任何依赖项，包管理器也会下载并安装这些依赖。

1. 链接可执行文件：

        在 package.json 中，包可以指定一个或多个可执行文件。这是通过 bin 字段实现的，其中定义了命令名和对应的本地文件路径。

        对于 Husky，它的 package.json 中的 bin 字段指定了可执行文件的路径。例如，它可能会有类似 "husky": "./bin/husky" 的定义。

        包管理器会读取这个定义，并在 node_modules/.bin 目录下创建一个指向 Husky 实际可执行文件的符号链接（在 Windows 上是一个封装脚本）。

1. 使用可执行文件

    当您在 npm 脚本中引用 Husky 时，npm 会自动查找 node_modules/.bin 中的 Husky 可执行文件。这使得您可以在项目的 npm 脚本中直接使用 husky 命令，而无需提供完整的路径。


通过这种方式，Node.js 包管理器（npm 或 yarn）使得在项目级别使用本地安装的包变得非常容易，同时避免了全局安装的需要，这有助于确保项目的依赖项的版本控制和隔离。

### 示例安装husky：

```json
// package.json文件
{
  "name": "husky",
  "version": "8.0.3",
  "description": "Modern native Git hooks made easy",
  "keywords": [
    "git",
    "hooks",
    "pre-commit"
  ],
  "homepage": "https://typicode.github.io/husky",
  "repository": "typicode/husky",
  "funding": "https://github.com/sponsors/typicode",
  "license": "MIT",
  "author": "Typicode <typicode@gmail.com>",
  "bin": "lib/bin.js",
  "main": "lib/index.js",
  "files": [
    "lib",
    "husky.sh"
  ],
  "scripts": {
    "build": "tsc",
    "test": "sh test/all.sh",
    "lint": "eslint src --ext .ts",
    "serve": "docsify serve docs",
    "prepare": "npm run build && node lib/bin install"
  },
  "devDependencies": {
    "@commitlint/cli": "^17.3.0",
    "@commitlint/config-conventional": "^17.3.0",
    "@tsconfig/node14": "^1.0.3",
    "@types/node": "^18.11.18",
    "@typicode/eslint-config": "^1.1.0",
    "docsify-cli": "^4.4.4",
    "typescript": "^4.9.4"
  },
  "engines": {
    "node": ">=14"
  }
}

```

bin可执行脚本:
```json
"bin": "lib/bin.js",
```

npm会在.node_modules先创建该脚本的符号链接，在Windows下为是一个封装脚本：
```ps1
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "$basedir/node$exe"  "$basedir/../husky/lib/bin.js" $args
  } else {
    & "$basedir/node$exe"  "$basedir/../husky/lib/bin.js" $args
  }
  $ret=$LASTEXITCODE
} else {
  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | & "node$exe"  "$basedir/../husky/lib/bin.js" $args
  } else {
    & "node$exe"  "$basedir/../husky/lib/bin.js" $args
  }
  $ret=$LASTEXITCODE
}
exit $ret

```

- 可以看到就是该脚本的执行就是调用了 husky 下的可执行文件；

- node_modules文件夹下 有cmd、ps1、和bash脚本，分别供当前的命令行运行的环境调用；

- 封装的脚本会使用 node 环境调用对应包下面的可执行文件；

这才是实际的脚本内容，用于解析命令行参数执行对应的逻辑。
```javascript
#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const p = require("path");
const h = require("./");
function help(code) {
    console.log(`Usage:
  husky install [dir] (default: .husky)
  husky uninstall
  husky set|add <file> [cmd]`);
    process.exit(code);
}
const [, , cmd, ...args] = process.argv;
const ln = args.length;
const [x, y] = args;
const hook = (fn) => () => !ln || ln > 2 ? help(2) : fn(x, y);
const cmds = {
    install: () => (ln > 1 ? help(2) : h.install(x)),
    uninstall: h.uninstall,
    set: hook(h.set),
    add: hook(h.add),
    ['-v']: () => console.log(require(p.join(__dirname, '../package.json')).version),
};
try {
    cmds[cmd] ? cmds[cmd]() : help(0);
}
catch (e) {
    console.error(e instanceof Error ? `husky - ${e.message}` : e);
    process.exit(1);
}

```

执行npm run "xxxx" 脚本时，npm会将.node_modules/.bin 添加到环境变量，因此可以直接执行，无需加入路径。


