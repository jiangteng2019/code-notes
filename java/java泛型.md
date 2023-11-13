### 泛型的实现：
1. Java 的泛型实现使用擦拭法实现。即虚拟机中并没有泛型的概念，泛型的实现全部由java编译器提供。编译器将泛型类型<T>全部视为<Object>，再根据<T>进行安全的强制转型。

### 泛型的局限性
1. Java的泛型因此有以下局限性：
    1. 无法持有基本类型的数据类型例如<int>
    1. 无法取得泛型的class，因为泛型只有一种类型即<Object>
    1. 无法判断泛型的类型,如 Room<Teacher> 与 Room<Student> 在编译器看来， 实际上只有 Room<Object>
    1. 无法示例化 T， 因为T本质上是Object

### 覆写泛型方法注意
不恰当的覆写方法也会报错，例如：
```
class Pair<T> {
    public boolean equals(T t) {
    return this == t;
}
```
在Java中，泛型是在编译时进行类型检查的，编译后会进行类型擦除，即把泛型参数T替换为它的边界，如果没有指定边界，则默认为Object。所以，equals(T)方法在类型擦除后的签名就变成了equals(Object)，这与Object类中的equals(Object)方法签名相同。但是，由于equals(T)方法在源代码中的参数类型是T，而不是Object，所以它并没有覆盖Object类中的equals(Object)方法。在Java中，方法的重写必须满足“参数列表必须与被重写方法的相同”这个原则，所以这里的equals(T)方法并不被视为对Object类的equals(Object)方法的有效重写，因此编译器报错。

如果你想要覆盖Object类的equals(Object)方法，应该这样写：

```@Override
public boolean equals(Object obj) {
    // ...
}```
如果你想要定义一个接受泛型参数的比较方法，可以定义一个新的方法，比如：

```public boolean isEqualTo(T t) {
    // ...
}```
但是这个isEqualTo(T)方法并不会覆盖Object类的equals(Object)方法，所以在使用Object的equals(Object)方法进行比较时，实际上调用的还是Object类的equals(Object)方法，而不是定义的isEqualTo(T)方法。


### 上界通配符extends

Java中的上界通配符使用方式有两种: 一种是传递泛型对象时限定泛型，一种是定义泛型时限定泛型
对于一个泛型类：
```
class Pair<T> {
    private T first;
    private T last;
    public Pair(T first, T last) {
        this.first = first;
        this.last = last;
    }
    public T getFirst() {
        return first;
    }
    public T getLast() {
        return last;
    }
}
```

可以在使用泛型类型Pair<T>的时候，使用extends通配符来限定T的类型:
```
static int add(Pair<? extends Number> p)
```

可以定义泛型类型Pair<T>的时候，使用extends通配符来限定T的类型:
```
class Pair<T exends Number>
```

#### 