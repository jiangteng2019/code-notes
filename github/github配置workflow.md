## github配置workflow

如何实现仓库自动执行代码，将变化的内容提交到仓库，实现自我维护。可以通过直接在 github 配置workflow-自定义workflow实现。
```yml
# This is a basic workflow to help you get started with Actions
name: CI

# Controls when the workflow will run at UTC time
on:
  schedule:
    - cron: "0 8 * * *"
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: windows-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      # Runs a single command using the runners shell
      - name: Run script
        run: npm run request

      - name: Configure Git
        run: |
          git config --global user.email "1348746268@qq.com"
          git config --global user.name "jiangteng"

      # Runs a set of commands using the runners shell
      - name: Commit
        shell: bash
        run: |
          if [[ -n $(git status -s) ]]; then
            git add .
            git commit -m "Auto commit"
          fi
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ github.ref }}

```

yml文件的配置如上：

**需要注意的是**：
1. 配置 secrets.GITHUB_TOKEN ：

> 点击用户设置：Setting - Developer setting - Personal access token - Token(classic) - Generate new token(classic) - 勾选 repo、workflow、 admin:repo_hook。

2. 如果仓库的配置没有指定secrets.GITHUB_TOKEN的默认配置，workflow仍然没有推送代码的权限。
> 需要设置:
仓库的Setting - Actions - General  - Workflow permissions - Read and write permissions -Save
