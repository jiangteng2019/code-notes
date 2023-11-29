## java反射中的动态代理

什么是动态代理，动态代理指的是在运行期间内创建接口的实例，即没有实现类，但是可以“实例化接口”。

实际上并不存在实例化接口的方式。而是jvm根据足够的信息自动创建对应的接口实例:

实例：

存在一个接口:
```java
interface Hello {
    void morning(String name);
}
```
如果需要调用morning方法，正常情况下需要编写一个实现类:
```java
public class HelloWorld implements Hello {
    public void morning(String name) {
        System.out.println("Good morning, " + name);
    }
}
```
然后调用:
```java
Hello hello = new HelloWorld();
hello.morning("Bob");
```
但实际上还有另外的方式:

观察方法，实例方法实际上包含一个this对象、和若干参数组成。于是对一个方法记性抽出处理，例如 morning方法，方法体的另一种形势表示：
```java
InvocationHandler handler = new InvocationHandler() {
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println(method);
        if (method.getName().equals("morning")) {
            System.out.println("Good morning, " + args[0]);
        }
        return null;
    }
};
```
最终调用morning方法:
```java
Hello hello = (Hello) Proxy.newProxyInstance(
    Hello.class.getClassLoader(), // 传入ClassLoader
    new Class[] { Hello.class }, // 传入要实现的接口
    handler); // 传入处理调用方法的InvocationHandler
hello.morning("Bob");

// public abstract void Hello.morning(java.lang.String)
// Good morning, Bob
```
可以看到通过发射实现一个接口的动态代理的步骤有:
- 实现接口的方法，通过InvocationHandler进行代理；
- 创建代理的接口的实体类，需要传入对应的类加载器、需要实现的接口、和实现的接口的方法体（InvocationHandler）
- 正常进行调用

本质上动态代理其实就是JVM帮我们自动编写了一个实现类（不需要源码，可以直接生成字节码），并不存在可以直接实例化接口的黑魔法。