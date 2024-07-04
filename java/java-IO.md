### File对象

对于File对象的使用，无非是对文件的增删改查,需要注意的是Windows与Linux的分隔符的区别。可以使用`File.separator`获取。

```java
public class IoTest {

	public static void main(String[] args) throws IOException {
		File file = new File("C:\\Users\\jiangt1\\Desktop\\app.log");

		System.out.println(file.getAbsolutePath());
		System.out.println(file.getPath());
		System.out.println(file.getCanonicalPath());
		System.out.println(file.isDirectory());
		System.out.println(file.isFile());
		System.out.println(file.canRead());
		System.out.println(file.canWrite());
		System.out.println(file.canExecute());

		File docFile = new File("C:\\Users\\jiangt1\\Desktop");
		System.out.println(docFile.isDirectory());
		System.out.println(docFile.isFile());
		System.out.println(Arrays.deepToString(docFile.list()));
	}

}
```

### InputStream对象

-   IO 操作需要捕获 IOException 错误
-   IO 操作需要及时释放资源
-   IO操作可以使用try resource 语法简化手动关闭资源

如果是纯英文的文件，我们可以使用直接转成字符，假如存在helloworld的文件：

```java
public static void main(String[] args) throws IOException {
		try (InputStream inputStream = new FileInputStream("C:\\Users\\jiangt1\\Desktop\\test.txt")) {
			int n = 0;
			StringBuilder sb = new StringBuilder();
			while ((n = inputStream.read()) != -1) {
				sb.append( (char) n);
			}
			System.out.println(sb.toString());
		}
	}
```

但如果有中文，需要在读完缓冲字节数组中后，使用 new String()转字符串。

```java
public static void run() throws IOException {
		try (InputStream inputStream = new FileInputStream("C:\\Users\\jiangt1\\Desktop\\test.txt")) {
			byte [] bs = new byte [1000];
			inputStream.read(bs);

			System.out.println(new String(bs, StandardCharsets.UTF_8));
		}
	}
```

ByteArrayInputStream 可以在内存中模拟一个InputStream

```java
public static String readAsString(InputStream inputStream) throws IOException {
	byte[] bytes = new byte[100];
	inputStream.read(bytes);
	out.println(new String(bytes));
	return "";
}

InputStream inputStream = new ByteArrayInputStream("hello".getBytes());
readAsString(inputStream);
```

### OutputStream

OutputStream 特性与 InputStream相同，多了需要使用flush()方法将数据立即发送出去。
另外 ByteArrayOutputStream可以在内存中模拟一个OutputStream。

```java
public static void exec() throws IOException {
		try (OutputStream outputStream = new FileOutputStream("C:\\Users\\jiangt1\\Desktop\\test.txt")) {
			outputStream.write("你好".getBytes(StandardCharsets.UTF_8));
			outputStream.flush();
		}
	}
```

### Reader

有了Reader后，就不再需要将byte[]读出来 使用new String()指定编码的方式进行字符串的转换，而是直接使用：

```java
public static void readFile() throws IOException {
		try (Reader reader = new FileReader("C:\\Users\\jiangt1\\Desktop\\test.txt", StandardCharsets.UTF_8)) {
			for (;;) {
				int n = reader.read();
				if (n == -1) {
					break;
				}
				System.out.println((char) n);
			}
		}
	}
```

需要注意的是：`System.out.println((char) 20320);`在内存中使用UTF-8编码，在内存中使用unicode码点表示，因此可以直接使用char 强制转换。
