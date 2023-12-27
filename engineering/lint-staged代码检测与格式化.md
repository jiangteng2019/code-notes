## lint-staged代码检测与格式化

因为远程的git hooks 不好用，所以引入了husky进行方便的添加钩子调用。很显然我们引入这一类的工具在于使用前端工程项目的自动化。

加入我们相对提交的代码实现自动化的步骤如下：
1. 使用eslint对代码进行格式化检查；
1. 使用prettier对代码进行风格统一；
1. 使用commitlint 对提交信息进行规范化；

很自然我们需要使用husky 的钩子实现上述功能；我们添加三个钩子：
```sh
npx husky add .husky/commit-msg 'npx commitlint --edit $1'

npx husky add .husky/pre-commit "npm run lint"

npx husky add .husky/pre-commit "npm run format:add"
```

我们发现： commit-msg这个钩子会在pre-commit之后执行，所以上述的钩子执行顺序如下：

1. 先执行eslint 进行代码检测；
1. 再执行prettier 进行代码风格统一（会写入文件）
1. 最后执行git commit 的内容，如果失败会导致提交失败。

以上执行顺序会有一定的问题，在于npm run format，也就是执行代码风格统一这一步，因为会写入文件，会导致工作区污染。也就是说，当你提交代码的时候，你会发现很多文件被修改了，但是没有提交成功，这一步会令人困惑。

实际上我们希望的是，如果提交失败了，那就失败了，不要动工作区文件的内容，也就是说：

**当commitlint脚本运行失败的时候 prettier需要对脚本进行回滚**
**当commitlint脚本运行成功的时候 需要对工作区的文件进行提交**

这也是为什么会有一个npm run format:add 命令。显然增加了工程化的复杂程度，现在又lint-staged 这个工具，只对暂存区的文件进行检查与格式化。大大降低的配置复杂性。

### 配置lint-staged

```sh
# 安装
npm install --save-dev lint-staged 

# 添加钩子
npx husky add .husky/pre-commit "npx lint-staged"

```

```js
// 配置lint-staged 放在package.json中

"lint-staged": {
    "*.{js,ts,vue,tsx}": [
      "eslint",
      "prettier --write"
    ]
}
```
这样提交的时候 会执行husky钩子，进而执行lint-staged 脚本，lint-staged读取对应的配置，对暂存区的文件调用对应的eslint 和 prettier 记性代码检查和格式化。
