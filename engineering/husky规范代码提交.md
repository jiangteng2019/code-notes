## husky规范代码提交

团队协作中规范的提交信息是重要的，规范的代码提交可以实现一键生成软件版本的信息。可以利用husky+commitlint做到这一点。

安装工具：
```sh
# @commitlint/config-conventional是预置配置库
# @commitlint/cli 使我们需要用到的命令行工具
cnpm install --save-dev @commitlint/config-conventional @commitlint/cli
```
安装husky
```sh
# husky 是一个git hooks 增加工具,使用git自带的hooks不方便操作,利用husky可以方便的配置git hooks
cnpm install husky --save-dev 
```

开启husky
```sh
npx husky install
```

持久化
```sh
# 为了让团队中的伙伴也拥响应的功能，需要在安装包之后自动安装调用husky install
npm pkg set scripts.prepare="husky install"
```

添加钩子
```sh
# 添加commit-msg 钩子，用于在提交之前使用commitlint检查提交信息
npx husky add .husky/commit-msg 'npx commitlint --edit $1'
```

添加预设配置
```js
//项目根目录下新建commitlint.config.js,键入：
module.exports = { extends: ['@commitlint/config-conventional'] }
```
现在可以检查提交信息了
```sh
git commit -m 'feat: 增加功能'
git commit -m 'bug: 修复bug'
```

如果报错：
```
commitlint.config.js is treated as an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which declares all .js files in that package scope as ES modules.  Instead either rename commitlint.config.js to end in .cjs, change the requiring code to use dynamic import() which is available in all CommonJS modules, or change "type": "module" to "type": "commonjs" in D:\project\data-visualize\package.json to treat all .js files as CommonJS (using .mjs for all ES modules instead).
```

需要将:

    commitlint.config.js 改为 commitlint.config.cjs

常用的类型：
type  | 描述
-- | --
feat | 新增功能 
fix |	bug 修复
style |	不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
refactor |	重构代码(既没有新增功能，也没有修复 bug)
docs |	文档更新
test |	增加测试
chore	| 构建过程或辅助工具的变动

