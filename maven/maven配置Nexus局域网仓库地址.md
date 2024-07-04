## maven配置Nexus局域网仓库地址

在局域网内使用 Nexus 搭建了 Maven 仓库，但是 IntelliJ IDEA 中的 Maven 项目无法从该仓库下载 JAR 包时，需要确保 Maven 配置文件（settings.xml）中正确配置了仓库地址。以下是配置方法：

1. 找到 Maven 的配置文件（settings.xml）。这个文件通常位于 Maven 安装目录的 `conf` 文件夹下，或者在用户目录下的 `.m2` 文件夹内（例如：`C:\Users\用户名\.m2\settings.xml`）。

2. 如果没有找到 settings.xml 文件，可以创建一个新的文件，并将其放在用户目录下的 `.m2` 文件夹内。

3. 在 settings.xml 文件中，添加或修改 `<mirrors>` 和 `<profiles>` 部分，以包含你的局域网 Maven 仓库地址。以下是一个示例配置：

```xml
<settings>
  <mirrors>
    <mirror>
      <id>local-nexus</id>
      <url>http://nexus-server:8081/repository/maven-public/</url>
      <mirrorOf>*</mirrorOf>
    </mirror>
  </mirrors>

  <profiles>
    <profile>
      <id>local-nexus-profile</id>
      <repositories>
        <repository>
          <id>local-nexus</id>
          <url>http://nexus-server:8081/repository/maven-public/</url>
          <releases>
            <enabled>true</enabled>
          </releases>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
        </repository>
      </repositories>
    </profile>
  </profiles>

  <activeProfiles>
    <activeProfile>local-nexus-profile</activeProfile>
  </activeProfiles>
</settings>
```

将 `http://nexus-server:8081/repository/maven-public/` 替换 Nexus 仓库地址。

4. 保存 settings.xml 文件。

5. 在 IntelliJ IDEA 中，确保 Maven 配置正确指向了你修改过的 settings.xml 文件。你可以在 "Settings" 或 "Preferences" 菜单中的 "Build, Execution, Deployment" -> "Build Tools" -> "Maven" 部分找到这个设置。

完成上述步骤后，Maven 项目应该可以从局域网内的 Nexus 仓库下载 JAR 包。

如果 Nexus 仓库需要身份验证，那么需要在 Maven 的 settings.xml 文件中配置用户名和密码。你可以在 `<servers>` 标签下添加一个 `<server>` 来配置这些信息。以下是一个示例：

```xml
<settings>
  ...
  <servers>
    <server>
      <id>local-nexus</id>
      <username>your-username</username>
      <password>your-password</password>
    </server>
  </servers>
  ...
</settings>
```

在这个示例中，`<id>` 标签的内容应该与你在 `<mirrors>` 和 `<profiles>` 中配置的仓库 ID 相匹配。`<username>` 和 `<password>` 标签的内容应该是你的 Nexus 仓库的用户名和密码。

注意：出于安全考虑，你可能不希望在 settings.xml 文件中明文存储密码。Maven 提供了一个叫做 Maven Master Password 的功能，可以用来加密存储在 settings.xml 文件中的密码。
