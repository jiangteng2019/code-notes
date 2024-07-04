## mybatis通过注解生成条件查询sql

MyBatis 是一个流行的 Java ORM（对象关系映射）框架，它可以通过 XML 配置文件或注解来实现查询。针对条件查询，MyBatis 提供了灵活的方式来构建动态 SQL 语句，以适应不同的查询条件。使用注解实现条件查询是完全可行的，以下是一些基本的步骤和示例来说明如何使用 MyBatis 注解来进行条件查询：

### 1. 使用 `@Select` 注解

你可以使用 `@Select` 注解直接在接口方法上写 SQL 语句。如果查询条件是固定的，这种方法非常直接。例如：

```java
@Select("SELECT * FROM users WHERE age = #{age}")
List<User> selectUsersByAge(@Param("age") int age);
```

### 2. 使用 `@SelectProvider` 注解实现动态 SQL

如果你需要根据不同的条件动态构建 SQL 语句，可以使用 `@SelectProvider` 注解。这种方法允许你指定一个类和方法来动态生成 SQL 语句。例如：

```java
public class SqlProvider {
    public String selectUsersByDynamicCondition(Map<String, Object> params) {
        StringBuilder sql = new StringBuilder("SELECT * FROM users WHERE 1=1");
        if (params.get("name") != null) {
            sql.append(" AND name = #{name}");
        }
        if (params.get("age") != null) {
            sql.append(" AND age = #{age}");
        }
        return sql.toString();
    }
}

@SelectProvider(type = SqlProvider.class, method = "selectUsersByDynamicCondition")
List<User> selectUsersByConditions(@Param("name") String name, @Param("age") Integer age);
```

在这个例子中，`SqlProvider` 类包含一个方法 `selectUsersByDynamicCondition`，它根据传入的参数构建 SQL。这种方法的优势在于它允许灵活地添加或省略条件，从而生成更复杂的查询。

### 3. 使用 MyBatis 动态 SQL 注解

MyBatis 也支持在注解中直接使用动态 SQL，例如使用 `@Select` 注解结合 `<if>` 标签来构建动态查询：

```java
@Select("<script>" +
        "SELECT * FROM users" +
        "<where>" +
        "  <if test='name != null'>" +
        "    AND name = #{name}" +
        "  </if>" +
        "  <if test='age != null'>" +
        "    AND age = #{age}" +
        "  </if>" +
        "</where>" +
        "</script>")
List<User> selectByDynamicFields(@Param("name") String name, @Param("age") Integer age);
```

这种方式允许你在注解中直接使用 MyBatis 的动态 SQL 功能，非常适合条件较多的复杂查询。

总结来说，使用 MyBatis 注解进行条件查询非常灵活和强大。你可以选择直接写固定的 SQL 语句，或者使用 `@SelectProvider` 或动态 SQL 特性来根据不同的运行时条件动态构建查询语句。
