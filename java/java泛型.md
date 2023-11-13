### 泛型的实现：
Java 的泛型实现使用擦拭法实现。即虚拟机中并没有泛型的概念，泛型的实现全部由java编译器提供。编译器将泛型类型<T>全部视为<Object>，再根据<T>进行安全的强制转型。

### 泛型的局限性
Java的泛型因此有以下局限性：

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
}
```
在Java中，泛型是在编译时进行类型检查的，编译后会进行类型擦除，即把泛型参数T替换为它的边界，如果没有指定边界，则默认为Object。所以，equals(T)方法在类型擦除后的签名就变成了equals(Object)，这与Object类中的equals(Object)方法签名相同。但是，由于equals(T)方法在源代码中的参数类型是T，而不是Object，所以它并没有覆盖Object类中的equals(Object)方法。在Java中，方法的重写必须满足“参数列表必须与被重写方法的相同”这个原则，所以这里的equals(T)方法并不被视为对Object类的equals(Object)方法的有效重写，因此编译器报错。

如果你想要覆盖Object类的equals(Object)方法，应该这样写：

```
@Override
public boolean equals(Object obj) {
    
}
```
如果你想要定义一个接受泛型参数的比较方法，可以定义一个新的方法，比如：

```
public boolean isEqualTo(T t) {
    
}
```
但是这个isEqualTo(T)方法并不会覆盖Object类的equals(Object)方法，所以在使用Object的equals(Object)方法进行比较时，实际上调用的还是Object类的equals(Object)方法，而不是定义的isEqualTo(T)方法。


### 上界通配符extends

Java中的上界通配符使用方式有两种: 一种是传递泛型对象时限定泛型，一种是定义泛型时限定泛型。
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
    public void setFirst(T first) {
        this.first = first;
    }
    public void setLast(T last) {
        this.last = last;
    }
}
```

可以在使用泛型类Pair<T>的时候，使用extends通配符来限定T的类型:
```
static int add(Pair<? extends Number> p)
```

也可以定义泛型类Pair<T>的时候，使用extends通配符来限定T的类型:
```
class Pair<T exends Number>
```

使用上界通配符有一个重要的特征就是只能“读”，不能“写”。
有一上界通配符界定了类型的上界，加入上界为Number， 你可以使用Number引用任何类型的字段，因为Number为顶级类型。但不可以调用set方法传入具体的子类型。因为泛型中保存的可能是任意一种子类型，在不确定类型的情况下无法写入具体的子类型。编译器在这种情况下会报错。例如:

```
Pair<? extends Number> integerPair = new Pair<>(Integer.valueOf(0), Integer.valueOf(0));

// 可以使用Number引用
Number firstInteger = integerPair.getFirst();

// 不可以使用Integer引用
Integer i = integerPair.getFirst();

// 不可以调用任何set方法， set(null)除外。
integerPair.setFirst(123); 

```

### super通配符
super通配符与extend 通配符的作用相反，它表示允许调用set(? super Integer)方法传入Integer的引用，但不允许调用get()方法获得Integer的引用。例如下面的调用签名：
```
static void setSame(Pair<? super Integer> p, Integer n) {
    p.setFirst(n);
    p.setLast(n);
}
```

此时setFirst()的实际方法签名为：
```
void setFirst(? super Integer);
```
参数p中的super通配符表示，接收所有Integer及其父类。此时setFirst 传入Integer是被允许的。但传入Integer父类是不被允许的。但使用
```
Integer x = p.getFirst();
```
又是不被允许的。因为Integer x 无法持有 Integer的父类型。但可以使用Object接收返回的类型
```
Object obj = p.getFirst();
```

### 无限定通配符
```java
void sample(Pair<?> p) {

}
```
无限定通配符既没有extends，也没有super，因此：
- 不允许调用set(T)方法并传入引用（null除外）；
- 不允许调用T get()方法并获取T引用（只能获取Object引用）。
