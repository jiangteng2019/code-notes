## http协议

http协议由header 和 body组成:第一行总是请求方法 路径 HTTP版本如:

```
GET / HTTP/1.1
```

-   每一行都是固定的Header: Value格式
-   以一个空行分隔http 的 header 和 body
-   GET请求一般不可以有body，但是大部分服务器并没有做限制
-   Content-Type 用于指定body的编码方式，一般是 application/json, 和application/x-www-form-urlencoded

响应的第一行总是HTTP版本 响应代码 响应说明 如：

```
HTTP/1.1 200 OK
```

### 不同的状态码有不同的含义:

-   1XX 协议切换
-   2XX 成功
-   3XX 重定向
-   4XX 找不到
-   5XX 内部错误

### http协议经历过不同阶段：

-   HTTP/1.0 一次发送一个http请求，请求完成后关闭
-   HTTP/1.1 允许在一个TCP连接中反复发送和响应,但只能按顺序一问一答请求,其中重复发送是通过http请求keep-alive 协商的
-   HTTP/2.0 可以同时发送多个请求

### 原始的请求头:

```
GET /satcdapi/system/meta/earthStation/simple/tree HTTP/1.1
Host: 10.139.203.23
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0
Accept: application/json, text/plain, */*
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Authorization:
Connection: keep-alive
Referer: http://10.139.203.23/
```

### 原始的响应头：

```
HTTP/1.1 200 OK
Server: nginx/1.22.1
Date: Wed, 22 Nov 2023 07:35:47 GMT
Content-Type: application/json;charset=UTF-8
Content-Length: 45
Connection: keep-alive
```

### HTTP/1.1和HTTP/1.0重要的区别：

-   持久连接：HTTP/1.1默认使用持久连接，即在单个TCP连接上可以发送和接收多个HTTP请求和响应。这可以减少建立和关闭连接的开销，提高性能。而HTTP/1.0默认情况下不支持持久连接，每个请求/响应都需要建立一个新的TCP连接。

-   Host头：HTTP/1.1引入了Host头，这使得可以在同一个IP地址上托管多个域名的网站。在HTTP/1.0中，一个IP地址只能托管一个域名的网站。

-   缓存控制：HTTP/1.1引入了更多的缓存控制机制，包括强缓存、协商缓存等，以提高缓存的效率和灵活性。HTTP/1.0的缓存控制相对简单。

-   错误通知：HTTP/1.1引入了更多的状态码，以便更准确地描述请求的处理情况。HTTP/1.0的状态码相对较少。

-   传输编码：HTTP/1.1引入了分块传输编码，可以在传输过程中动态压缩数据，提高传输效率。HTTP/1.0不支持分块传输编码。

-   范围请求：HTTP/1.1支持范围请求，客户端可以请求资源的某个部分，而不是整个资源。HTTP/1.0不支持范围请求。

### HTTP/1.1和HTTP/2.0重要的区别：

-   多路复用（Multiplexing）：HTTP/2.0支持多路复用，允许多个请求同时在单个TCP连接上进行。这意味着可以更有效地利用连接，减少了建立和关闭连接的开销，提高了性能。

-   二进制分帧（Binary Framing）：HTTP/2.0在传输时采用二进制格式，而不是像HTTP/1.1那样的文本格式。这使得数据传输更加高效，减少了解析数据的复杂性。

-   头部压缩（Header Compression）：HTTP/2.0使用HPACK算法对请求和响应头部进行压缩，减少了数据传输的大小，提高了效率。

-   服务器推送（Server Push）：HTTP/2.0支持服务器推送功能，服务器可以在客户端请求之前将相关的资源推送给客户端，提高了性能和加载速度。

-   优化性能：HTTP/2.0的设计旨在优化性能，减少延迟和提高加载速度，通过上述特性可以更好地满足现代网络应用的需求。
