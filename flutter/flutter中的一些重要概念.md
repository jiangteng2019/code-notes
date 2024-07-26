# flutter中的一些重要概念

## BuildContext 
BuildContext 是 Flutter 框架中的一个核心概念，它代表了小部件树的一个瞬间快照，包含了构建小部件树时的上下文信息。当你在 build 方法中调用 Theme.of(context) 或者其他依赖于上下文的方法时，BuildContext 提供了访问这些信息的能力。

具体来说，BuildContext 包含以下信息：

当前小部件在树中的位置。
当前小部件的祖先小部件。

小部件树中与状态管理相关的对象，如主题（Theme）、媒体查询（MediaQuery）和局部变量（Localizations）。
生命周期信息，比如小部件是否已插入到树中或正在被构建。

在 Flutter 中，当你使用 MaterialApp 或者 Theme 小部件并将一个 ThemeData 对象作为其 theme 参数传递时，这个 ThemeData 将成为该小部件及其子树的默认主题。这意味着在小部件树中的任何地方，只要位于这个 Theme 或 MaterialApp 的作用域内，你都可以通过 BuildContext 来访问这个主题数据。

具体来说，你可以使用 Theme.of(context) 方法来获取当前构建上下文中的 ThemeData。这个方法会沿着构建上下文的链向上查找，直到找到最近的 Theme 或 MaterialApp 小部件，并返回其提供的 ThemeData。例如：
```dart
return MaterialApp(
  theme: ThemeData(
    // 你的主题配置
  ),
  home: MyHomePage(),
);

// 在 MyHomePage 的 build 方法中
class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My App'),
      ),
      body: Center(
        child: Text(
          'Hello, World!',
          style: Theme.of(context).textTheme.bodyText1,
        ),
      ),
    );
  }
}
```

## StatefulWidget 组件使用
 在 Flutter 中，StatefulWidget 类需要实现 createState 方法，该方法返回一个 State 类型的实例。createState 方法的返回类型是一个 State 泛型类的实例，其中泛型参数 T 正是 StatefulWidget 的类型本身。

这里是一个简化版的 StatefulWidget 和 State 类的定义示例，展示 createState 方法的作用：

```dart
class StatefulWidget extends Widget {
  @protected
  _State createState() => _State();
}

abstract class State<T extends StatefulWidget> extends WidgetsBindingObserver {
  T get widget;
  BuildContext context;
  
  // ...
  
  @mustCallSuper
  void initState() {
    // 初始化状态
  }
  
  @protected
  void didChangeDependencies() {
    // 更新依赖项
  }
  
  @mustCallSuper
  void dispose() {
    // 清理资源
  }
  
  @protected
  void didUpdateWidget(covariant T oldWidget) {
    // 更新小部件
  }
  
  Widget build(BuildContext context);
  
  // ...
}
```

 在实际的代码中，createState 方法通常会返回一个具体的 State 子类的实例，例如：
```dart
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  // 状态类的具体实现
}
```
在这个例子中，_MyWidgetState 类继承自 State<MyWidget>，并且 MyWidget 的 createState 方法返回 _MyWidgetState 的实例。这样，_MyWidgetState 类就可以管理 MyWidget 的状态，并响应状态变化，触发 UI 的重新构建。

## 真正的页面渲染Widget
StatefulWidget 本身并不直接定义页面的 UI 内容。相反，它通过 createState 方法返回一个 State 类的实例，这个实例负责管理小部件的状态，并且通过覆写 build 方法来定义实际的 UI 布局。

在 State 类的 build 方法中，你可以返回任何类型的 Widget，包括 Scaffold，来构建你的页面布局。Scaffold 是一个常用的布局小部件，它提供了标准的 Material Design 页面结构，包括 AppBar、FloatingActionButton、BottomNavigationBar 等组件。
```dart
class MyPage extends StatefulWidget {
  @override
  _MyPageState createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Page'),
      ),
      body: Center(
        child: Text('Hello, World!'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: Icon(Icons.add),
      ),
    );
  }
}
```

## 关于widget 变量

在 Flutter 中，StatefulWidget 的 State 类中的 widget 变量确实指向创建当前状态 (State) 实例的 StatefulWidget 对象。当你在 State 类的任何方法中引用 widget 时，你实际上是在访问创建该 State 实例时的 StatefulWidget 的实例。

这是因为每当 StatefulWidget 需要创建一个新的 State 实例时，它会调用 createState 方法，并且在 State 类的构造函数中，widget 变量会被初始化为当前 StatefulWidget 的实例。这使得 State 类能够访问 StatefulWidget 的属性和方法，从而可以基于这些信息来构建 UI 或者执行其他逻辑。
```dart
class MyStatefulWidget extends StatefulWidget {
  final String title;

  MyStatefulWidget({this.title});

  @override
  _MyStatefulWidgetState createState() => _MyStatefulWidgetState();
}

class _MyStatefulWidgetState extends State<MyStatefulWidget> {
  @override
  Widget build(BuildContext context) {
    // widget 变量指向 MyStatefulWidget 的实例
    print(widget.title); // 输出 MyStatefulWidget 的 title 属性值
    return Text(widget.title);
  }
}
```
在这个例子中，_MyStatefulWidgetState 类中的 widget 就是指向 MyStatefulWidget 的实例，因此你可以通过 widget.title 来访问 MyStatefulWidget 的 title 属性。