# 获取当前日期时间并格式化
$dateTime = Get-Date -Format "yyyyMMdd_HHmmss"
$readmeFileName = "README_$dateTime.md"

# 获取当前脚本所在的目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

# 创建README文件
$readmeFilePath = Join-Path -Path $scriptPath -ChildPath $readmeFileName
$null = New-Item -Path $readmeFilePath -ItemType File

# 公共bufne
$common = "# code-notes`nA small step may lead to a thousand miles`n"
Add-Content -Path $readmeFilePath -Value $common -Encoding UTF8

# 添加导航部分
$navigationContent = "### Categories`n"
Get-ChildItem -Path $scriptPath -Directory | Sort-Object Name | ForEach-Object {
    $folderName = $_.Name
    $anchorName = $folderName -replace ' ', '' # 移除空格用于锚点
    $displayedName = $folderName.Substring(0,1).ToUpper() + $folderName.Substring(1) # 首字母大写
    $navigationContent += "* [$displayedName](#$anchorName)`n"
}
Add-Content -Path $readmeFilePath -Value $navigationContent -Encoding UTF8

# 为每个子文件夹添加详细链接
Get-ChildItem -Path $scriptPath -Directory | Sort-Object Name | ForEach-Object {
    $folderName = $_.Name
    $displayedName = $folderName.Substring(0,1).ToUpper() + $folderName.Substring(1) # 首字母大写
    $markdownContent = "### $displayedName`n"

    # 遍历文件夹内的每个Markdown文件，并按文件名排序
    Get-ChildItem -Path $_.FullName -File -Filter *.md | Sort-Object Name | ForEach-Object {
        $fileNameWithoutExtension = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $markdownLink = "* [$fileNameWithoutExtension]($folderName/$($_.Name))`n"
        $markdownContent += $markdownLink
    }

    # 将Markdown内容追加到README文件
    Add-Content -Path $readmeFilePath -Value $markdownContent -Encoding UTF8
}

Write-Host "Markdown navigation created in $readmeFileName"