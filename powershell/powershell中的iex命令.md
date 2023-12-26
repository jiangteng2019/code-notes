## powershell中的iex命令
在PowerShell中,iex代表Invoke-Expression,它用于运行和执行指定的PowerShell表达式或命令。

iex的主要作用包括:

1. 执行PowerShell代码字符串:可以将代码字符串传递给iex,它会把字符串作为PowerShell代码执行。

1. 加载代码模块:使用iex导入.ps1脚本文件,加载其中的命令和函数。

1. 实例化对象:可以用iex实例化.NET对象。

1. 调用方法:可以通过iex调用对象的方法。

1. 运行命令输出:可以将命令输出通过管道传给iex,从而执行命令的结果。

基本语法:
```sh
iex <Command>
iex <ScriptBlock> 
iex <String>
```
示例:

```powershell
# 执行代码字符串
iex 'Get-Process'

# 加载模块
iex ./mymodule.ps1

# 实例化对象
iex [System.Io.File]::OpenText("file.txt")

# 调用方法
iex $object.SomeMethod() 

# 运行命令输出
ipconfig | iex
```
需要注意的是,iex会无条件执行接收到的任何代码和命令,这存在安全风险。如果输入来源不可信,可能会导致代码注入或未经授权执行恶意操作。

所以在使用iex时,必须小心确认代码来源安全可靠,避免引入风险。