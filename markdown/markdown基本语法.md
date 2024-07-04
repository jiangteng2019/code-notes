# 标题：（空格在 # 和标题之间进行分隔）

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

# 段落： 不要用空格（spaces）或制表符（ tabs）缩进段落。

this is markdown demo

换行：在一行的末尾添加两个或多个空格，然后按回车键,即可创建一个换行(\<br\>)。
This is a markup document and shows how to write the markup syntax

# 强调：

-   斜体: _markdown_
-   粗体： **markdown**
-   又粗又斜： **_markdown_**

# 引用：

> This is a markup document and shows how to write the markup syntax

多个引用：

> This is a markup document and shows how to write the markup syntax
> This is a markup document and shows how to write the markup syntax

多个引用空白行:

> This is a markup document and shows how to write the markup syntax
>
> This is a markup document and shows how to write the markup syntax

嵌套引用:

> This is a markup document and shows how to write the markup syntax
>
> > This is a markup document and shows how to write the markup syntax

引用其他元素

> This is a markup document and shows how to write the markup syntax
>
> -   one
> -   two
> -   three

# 有序列表：

1. one
2. two
3. three

另一个有序列表:

1. one
1. two
1. three

来一点随便的数字(数字不必按数学顺序排列，但是列表应当以数字 1 起始)

1. one
2. two
3. three

当然也可以嵌套(通过缩进)

1. one
    1. one
    2. two
    3. three
2. two
3. three

# 无序列表:（"+" "-" "\*" 都是可以的）

-   one
-   two
-   three

*   one
*   two
*   three

-   one
-   two
-   three

# 代码：(直接使用``包围)

`
public static void main(String[] args) {

}
`

代码块:(缩进一个制表符或者四个空格)

    public static void main(String[] args) {

    }

围栏代码块: 使用```包围

```
public static void main(String[] args) {

}
```

语法高亮：加上语言名称

```java
public static void main(String[] args) {

}
```

# 分割线： 分隔线的前后均添加空白行。

---

---

---

三条分割线如上

# 链接：

超链接Markdown语法代码：\[超链接显示名\](https://www.bing.com "超链接title")

使用尖括号：

<https://www.bing.com>

<jiangteng2023@qq.com>

# 图片:

插入图片Markdown语法代码：

\!\[图片alt\](/markdown/demo.jpg "图片title")

![图片alt](/markdown/demo.jpg '图片title')

图片链接: 图像的Markdown 括在方括号中，然后将链接添加在圆括号中

\[\!\[图片alt](/markdown/demo.jpg "图片title")](https://www.bing.com)

[![图片alt](/markdown/demo.jpg '图片title')](https://www.bing.com)

# 转义：

显示原本用于格式化 Markdown 文档的字符，请在字符前面添加反斜杠字符 \

> This is a markup document and shows how to write the markup syntax

\> This is a markup document and shows how to write the markup syntax

参考资料 <https://markdown.com.cn/>
