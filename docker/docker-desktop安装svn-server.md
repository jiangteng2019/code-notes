## docker-desktop安装svn-server

注意使用的镜像是 garethflowers/svn-server

在docker容器的启动是配置好端口映射 3690:3690

进入容器进行配置
```sh
#创建一个名为test-repo的仓库
svnadmin create test-repo

# 进入仓库
cd test-repo/

# 编辑配置文件
vi  svnserve.conf

# 放开4行注释
anon-access = read
auth-access = write
password-db = passwd
authz-db = authz
```

```sh
# 创建账户密码
vi passwd
# 添加用户
test = test
```

```sh
# 编辑用户组
vi authz

# 新建一个用户组
# test-group = test,......
test-group = test,

# 配置用户组权限
[test-repo:/]
@test-group = rw

```

```sh
# 使用svn工具进行检出
svn://127.0.0.1:3690/test-repo
```