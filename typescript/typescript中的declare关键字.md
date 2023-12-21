## typescript中的declare关键字

在 TypeScript 中，declare 关键字用于声明变量、类型、函数、类或任何其他类型的实体，而不需要定义其具体的实现。这在多种场景下非常有用，尤其是当你想要在 TypeScript 中使用已存在的 JavaScript 代码或库时。通过 declare，可以告诉 TypeScript 这些实体的类型，以便于进行类型检查，而无需担心实际的实现细节。

### 使用场景
1. 声明全局变量：当你在一个模块化的 TypeScript 环境中使用全局变量（可能是由第三方库或旧的 JavaScript 代码创建的）时，可以使用 declare 来告知 TypeScript 这些变量的存在和类型。

1. 声明模块：当使用未包含 TypeScript 类型定义的 JavaScript 库时，可以使用 declare module 来定义这个库的类型。

1. 声明类型、接口和其他结构：可以使用 declare 来定义复杂的类型、接口、类等，这些可能是描述第三方代码库的结构。

### 示例
1. 声明全局变量：

假设你有一个全局变量 myGlobalVar 在你的项目中，由另一个脚本或第三方库创建，你可以这样声明它：

```typescript
declare var myGlobalVar: string;
console.log(myGlobalVar);  // 可以安全地使用 myGlobalVar
```


1. 声明模块：

如果你正在使用一个 JavaScript 库，例如 some-library，但这个库没有提供 TypeScript 类型定义，你可以这样声明它的模块：

```typescript
declare module 'some-library' {
  export function someFunction(): void;
}
import { someFunction } from 'some-library';
someFunction();  // 现在 TypeScript 知道 someFunction 的存在和类型
```

1. 声明类型和接口：

可以使用 declare 来定义全局类型或接口，这在定义全局的自定义类型时非常有用：

```typescript
declare interface MyGlobalInterface {
  name: string;
  age: number;
}
declare type MyGlobalType = {
  id: string;
  timestamp: number;
};
```
这些类型和接口可以在你的整个项目中使用，无需导入。

### 总结
declare 关键字在 TypeScript 中充当了一个重要的角色，特别是在将 TypeScript 集成到现有的 JavaScript 项目或使用没有自带类型定义的第三方库时。通过声明实体的类型，你可以享受到 TypeScript 的强类型检查和自动完成功能，同时避免对现有代码做出太多修改。