
## maven配置阿里云镜像

```xml
<!-- 只需要在maven安装目录下找到conf文件夹下的setting.xml文件,配置一个镜像源。 -->
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <mirrorOf>central</mirrorOf>
    <url>https://maven.aliyun.com/repository/central</url>
</mirror>
```


