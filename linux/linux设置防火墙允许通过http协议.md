## linux设置防火墙允许通过http协议.md

centos
使用firewalld开放端口
如果您的系统使用firewalld，可以用以下命令开放端口80：

```sh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```
