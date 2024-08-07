## ssh端口转发

### 动态转发

通俗来讲，假如访问网站，但不想直接访问，想通过云服务器代理访问，该如何实现呢？

首先建立与云服务器的ssh连接：

```sh
# -D表示动态转发
# -N表示这个 SSH 连接只进行端口转发，不登录远程 Shell，不能执行远程命令，只能充当隧道。
# 2121是本地端口
ssh -D 2121 root@120.48.134.120 -N
```

建立连接后就可以通过访问2121端口去访问任何网站

```sh
# -x参数指定代理服务器
# 需要把 HTTP 请求转成 SOCKS5 协议
curl -x socks5://localhost:2121 http://www.baidu.com
```

### 本地转发

本地转发与动态转发有点类似，不同的是本地机器想要访问的地址是确定的，本地通过云服务器访问第三方网站，并且在本地开一个端口，访问localhost 就像是在访问第三方网站一样。

```sh
# -L：转发本地端口
# -N表示这个 SSH 连接只进行端口转发
ssh -L 2121:baidu.com:443 root@120.48.134.120 -N
```

访问本地2121 端口

```sh
# 本地端口转发采用 HTTP 协议，不用转成 SOCKS5 协议。
curl http://localhost:2121
```

动态转发与本地转发，实际上是类似的。本机的请求动态转发到ssh服务器上，因为本地的请求是与ssh服务器无提前绑定关系，因此访问本地端口的时候需要将目标网站放到参数里面，由ssh服务器进行转发。而本地转发，事先绑定了目标网站与本地端口，因此访问本地端口会将请求直接转发到ssh服务器上。

### 远程转发

远程转发实际上类似于内网穿透，通过云服务器访问家中的电脑，所以需要三台机器，（家中电脑、云服务器、公司电脑），假如需要使用公司电脑访问家中电脑，可以在家中电脑与云服务器之间先建立连接：

```sh
# -R参数表示远程端口转发
# 访问云服务器的8080端口将可以穿透到内网 localhost:80机器
# 由于云服务器需要开放端口，这里不再演示
ssh -R 8080:localhost:80 -N root@120.48.134.120
```
