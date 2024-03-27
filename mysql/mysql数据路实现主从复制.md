## mysql数据路实现主从复制

### 预备工作

使用docker-desktop创建两台mysql容器命名为mysql-master，mysql-slave
记得填写环境变量 MYSQL_ROOT_PASSWORD  root，否则容器无法启动。

1. 查看两台机器的ip 使用inspect：
```sh
master "IPAddress": "172.17.0.2",
slave "IPAddress": "172.17.0.3",
```

2. 使用navicat连接主、从库，并创建数据库test.

### 主机配置

1. 更改主机用户密码策略
这一步非常重要，如果是mysql 8.0 版本需要更改创建用户的默认密码策略，否则会连接不上，即使中途更改策略也会出现需要莫名其妙的问题，实际上就是因为这个问题这两个容器已经创建删除不下3次。

1. 在 /etc/my.cnf 将注释放开
    ```
    default_authentication_plugin=mysql_native_password
    ```
1. 重启mysql

1. 创建从库连接时候的用户名和密码并赋予复制权限：
    ```sh
    # mysql -u root -p 进入mysql客户端
    CREATE USER 'slave'@'172.17.0.3' IDENTIFIED BY 'slave';
    GRANT REPLICATION SLAVE ON *.* TO 'slave'@'172.17.0.3';
    FLUSH PRIVILEGES;
    ```

1. 查看用户名密码
    ```
    mysql> SELECT User, Host FROM mysql.user;
    +------------------+------------+
    | User             | Host       |
    +------------------+------------+
    | root             | %          |
    | slave            | 172.17.0.3 |
    | mysql.infoschema | localhost  |
    | mysql.session    | localhost  |
    | mysql.sys        | localhost  |
    | root             | localhost  |
    +------------------+------------+
    ```


### 主库配置
1. 在配置文件 /etc/my.cnf 添加如下几行
    ```sh
    log-bin=mysql-bin
    server-id=104
    binlog-do-db=test
    ```
2. 重启mysql
3. 查看状态,这里的数据很重要建议先复制保存
```
mysql> show master status \G
*************************** 1. row ***************************
             File: mysql-bin.000001
         Position: 158
     Binlog_Do_DB: test
 Binlog_Ignore_DB: 
Executed_Gtid_Set: 
1 row in set, 1 warning (0.00 sec)
```

## 从库配置

1. 在配置文件 /etc/my.cnf 添加
    ```sh
    server-id=106
    ```
2. 重启mysql
3. 登陆终端复制并执行
```sh
CHANGE MASTER TO 
MASTER_HOST='172.17.0.2',
MASTER_USER='slave',
MASTER_PASSWORD='slave',
MASTER_LOG_FILE='mysql-bin.000001',
MASTER_LOG_POS=4,
master_port=3306;

# MASTER_HOST 是主机的地址，因为容器连接到默认网桥，可以直接通信
# MASTER_USER 是在主机中创建的用户名
# MASTER_PASSWORD 密码
# MASTER_LOG_FILE 是上述的 File: mysql-bin.000001 的内容
# MASTER_LOG_POS 偏移量4 表示默认从头开始读取
# master_port 数据库端口，默认可以通信
```
4. 生效
    ```sh
    start slave;
    ```
5. 查看
```
show slave status\G;
*************************** 1. row ***************************
               Slave_IO_State: Connecting to source
                  Master_Host: 172.17.0.2
                  Master_User: slave
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000007
          Read_Master_Log_Pos: 4
               Relay_Log_File: 04a0f7d261a6-relay-bin.000001
                Relay_Log_Pos: 4
        Relay_Master_Log_File: mysql-bin.000007
             Slave_IO_Running: Connecting
            Slave_SQL_Running: Yes

```
如果报错：

    Replica I/O for channel '': Error connecting to source 'slave@172.17.0.2:3306'. This was attempt 5/10, with a delay of 60 seconds between attempts. Message: Authentication plugin 'caching_sha2_password' reported error: Authentication requires secure connection. Error_code: MY-002061

大概率是没有放开 default_authentication_plugin=mysql_native_password 解决方法只能将容器删了重新建，网上和GPT给出的方法都是没有用的。