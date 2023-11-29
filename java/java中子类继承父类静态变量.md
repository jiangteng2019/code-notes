## java中子类继承父类静态变量

在Java中父类中的静态变量会被子类继承吗？

```java
public class TestStatic {
	public static void main(String[] args) {
		System.out.println("child age: " + Child.age);
		Child.age++;
		System.out.println("child age: " + Child.age);
		System.out.println("person age: "+ Human.age);
	}

}

class Human {
	public static int age = 15;
}

class Child extends Human {
	
}

// child age: 15
// child age: 16
// person age: 16
```

继承只会继承实例变量和方法，类的静态变量和方法是共享的，由编译器自动定位到父类进行操作。

> 在Java中，静态变量不是被子类继承的，而是被子类共享。换句话说，静态变量属于类本身，而不是类的实例。
当子类引用一个继承自父类的静态变量时，它实际上是在直接引用父类的静态变量。因此，如果子类或者父类修改了这个静态变量的值，那么这个变更将会反映在所有引用这个静态变量的地方。
