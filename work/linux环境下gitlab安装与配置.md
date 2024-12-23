# linux环境下gitlab安装与配置

## 环境预配置

```sh
# 安装依赖，确保服务器可以连接网络
yum install -y curl policycoreutils-python openssh-server
```

## 配置镜像源
```sh
# 新建文件，放到目录下： /etc/yum.repos.d/gitlab-ce.repo,内容如下：
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el$releasever/
gpgcheck=0
enabled=1
```

## 安装gitlab

```sh
yum makecache
yum install gitlab-ce
```

不出意外的话可以看到如下信息：
```
       *.                  *.
      ***                 ***
     *****               *****
    .******             *******
    ********            ********
   ,,,,,,,,,***********,,,,,,,,,
  ,,,,,,,,,,,*********,,,,,,,,,,,
  .,,,,,,,,,,,*******,,,,,,,,,,,,
      ,,,,,,,,,*****,,,,,,,,,.
         ,,,,,,,****,,,,,,
            .,,,***,,,,
                ,*,.
  


     _______ __  __          __
    / ____(_) /_/ /   ____ _/ /_
   / / __/ / __/ /   / __ `/ __ \
  / /_/ / / /_/ /___/ /_/ / /_/ /
  \____/_/\__/_____/\__,_/_.___/
  

Thank you for installing GitLab!

```
## 简单配置
```sh
# 编辑 `/etc/gitlab/gitlab.rb`文件，修改如下配置：
external_url 'http://172.16.109.131'

# 保存后应用配置
sudo gitlab-ctl reconfigure

# 重启服务
sudo gitlab-ctl restart

# 如果还是无法访问是由于防火墙阻止了80端口的访问：
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent

# 重启防火墙
sudo firewall-cmd --reload  

# 登录默认用户名 root，密码在如下位置
cat /etc/gitlab/initial_root_password

# 切记登录第一件事就是改密码，因为默认密码会在一段时间后自动删除

```
