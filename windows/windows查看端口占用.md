windows 查看端口占用

```
netstat -aon | findstr "5040"
```


Linux 查看端口占用
```
lsof  -i:8080
```