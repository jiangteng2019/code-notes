## husky配置

### 如何配置一个husky 实现git 提交前运行脚本

husky官网给出了如下的配置：

```sh
# 通过npm在开发环境下安装husky，
npm install husky --save-dev

# 设置npm package.json脚本,用于每次clone仓库后，运行npm install 后 执行 husky install 
npm pkg set scripts.prepare="husky install"

# 上面脚本设置好后，运行npm run prepare 实际上会执行 husky install， 命令会创建.husky/目录并指定该目录为git hooks所在的目录
npm run prepare

# 创建一个钩子，该命令会写入husky钩子，并在执行git commit 命令之前执行 npm test 脚本
npx husky add .husky/pre-commit "npm test"

# 将husky文件夹提交到暂存区。实现远程共享。
git add .husky/pre-commit
```