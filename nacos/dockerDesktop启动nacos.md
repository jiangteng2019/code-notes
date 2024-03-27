## dockerDesktop启动nacos

在使用docker-Desktop工具启动nacos服务时，需要配置环境变量MODE

```
MODE=standalone
```

这是因为默认集群服务启动，需要配置数据库的数据源。使用单点模式启动可以使用内置的嵌入式数据库Derby。

此外Nacos的数据库支持有三种,Derby(Nacos自带内存数据库),Mysql(5.7),Mysql(8),