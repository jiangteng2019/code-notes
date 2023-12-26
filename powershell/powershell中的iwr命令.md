## powershell中的iwr命令

iwr(Invoke-WebRequest)在PowerShell中用于发起HTTP/HTTPS请求来调用Web API或下载文件。

它的主要功能包括:

1. 发起GET、POST等HTTP请求,并获取响应。可以用来测试API或网页。

1. 支持基本验证、SSL、cookie等。

1. 下载文件。可以用来从网络URL下载文件到本地。

1. 支持响应输出为多种格式,如文本、JSON、XML等。

1. 支持模拟User Agent。

1. 返回一个Web响应对象,包含状态码、响应头、响应内容等信息。可以进一步分析响应详情。

1. 支持超时时间设置。

1. 可以用在脚本和命令中,自动化处理web请求任务。

基本语法:

iwr [-Method] [-Uri] [-WebSession] [-SessionVariable] [-Certificate] [-UserAgent] 
     [-Credential] [-UseBasicParsing] [-TimeoutSec] [-Headers] [-Body]  
     [-OutFile] [-Proxy] [-ProxyCredential] [-ProxyUseDefaultCredentials]
示例:

powershell
Copy code
# 简单的GET请求
     iwr -Uri https://www.example.com 

# POST请求
     iwr -Method POST -Uri https://example.com/login -Body @{username='user';password='pass'}

# 下载文件
     iwr -Uri http://example.com/file.zip -OutFile file.zip

所以iwr为PowerShell提供了很好的web请求能力,可以用来开发各种网络自动化脚本。