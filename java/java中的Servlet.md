## java中的Servlet 

### 一个标准的servlet组件:
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

一个标准的servlet组件包括:
- @WebServlet的注解，用于映射路由
- 一个类继承自HttpServlet
- 覆写doGet、doPost方法，方法会自动拿到HttpServletRequest、HttpServletResponse两个对象
- 通过这两个对象可以拿到http请求体和写入响应

### 注意点：
- 如果是编写servlet maven项目，注意项目的war包，而非jar包
- servlet严格区分版本，4.0之前的包名javax.servlet，5.0以后的包名为jakarta.servlet
- 运行一个war包，需要使用web服务器，如Tomcat
- 使用Servlet<=4.0时，选择Tomcat 9.x或更低版本， 使用Servlet>=5.0时，选择Tomcat 10.x或更高版本
- 定义在servlet类中的实例变量会被多线程访问
- 在doGet()或doPost()方法中，如果使用了ThreadLocal,需要清理ThreadLocal