## yum安装包提示BDB0113错误

解决：

```sh
cd /var/lib/rpm
rm -rf __db*
rpm --rebuilddb
```
