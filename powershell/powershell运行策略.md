## PowerShell 执行策略
这些策略仅在 Windows 平台上执行。 PowerShell 执行策略如下：

### AllSigned
脚本可以运行。
要求所有脚本和配置文件都由受信任的发布者签名，包括在本地计算机上编写的脚本。
在运行来自尚未分类为可信或不可信的发布者的脚本之前，会提示你。
存在运行已签名的恶意脚本的风险。
### Bypass
不阻止任何操作，并且没有任何警告或提示。
此执行策略专为将 PowerShell 脚本内置到较大应用程序中的配置或以 PowerShell 为具有自己的安全模型的程序的基础的配置而设计。
### Default
设置默认执行策略。
Restricted（对于 Windows 客户端）。
RemoteSigned（对于 Windows 服务器）。
### RemoteSigned
Windows 服务器计算机的默认执行策略。
脚本可以运行。
需要受信任的发布者对从 Internet 下载的脚本和配置文件（包括电子邮件和即时消息程序）的数字签名。
在本地计算机上编写且不是从 Internet 下载的脚本不需要数字签名。
如果脚本已解除阻止（例如通过使用 Unblock-File cmdlet），则运行从 Internet 下载且未签名的脚本。
存在运行来自 Internet 以外来源的未签名脚本以及可能存在恶意的签名脚本的风险。
### Restricted
Windows 客户端计算机的默认执行策略。
允许单个命令，但不允许脚本。
阻止运行所有脚本文件，包括格式和配置文件 (.ps1xml)、模块脚本文件 (.psm1) 和 PowerShell 配置文件 (.ps1)。
### Undefined
当前范围内没有设置执行策略。
如果所有范围内的执行策略均为 Undefined，则对于 Windows 客户端，有效执行策略为 Restricted；对于 Windows Server，有效执行策略为 RemoteSigned。
### Unrestricted
非 Windows 计算机的默认执行策略，无法更改。
未签名的脚本可以运行。 存在运行恶意脚本的风险。
在运行非来自本地 Intranet 区域的脚本和配置文件之前警告用户。



```sh
# 获取当前的有效执行策略
Get-ExecutionPolicy
```


```sh
# 设置运行策略
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```