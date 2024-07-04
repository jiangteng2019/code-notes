## typescript中的泛型

### 编写一个泛型函数

```typescript
function identity<Type>(arg: Type): Type {
    return arg
}
```

### 泛型类型

将函数赋值给变量，编译器会自动推断变量类型。当然也可以写上。

```typescript
let myIdentity: <Type>(arg: Type) => Type = identity
```

### 泛型约束

```typescript
let myIdentity1: <Type extends string>(arg: Type) => Type = identity
```

### 泛型约束中使用类型参数

```typescript
function getProperty<T, Key extends keyof T>(obj: T, key: Key) {
    return obj[key]
}
getProperty(window, 'name')
```
