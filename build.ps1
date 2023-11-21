# 创建 dist 文件夹（如果不存在）
New-Item -ItemType Directory -Path ".\dist" -ErrorAction SilentlyContinue

# 获取项目文件夹下所有的 .md 文件
$mdFiles = Get-ChildItem -Path ".\" -Exclude "node_modules", "dist" -Filter "*.md" -Recurse

# 遍历每个 .md 文件并进行转换
foreach ($file in $mdFiles) {
    # 构建输出的 HTML 文件路径，保持原有的文件夹结构
    $outputFolder = ".\dist\" + $file.DirectoryName.Substring(2)
   
    $outputFile = Join-Path -Path $outputFolder -ChildPath $file.Name.Replace(".md", ".html")

    # 创建输出文件夹（如果不存在）
    New-Item -ItemType Directory -Path $outputFolder -ErrorAction SilentlyContinue

    # 调用 Node.js 脚本 build.js，并传递文件路径作为参数
    $renderedHtml = & node "build.js" $file.FullName

    # 将 markdown-it 渲染函数的返回值保存为 HTML 文件
    Set-Content -Path $outputFile -Value $renderedHtml
}

Write-Host "build success"