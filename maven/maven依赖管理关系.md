## maven依赖管理关系

Maven是一个项目管理和构建自动化工具，它通过使用Project Object Model（POM）文件来管理项目的构建、报告和文档。在Maven中，依赖关系是指项目需要依赖的其他项目（通常是库或框架）。

Maven中的依赖关系可以分为以下几种：

1. 编译依赖（Compile）：
   编译依赖是默认的依赖范围。这意味着依赖在编译期和运行期都是需要的。这些依赖对于编译项目的源代码是必须的，并且它们也会包含在运行时的classpath中。

1. 运行时依赖（Runtime）：
   运行时依赖在编译时不是必须的，但在运行和测试项目时需要。一个例子是JDBC驱动，编译代码时不需要JDBC驱动，但运行时需要连接数据库。

1. 测试依赖（Test）：
   测试依赖只在测试编译和测试执行阶段有效。它们不会被包含在正常的运行时依赖中。例如，JUnit就是一个典型的测试依赖，只在运行测试时使用。

1. 提供依赖（Provided）：
   提供依赖是指那些在运行时由JDK或者一个容器提供的依赖，比如Servlet API和EJB API。这些依赖在编译和测试时需要，但在运行时不需要，因为它们由运行环境提供。

1. 系统依赖（System）：
   系统依赖是指那些不通过Maven仓库获取的依赖，而是通过系统的一个具体路径提供的。这种依赖应该避免使用，因为它会导致项目依赖于特定的系统配置，降低了项目的可移植性。

1. 导入依赖（Import）（仅适用于依赖管理）：
   导入依赖是在\<dependencyManagement>中使用的一种特殊的依赖类型。它允许你导入其他项目的POM文件中指定的依赖关系列表。这通常用于继承和使用在一个中央位置定义的依赖版本，以保证多个项目使用相同的依赖版本。

---

详细解释：

1.  编译依赖通常是开发者自己自定义的class。这些class将会出现在编译时和运行时，因为编译时需要class的类型信息，运行时依赖class的内部处理逻辑。所有这就是编译依赖。

2.  运行时依赖，一般使用jdbc的驱动作为例子。通常情况下我们使用DriverManager 获取一个链接，使用getConnection方法。这些全部由jdk官方实现，类定义在java.sql.DriverManager class中。而使用的时候直接调用方法传入数据库的配置文件即可：

        ```java
        String JDBC_URL = "jdbc:mysql://localhost:3306/test";
        String JDBC_USER = "root";
        String JDBC_PASSWORD = "password";
        // 获取连接:
        Connection conn = DriverManager.getConnection(JDBC_URL, JDBC_USER, JDBC_PASSWORD);
        ```

    从始至终，我们没有使用自己自定义的类，因此编译时根本不需要相关的类。但运行时需要jdbc驱动。这就是运行时依赖。

"运行时依赖"通常是指那些在编译时不直接需要，但在运行时是必须的依赖。而JDBC驱动的情况稍微有些特殊，因为JDBC API是Java的一部分，所以你的代码在编译时期不需要包含具体的JDBC驱动依赖，但在运行时期需要，所以JDBC驱动通常被添加为运行时依赖。

1. 还有一种提供依赖，这种的通常使用servlet api举例。因为在编写一个servlet的时候：

```java
@WebServlet(urlPatterns = "/")
public class HelloServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        // 设置响应类型:
        resp.setContentType("text/html");
        // 获取输出流:
        PrintWriter pw = resp.getWriter();
        // 写入响应:
        pw.write("<h1>Hello, world!</h1>");
        // 最后不要忘记flush强制输出:
        pw.flush();
    }
}
```

应用程序运行在一个Servlet容器（如Tomcat），我们用到了servlet 的api，所以编译的时候需要对应的类型信息。需要使用HttpServlet类时，JVM会首先尝试在应用的类加载器中查找这个类。如果找不到，它会继续在父类加载器中查找，依此类推，直到找到类或者达到类加载器层次结构的顶部。因此，即使你的应用没有包含HttpServlet类，JVM仍然可以在运行环境的类加载器中找到它。

类加载器是JVM用来加载类的组件。每个Java应用都有一个类加载器层次结构，包括引导类加载器（加载JVM自身需要的类）、扩展类加载器（加载扩展目录中的类）和系统类加载器（加载系统类路径中的类）。此外，许多Java运行环境（如应用服务器）还会为每个部署的应用提供一个或多个自定义的类加载器。
