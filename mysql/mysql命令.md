# mysql命令
启动mysql
```sh
mysqld --console
```

更改密码
```sh
#进入mysql
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';

```
mysql如何允许远程登陆？
```sh

#进入mysql
mysql -u root -p

#使用 mysql 数据库：
use mysql;

#更新 root 用户的主机地址：
UPDATE user SET host = '%' WHERE user = 'root';

#或者指定特定的 IP 地址：
UPDATE user SET host = '192.168.1.100' WHERE user = 'root';

#查看
SELECT Host, User from user;

mysql> select Host, User from user;
+-----------+------------------+
| Host      | User             |
+-----------+------------------+
| %         | root             |
| localhost | mysql.infoschema |
| localhost | mysql.session    |
| localhost | mysql.sys        |
+-----------+------------------+

#重新加载权限
FLUSH PRIVILEGES;
```