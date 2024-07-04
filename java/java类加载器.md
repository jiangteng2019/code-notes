## java类加载器

在Java虚拟机（JVM）中，类加载器（ClassLoader）是一种重要的组件，负责动态地加载、链接和初始化类和接口。在JVM中，类加载器按照层级和职责划分，主要有以下几种类型：

-   引导类加载器（Bootstrap ClassLoader）：
    职责：加载Java运行时环境的核心类库，如java.lang.\*包中的类。这些类通常位于JVM的安装目录下的lib目录中，例如rt.jar。
    特点：由于引导类加载器通常是用原生代码（如C++）实现的，它在Java应用程序中不是一个标准的Java类，而是由JVM内部实现。

-   扩展类加载器（Extension ClassLoader）：
    职责：加载Java的扩展库，这些库通常位于JVM的安装目录下的lib/ext目录或者由系统属性java.ext.dirs指定的其他目录中。
    特点：这个加载器是sun.misc.Launcher$ExtClassLoader的一个实例，在Java中可以作为一个标准类使用。

-   系统（应用）类加载器（System/Application ClassLoader）：
    职责：它负责加载环境变量classpath或者系统属性java.class.path指定路径下的类库。这是加载应用程序类的默认加载器。
    特点：这个加载器是sun.misc.Launcher$AppClassLoader的一个实例，在Java应用程序中可以直接使用。
    除了这些内置的类加载器，Java还允许创建自定义类加载器。这是通过继承java.lang.ClassLoader类并重写其findClass(String name)方法来实现的。自定义类加载器广泛用于以下场景：

-   动态加载类：在运行时从动态生成的字节码、网络资源或其他来源加载类。
-   模块化平台：例如，OSGi平台用于动态加载和卸载模块。
-   隔离加载类：在容器环境（如Web服务器）中，隔离不同应用程序的类路径。

类加载器的工作机制还包括“委托模型”（Delegation Model），这意味着类加载器在尝试自己加载类之前，会先委托给其父加载器。这个模型有助于避免类的重复加载，并保持Java运行时环境的类加载机制的一致性。

总的来说，JVM的类加载器是实现Java应用程序灵活性和模块化的关键组件。
