## java中Entity转VO方法

在Java中，将Entity（实体）转换为VO（Value Object，视图对象）是一种常见的做法，用于分离数据访问层和展示层，提高代码的安全性和灵活性。以下是一些常用的转换方法：

### 1. 手动转换

手动创建转换方法是最直接的方式，适用于字段不多的情况。

```java
// Entity 类
public class UserEntity {
    private Long id;
    private String username;
    private String password;
    // 省略getter和setter
}

// VO 类
public class UserVO {
    private Long id;
    private String username;
    // 注意：不包含敏感信息，如password
    // 省略getter和setter
}

// 转换方法
public UserVO convertEntityToVo(UserEntity userEntity) {
    UserVO userVo = new UserVO();
    userVo.setId(userEntity.getId());
    userVo.setUsername(userEntity.getUsername());
    return userVo;
}
```

### 2. 使用ModelMapper库

ModelMapper是一个智能对象映射库，可以自动将对象属性从源对象映射到目标对象。

首先，需要在项目中引入ModelMapper依赖：

```xml
<!-- Maven 示例 -->
<dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>2.4.4</version>
</dependency>
```

然后，使用ModelMapper进行转换：

```java
import org.modelmapper.ModelMapper;

public class Converter {
    private ModelMapper modelMapper = new ModelMapper();

    public UserVO convertEntityToVo(UserEntity userEntity) {
        return modelMapper.map(userEntity, UserVO.class);
    }
}
```

### 3. Lombok的@Mapper注解（需配合MapStruct）

Lombok的@Mapper注解需要与MapStruct一起使用，MapStruct是一个代码生成器，可以大大简化对象之间的映射。

首先，安装MapStruct插件并添加依赖：

```xml
<!-- Maven 示例 -->
<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.4.2.Final</version>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.4.2.Final</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

然后，使用Lombok和MapStruct注解定义转换接口：

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import lombok.experimental.UtilityClass;

@Mapper
public interface UserConverter {

    @Mapping(source = "password", ignore = true) // 忽略不需要映射的字段
    UserVO entityToVo(UserEntity entity);
}
或者，如果你喜欢使用@UtilityClass，MapStruct也支持：
```

```java
@UtilityClass
public class UserConverter {

    public UserVO entityToVo(UserEntity entity) {
        // MapStruct自动生成的代码会在这里处理转换逻辑
        return null; // 实际上这行代码会被MapStruct覆盖
    }
}
```

注意，使用MapStruct需要编译时生成额外的转换类，确保构建工具配置正确。

总结

1. 手动转换灵活但工作量大，适合简单场景。
1. ModelMapper自动化程度高，适用于快速开发。
1. MapStruct + Lombok提供了高度自定义和高效的转换，但需要额外的配置和学习成本。

接下来演示一下如何通过ModelMapper 封装工具类，实现更加通用的转换方法：

### 4. 通用转换工具类

```java
package com.geespace.directive.utils;

import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class Converter {
    private static final ModelMapper modelMapper = new ModelMapper();

    // 已有的单个对象转换方法
    public static <E, V> V convertEntityToVo(E entity, Class<V> voClass) {
        return modelMapper.map(entity, voClass);
    }

    // 新增的集合转换方法
    public static <E, V> List<V> convertEntitiesToVos(List<E> entities, Class<V> voClass) {
        return entities.stream().map(entity -> convertEntityToVo(entity, voClass)).collect(Collectors.toList());
    }
}
```
