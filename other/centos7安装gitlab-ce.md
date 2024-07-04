# centos7安装gitlab-ce

1. 离线安装

    ```bash
    # 下载gitlab-ce镜像:
    # https://packages.gitlab.com/gitlab/gitlab-ce

    # 下载完成后直接安装即可
    yum install -y gitlab-ce-13.6.1-ce.0.el7.x86_64.rpm

    ```

1. 在线安装

    在 /etc/yum.repos.d/ 下新建 gitlab-ce.repo，写入如下内容

    ```sh
    [gitlab-ce]
    name=gitlab-ce
    baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/
    Repo_gpgcheck=0
    Enabled=1
    Gpgkey=https://packages.gitlab.com/gpg.key

    ```

    然后创建cache，再直接安装gitlab-ce

    ```sh
    yum makecache  # 这一步会创建大量的数据

    # 直接安装最新版
    yum install -y gitlab-ce

    # 如果要安装指定的版本，在后面填上版本号即可
    yum install -y  gitlab-ce-13.6.1

    # 如果安装时出现gpgkey验证错误，只需在安装时明确指明不进行gpgkey验证
    yum install gitlab-ce -y --nogpgcheck
    ```

1. gitlab的配置

    配置文件位置 /etc/gitlab/gitlab.rb

    ```sh
    [root@centos7 test]# vim /etc/gitlab/gitlab.rb

    [root@centos7 test]# grep "^[a-Z]" /etc/gitlab/gitlab.rb

    external_url 'http://10.0.0.51'  # 这里一定要加上http://

    # 配置邮件服务
    gitlab_rails['smtp_enable'] = true
    gitlab_rails['smtp_address'] = "smtp.qq.com"
    gitlab_rails['smtp_port'] = 25
    gitlab_rails['smtp_user_name'] = "xiaohao@qq.com"  # 自己的qq邮箱账号
    gitlab_rails['smtp_password'] = "xxx"  # 开通smtp时返回的授权码
    gitlab_rails['smtp_domain'] = "qq.com"
    gitlab_rails['smtp_authentication'] = "login"
    gitlab_rails['smtp_enable_starttls_auto'] = true
    gitlab_rails['smtp_tls'] = false
    gitlab_rails['gitlab_email_from'] = "xiaohao@qq.com"  # 指定发送邮件的邮箱地址
    user["git_user_email"] = "123456@qq.com"   # 指定接收邮件的邮箱地址
    ```

1. gitlabctl 常用命令

    ```sh
    gitlab-ctl start         # 启动所有 gitlab 组件
    gitlab-ctl stop          # 停止所有 gitlab 组件
    gitlab-ctl restart       # 重启所有 gitlab 组件
    gitlab-ctl status        # 查看服务状态

    gitlab-ctl reconfigure   # 启动服务
    gitlab-ctl show-config   # 验证配置文件

    gitlab-ctl tail          # 查看日志

    gitlab-rake gitlab:check SANITIZE=true --trace    # 检查gitlab

    vim /etc/gitlab/gitlab.rb # 修改默认的配置文件
    ```

1. 默认密码

动态密码位置在 /etc/gitlab/initial_root_password
24小时将会删除，应该尽快修改。
