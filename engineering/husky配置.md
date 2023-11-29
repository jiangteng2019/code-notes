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

需要注意的是： 之前的husky版本配置完全不同。示例使用的是husky 8.x 版本的配置示例。


### 示例:
该项目使用markdown文件作为记录。但每次需要手动更新README.md文件是在太麻烦，于是使用了一个powershell脚本，自动根据文件夹内的文章内容生成对应的readme内容，并配置了npm执行脚本。每次提交前需要手动执行该npm脚本，容易忘记。所以配置husky 自动在每次提交之前执行该npm 脚本。步骤如下:

```sh
#写好并测试完成自动生成文件的powershell脚本,并配置npm 脚本用于执行：
"generate": "powershell -ExecutionPolicy Bypass -File generate.ps1 && git add .",

# 安装husky
npm install husky --save-dev

# 设置npm package.json脚本,用于每次clone仓库后运行npm install 后执行 husky install 
npm pkg set scripts.prepare="husky install"

# 上面脚本设置好后，运行npm run prepare 实际上会执行 husky install， 命令会创建.husky/目录并指定该目录为git hooks所在的目录,实际上就是初始化husky
npm run prepare

# 创建一个钩子，该命令会写入husky钩子，并在执行git commit 命令之前执行 npm test 脚本
npx husky add .husky/pre-commit "npm run generate"

# 由于每次执行npm run generate 命令后生成的文件不在本次的提交记录中，所以生成后还需要使用git add 命令。已经在上面的 generate 添加了管道运行 && git add .
```

        npm pkg set

npm pkg set是npm命令的一部分，用于设置package.json文件中的配置。

        scripts.prepare

package.json文件中的一个特殊字段，用于定义在安装包后要运行的脚本。在这种情况下，我们将scripts.prepare设置为husky install。

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "generate": "powershell -ExecutionPolicy Bypass -File generate.ps1 && git add .",
    "build": "powershell -ExecutionPolicy Bypass -File build.ps1",
    "prepare": "husky install"
  },
```