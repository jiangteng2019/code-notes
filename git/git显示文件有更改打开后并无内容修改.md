## git显示文件有更改打开后并无内容修改

使用 npm run format命令使用 prettier 格式化代码，发现vscode源码管理器提示用文件变动，但点开文件，发现内容无任何变动。
```sh
git diff

warning: LF will be replaced by CRLF in src/App.vue.
The file will have its original line endings in your working directory
warning: LF will be replaced by CRLF in src/views/launch-countdown/CountdownItem.vue.
The file will have its original line endings in your working directory
```

实际上这是因为不同操作系统之间的换行符可能不同（例如，Windows 使用 CRLF，而 Linux 和 macOS 使用 LF）。代码格式化工具可能会统一换行符的风格，导致文件被标记为已更改，即使在文本编辑器中看不出差异。

通常还有一下几种情况文件确实发生了变化，但是文本内容并没有变化：


    1. 空格和缩进更改：npm run format 通常执行代码格式化任务，这可能会改变文件中的空格、缩进等，但这些更改可能在 VSCode 中不明显。

    2. 换行符更改：不同操作系统之间的换行符可能不同（例如，Windows 使用 CRLF，而 Linux 和 macOS 使用 LF）。代码格式化工具可能会统一换行符的风格，导致文件被标记为已更改，即使在文本编辑器中看不出差异。

    3. 字符编码更改：有时文件的字符编码（如 UTF-8、ASCII 等）可能被更改，这种更改在文本编辑器中通常是不可见的。

    4. 文件权限更改：在某些情况下，文件的权限（如可读、可写权限）可能被更改，这也会被 Git 检测到并标记为更改。

    5. 末尾空白的更改：格式化工具可能会添加或移除行尾的空白字符（空格或制表符），这些在编辑器中可能不明显。


