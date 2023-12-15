## Linux服务器用户登陆配置读取

当Linux服务器init进程启动初始化所有的环境后，进而会读取用户的配置：

- 首先读入 /etc/profile，这是对所有用户都有效的配置:
- 然后 **依次** 寻找下面三个文件，这是针对当前用户的配置:
```sh
# 找到哪个算哪个，只会有一个文件生效，可以在文件中配置系统或者用户环境变量。
~/.bash_profile
~/.bash_login
~/.profile
```
- 启动非登陆shell
不会读取和执行/etc/profile和.bash_profile等文件，而是只读取并执行 ~/.bashrc文件

- 在centOS操作系统中的 .bash_profile 文件中有这样的代码
```sh
[root@ls-8ob7vltm ~]# cat .bash_profile
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:$HOME/bin

export PATH

```
也就是说登陆的shell启动非登陆的shell时候，也会读取并执行.bashrc文件的内容，再看一下.bashrc文件:
```sh
[root@ls-8ob7vltm ~]# cat .bashrc
# .bashrc

# User specific aliases and functions

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
fi
```
可以看到.bashrc 调用了 bashrc，如果bashrc 存在的情况下。
点 . 是source命令的简写形式，表示运行某个文件。


### linux 为什么会区分登陆shell 和 非登陆shell？

> 在Linux中，Shell是用户与操作系统进行交互的接口。Shell可以分为登录Shell和非登录Shell，这两者的区别主要在于它们的启动方式和环境变量的设置。

> 登录Shell：当用户通过用户名和密码登录系统时，系统会启动一个登录Shell。登录Shell会读取并执行/etc/profile文件，然后在用户的主目录中查找并执行.bash_profile、.bash_login、.profile（按此顺序，只执行找到的第一个文件）。这些文件通常包含了设置环境变量、命令别名等初始化设置的命令。

> 非登录Shell：非登录Shell通常是在用户已经登录系统后，通过在终端中输入bash或sh等命令启动的。非登录Shell不会读取和执行/etc/profile和.bash_profile等文件，而是只读取并执行.bashrc文件。这意味着非登录Shell的环境设置可能与登录Shell不同。

> 这种区分的原因是，登录Shell和非登录Shell通常用于不同的场景。登录Shell通常用于用户登录系统时的初始化设置，这些设置可能包括一些比较“重”的操作，如启动一些服务、设置一些系统级的环境变量等。而非登录Shell通常用于用户在系统中打开新的终端窗口时，这些窗口可能只需要一些轻量级的环境设置，因此不需要执行所有的初始化命令。通过区分登录Shell和非登录Shell，可以使系统更加灵活和高效。

### macOS环境变量的配置
在最新的macOS系统中，启动的shell 只有非登陆的shell，因此配置在.profile文件中是不会主动生效的，或者只会针对本次登陆有效， 环境变量的配置需要可以在以下文件中进行：

- 全局环境变量：如果你想要设置全局环境变量，可以在/etc/paths文件中添加新的路径。这些设置将对所有用户生效。

- 用户级环境变量：对于特定用户的环境变量设置，可以在用户的主目录下创建或编辑.zshrc文件（对于macOS Catalina及更高版本，默认使用Zsh作为Shell）。在.zshrc文件中，你可以添加环境变量设置，例如：

- export PATH=$PATH:/your/new/path
如果你使用的是Bash作为Shell，可以在用户的主目录下创建或编辑.bash_profile或.bashrc文件，并在其中添加环境变量设置。

完成上述操作后，需要重新启动终端或运行source .zshrc（对于Zsh）或source .bash_profile（对于Bash）以使更改生效。
