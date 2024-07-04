## spring的@Autowired与@Resource注解区别

`@Autowired` 和 `@Resource` 都是 Spring 框架中用于依赖注入的注解，但它们在功能和使用方式上有一些区别：

1. **来源**:

    - `@Autowired`: 属于 Spring 框架的一部分。
    - `@Resource`: 属于 Java 标准（JSR-250），是 Java EE 的一部分。

2. **注入方式**:

    - `@Autowired`: 默认按照类型（Type）进行自动装配。当有多个类型匹配时，它会考虑使用 `@Qualifier` 注解进行进一步的限定。
    - `@Resource`: 默认按照名称（Name）进行注入。如果没有指定名称，它会退回到按类型注入。可以通过 `name` 属性指定要注入的 bean 的名称。

3. **是否必须**:

    - `@Autowired`: 默认情况下，被注解的依赖是必须的。如果要使其成为可选依赖，可以将 `required` 属性设置为 `false`。
    - `@Resource`: 默认情况下也是必须的，但没有类似 `@Autowired` 的 `required` 属性来将其设置为可选。

4. **注入点**:

    - `@Autowired`: 可以用于构造器、setter 方法、属性和自定义方法。
    - `@Resource`: 同样可以用于方法、字段和注解类型，但不支持构造器注入。

5. **处理过程**:
    - `@Autowired`: 由 Spring 的自动装配机制处理。
    - `@Resource`: 由 Java EE 的命名和目录接口（JNDI）处理。

总结：

-   如果你完全在 Spring 环境中工作，且更关注按类型的注入，使用 `@Autowired` 可能更合适。
-   如果你需要跨多个框架或需要更具体的依赖注入控制（例如，按名称注入），`@Resource` 可能是更好的选择。

选择哪一个注解通常取决于你的具体需求和项目的上下文。
