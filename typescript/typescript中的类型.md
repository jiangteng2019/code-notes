## typescript中的类型

### 常见类型

```ts
// 数字
let n: number = 123
// 字符串
let s: string = '123'
// 布尔值
let b: boolean = false
// 数组
let a: Array<number> = [1, 2, 3]
// any类型
let an: any = undefined
```

> TypeScript 不使用像 int x = 0; 这样的 "types on the left" 风格的声明。 **类型注释将始终在输入的内容之后。**

### 函数类型

```ts
function parse(s: string): number {
    return parseInt(s)
}
```

**匿名函数会自动被赋予类型**

### 对象类型

```ts
function printCoord(pt: { x: number; y: number }) {
    console.log("The coordinate's x value is " + pt.x)
    console.log("The coordinate's y value is " + pt.y)
}
```

对象属性是可选的

```ts
function printName(obj: { first: string; last?: string }) {
    // ...
}
```
