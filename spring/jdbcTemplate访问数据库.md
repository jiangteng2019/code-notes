## jdbcTemplate访问数据库

jdbcTemplate 提供了很多SQL查询方法；需要注意的是，为了简化查询代码，jdbcTemplate的查询方法中大量使用了Lambda表达式。使用的时候需要注意一下。

初始化一个jdbcTemplate 需要一个DataSource对象。

> 
    1. 针对简单查询，优选query()和queryForObject()，因为只需提供SQL语句、参数和RowMapper；
    2. 针对更新操作，优选update()，因为只需提供SQL语句和参数；
    3. 任何复杂的操作，最终也可以通过execute(ConnectionCallback)实现，因为拿到Connection就可以做任何JDBC操作。

### 声明式事务

新建一个事务管理器对象
```java
@Bean
    PlatformTransactionManager createTxManager(@Autowired DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }
```

或者使用声明式的事务实现:
```java
@Configuration
@ComponentScan
@EnableTransactionManagement // 启用声明式
@PropertySource("jdbc.properties")
public class AppConfig {
    ...
}
```

使用的时候,只需要在方法或者类上加上:
```java
@Transactional
```

如果有多数据源，创建多数据源:
```java
@Bean
public PlatformTransactionManager primaryTransactionManager(@Qualifier("primaryDataSource") DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}

@Bean
public PlatformTransactionManager secondaryTransactionManager(@Qualifier("secondaryDataSource") DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}
```

使用多数据源:
```java
@Transactional(transactionManager = "primaryTransactionManager")
public void somePrimaryDbOperation() {
    // 操作主数据库
}

@Transactional(transactionManager = "secondaryTransactionManager")
public void someSecondaryDbOperation() {
    // 操作次数据库
}
```
事务管理器的名字通常是指创建它的@Bean方法的名字， primaryTransactionManager 就是这个事务管理器的名字。

创建事务管理器指定一个别名:
```java
@Bean(name = {"primaryTransactionManager", "transactionManagerPrimary"})
public PlatformTransactionManager primaryTransactionManager(DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}
```

primaryTransactionManager这个事务管理器有两个名字："primaryTransactionManager"和"transactionManagerPrimary"。在@Transactional注解中使用任意一个名字来引用这个事务管理器。

如果使用了多数据源，但没有手动创建，而是使用EnableTransactionManagement 声明式开启:
而使用时，如果没有明确指定事务管理器，Spring将会使用第一PlatformTransactionManager Bean。

### 总结：

- @EnableTransactionManagement仅启用声明式事务管理，不指定具体的事务管理器。
- 在多数据源环境中，应明确指定所需的事务管理器，以避免混淆。
- 为每个数据源定义独立的事务管理器，并在@Transactional注解中指定它们，以确保事务正确处理。