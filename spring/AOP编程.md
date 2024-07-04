## AOP编程

AOP（Aspect Oriented Programming） 即面向切面进行编程,所谓的面向切面，指的是使用统一的逻辑对对象的某个方法进行拦截，在具体的方法调用前，实现某些逻辑，例如打印日志和权限的检查。

在java平台上，对于AOP的植入，有三种实现方式：

1. 编译期，由编译器将切面代码编译进字节码；
2. 类加载器，在目标类被装载到jvm时，通过特殊的类加载器，对字节码进行加强；
3. 运行期，运行期通过对目标类进行反射读取，并通过代理的方式实现动态织入。

Spring的代理是运行期通过动态代理实现的。

Spring对接口类型使用JDK动态代理，对普通类使用CGLIB创建子类。如果一个Bean的class是final，Spring将无法为其创建子类。CGLib不能对声明为final的方法进行代理，因为CGLib原理是动态生成被代理类的子类。使用了final修饰无法创建子类。

## spring拦截器的类型：

-   @Before：这种拦截器先执行拦截代码，再执行目标代码。如果拦截器抛异常，那么目标代码就不执行了；

-   @After：这种拦截器先执行目标代码，再执行拦截器代码。无论目标代码是否抛异常，拦截器代码都会执行；

-   @AfterReturning：和@After不同的是，只有当目标代码正常返回时，才执行拦截器代码；

-   @AfterThrowing：和@After不同的是，只有当目标代码抛出了异常时，才执行拦截器代码；

-   @Around：能完全控制目标代码是否执行，并可以在执行前后、抛异常后执行任意拦截代码，可以说是包含了上面所有功能。

## 使用spring AOP需要注意的点：

1. 因为在AOP中本质上的实现是spring使用CGLib 代理了原始实例。而CGLib 代理的实现是继承自原始实例，并覆写了原始实例的所有方法，并将其委托到原始实例。

1. 在java的语法中，如果子类继承自父类，子类的构造方法没有写上super()，编译器会自动加上super();因此对于一个类:

```java
public class UserService {
    public final ZoneId zoneId = ZoneId.systemDefault();
    public UserService() {
    }
}
```

实际上编译会将其编译成:

```java
public class UserService {
    public final ZoneId zoneId;
    public UserService() {
        super(); // 构造方法的第一行代码总是调用super()
        zoneId = ZoneId.systemDefault(); // 继续初始化成员变量
    }
}
```

但正常的继承UserService的时候，会自动调用super，也就是说会初始化成员变量zoneId；但使用代理的时候Spring使用CGLIB构造的Proxy类，直接生成字节码，并没有编译的过程，导致不会自动调用super，所以无法初始化成员变量。因此Spring通过CGLIB创建的代理类，不会初始化代理类自身继承的任何成员变量，包括final类型的成员变量。

这样导致的问题就是，如果访问了代理类中的成员变量，该成员变量是不存在的。

例如上述的UserService 使用了AOP代理：

```java
@Aspect
@Component
public class LoggingAspect {
    @Before("execution(public * com..*.UserService.*(..))")
    public void doAccessCheck() {
        System.err.println("[Before] do access check...");
    }
}
```

spring 框架读取了@Aspect 知道了doAccessCheck是切面方法，将其织入 UserService的类中，并使用UserService 的子类进行访问。但由于上述原因UserService 的子类 并不会继承UserService的成员变量，如果在业务代码中访问了UserService的成员变量，会导致空指针异常。因为注入的UserService 实际上是代理类。

```java
@Component
public class MailService {
    @Autowired
    UserService userService;

    public String sendMail() {
        ZoneId zoneId = userService.zoneId;
        String dt = ZonedDateTime.now(zoneId).toString();
        return "Hello, it is " + dt;
    }
}
```

所以要将直接访问字段的代码改成使用方法访问：

如果原始实例中的方法使用了final进行了修饰，那么该方法业务无法被子类代理，直接访问，也会导致空指针异常。
