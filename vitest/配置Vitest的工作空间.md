## 配置 Vitest 的工作空间

在一个多包仓库（monorepo）环境中。假设我们有一个使用 Yarn Workspaces 或 Lerna 管理的项目，其中包含多个独立的包。我们将设置 Vitest，以便它能够在每个包中运行相应的测试。

目录结构示例:

```
my-monorepo/
├── packages/
│   ├── package-a/
│   │   ├── src/
│   │   ├── tests/
│   │   └── vitest.config.unit.ts
│   ├── package-b/
│   │   ├── src/
│   │   ├── tests/
│   │   └── vitest.config.e2e.ts
│   └── package-c/
│       ├── src/
│       ├── tests/
│       └── vitest.config.ts
└── vitest.workspace.ts
```
### 根级别配置 (vitest.workspace.ts)
在根目录下，你创建一个 vitest.workspace.ts 文件，用于指定 Vitest 应该搜索哪些配置文件：

```typescript
// vitest.workspace.ts
export default ['packages/*/vitest.config.{e2e,unit}.ts'];
```
这个配置告诉 Vitest 去搜索 packages 目录下每个子目录中的 vitest.config.e2e.ts 和 vitest.config.unit.ts 文件。

### 包级别配置

每个包可以有自己的 Vitest 配置文件。例如，对于 package-a，有一个专门针对单元测试的配置文件：

```typescript
// packages/package-a/vitest.config.unit.ts
export default {
  // Vitest 配置选项，例如测试匹配模式、环境变量等
  testMatch: ['**/tests/unit/**/*.test.ts'],
  // 其他配置...
};
```
对于 package-b，你可能有一个针对端到端测试的配置：

```typescript
// packages/package-b/vitest.config.e2e.ts
export default {
  // 专门针对 E2E 测试的配置
  testMatch: ['**/tests/e2e/**/*.test.ts'],
  // 其他配置...
};
```
### 运行测试
配置完成后，你可以在根目录下运行 Vitest，它会自动根据 vitest.workspace.ts 中定义的模式，去寻找并使用相应的配置文件。

```shell
npx vitest
```
这个命令将会遍历 packages 目录中的每个包，根据每个包中的配置文件运行测试。

### 小结
通过这种方式，Vitest 能够在一个包含多个包的大型项目中灵活地运行测试，每个包都有自己的专门配置，从而实现高效和有针对性的测试管理