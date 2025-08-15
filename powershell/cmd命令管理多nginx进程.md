
# cmd命令管理多nginx进程

**注意**

1. 需要配置nginx 目录

1. 执行步骤2后需要刷新两nginx页面，推测是因为nginx启动时会启动两个进程，一个主进程，一个子进程，刷新页面用户提供信号量，用于主进程接收并退出。

```sh
@echo off
chcp 65001
setlocal enabledelayedexpansion
set NGINX_PATH=C:\Users\jiangt1\Downloads\nginx-1.19.10


:menu
echo.
echo [Nginx 多实例管理 - 当前路径：%NGINX_PATH%]
echo =============================================
echo 1. 启动 Nginx（当前目录）
echo 2. 停止 Nginx（当前目录）
echo 3. 重启 Nginx（当前目录）
echo 4. 退出程序
echo =============================================
set /p choice=请输入数字后按回车确认：

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" exit /b

echo 输入无效，请按规则输入 1-4 的数字！
timeout /t 2 > nul
goto menu

@REM 启动脚本
:start

if not exist "%NGINX_PATH%\nginx.exe" (
    echo [错误] 路径 %NGINX_PATH% 不存在或nginx.exe未找到！
    goto menu
)

cd /d "%NGINX_PATH%"
wmic process where "name='nginx.exe'" get executablepath | find "%NGINX_PATH%" > nul
if not errorlevel 1 (
    echo 错误：当前目录的 Nginx 已在运行中！
    goto menu
)
start nginx.exe
echo 正在启动当前目录的 Nginx...
timeout /t 5 
wmic process where "name='nginx.exe'" get executablepath | find "%NGINX_PATH%" > nul
if not errorlevel 1 (
    echo 成功：当前目录的 Nginx 已启动！
) else (
    echo 错误：启动失败，请检查 %NGINX_PATH%\logs\error.log
)
goto menu

@REM 停止脚本
:stop
if not exist "%NGINX_PATH%\nginx.exe" (
    echo [错误] 路径 %NGINX_PATH% 不存在或nginx.exe未找到！
    goto menu
)

cd /d "%NGINX_PATH%"
wmic process where "name='nginx.exe'" get executablepath | find "%NGINX_PATH%" > nul
if errorlevel 1 (
    echo 错误：当前目录的 Nginx 未在运行！
    goto menu
)

echo 正在尝试优雅停止...
echo 请刷新2次 nginx 页面
"%NGINX_PATH%\nginx.exe" -s quit
timeout /t 10
wmic process where "name='nginx.exe'" get executablepath | find "%NGINX_PATH%" > nul
if errorlevel 1 (
    echo 成功：Nginx 已优雅停止！
    goto menu
)else (
    echo 错误：停止失败，请手动结束进程！
)


goto menu

@REM 重启脚本
:restart
call :stop
call :start
goto menu
```