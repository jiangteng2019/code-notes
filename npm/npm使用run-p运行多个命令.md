## npm使用run-p运行多个命令

使用ts开发的vite项目中，构建脚本是这样的:

```sh
"build": "run-p type-check \"build-only {@}\" --",
```

### 脚本解释：

    run-p：

这是一个来自 npm-run-all 包的命令，用于并行执行多个 npm 脚本。npm-run-all 是一个流行的 npm 工具，用于在单个命令中执行多个 npm 脚本。
run-p 是 npm-run-all 的一个命令，它用于并行执行脚本（run-p 中的 p 代表 parallel，即并行）。

    type-check：

type-check 用于执行类型检查，如 TypeScript 的类型检查。
在这个上下文中，type-check 是运行 TypeScript 编译器（或其他类型检查工具）以检查代码中的类型错误。

    "build-only {@}\"：

build-only 是一个自定义脚本，{@} 是 npm-run-all 的一个特殊语法，用于将所有额外的命令行参数传递给每个脚本。这意味着在 run-p 后面跟随的任何参数都将传递给 build-only 脚本。
双引号和反斜杠（\"）是为了确保在 shell 中正确处理参数。

    --：

这是一个常见的命令行约定，用于指示命令行参数的结束。在这个上下文中，它告诉 run-p 不要处理后面的任何参数，而是将它们原样传递给脚本。

这个脚本并行执行 type-check 和 build-only 这两个脚本，其中 build-only 脚本将接收任何在 run-p 命令之后传递的额外参数。这在构建过程中可以用于同时进行类型检查和构建操作，同时将特定的参数传递给构建脚本。

### 为什么不用 && 串联执行脚本？

官方是这样解释的：

1. 简化命令：

> 使用 npm-run-all 可以通过类似 glob 的模式简化命令。对于需要运行多个相似命令的情况，这比分别使用 && 连接每个命令更为简洁。
> 例如，原本需要逐个写出 npm run clean && npm run build:css && npm run build:js && npm run build:html，现在可以简化为 npm-run-all clean build:\*。

2. 跨平台兼容性：

> 在某些情况下，我们可能使用 & 来并行运行多个命令，但 Windows 的 cmd.exe（npm 脚本默认使用的环境）不支持 &。
> 考虑到大约一半的 Node.js 用户在 Windows 上工作，使用 & 可能会阻碍一些用户的贡献。
> 相比之下，npm-run-all --parallel（与 run-p 功能相同）在 Windows 上也能很好地工作。

3. 综上所述
    > run-p（或 npm-run-all --parallel）相比于使用 && 的优势在于其能够提供更简洁的命令格式和更好的跨平台兼容性，特别是在需要并行执行多个脚本的情况下。这使得 run-p 成为在复杂项目中管理 npm 脚本的一个更有效和通用的选择。
