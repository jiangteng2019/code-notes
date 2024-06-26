## mybatis分页插件PageHelper实现原理

PageHelper是一个MyBatis的插件，用于简化MyBatis中的分页查询操作。它的实现原理大致如下：

初始化分页参数：当你调用PageHelper.startPage(pageNum, pageSize)时，PageHelper会根据传入的pageNum（当前页码）和pageSize（每页记录数）初始化一个Page对象，并将其放入线程本地变量（ThreadLocal）中。这意味着分页参数是按线程隔离的，不会影响到其他线程的查询。

拦截SQL执行：PageHelper作为一个MyBatis的插件，会在SQL执行前被调用。它通过MyBatis的拦截器机制（Interceptor）拦截到即将执行的SQL语句，然后根据之前设置的分页参数动态修改SQL，添加对应的分页限制语句。例如，在MySQL中，它会将原始的SQL转换为带有LIMIT offset, count形式的SQL，其中offset是根据页码和页面大小计算得出的偏移量，count是每页显示的记录数。

执行查询：修改后的SQL被执行，数据库返回的是分页后的结果集。

结果处理：查询完成后，PageHelper不对结果集做任何额外处理，直接返回给调用者。但此时，由于SQL已经被限制了返回结果的数量，所以你得到的就是分页后的数据。

构建PageInfo对象：在你的代码中，通过PageInfo<DirectiveSheetEntity> pageInfo = new PageInfo<>(directiveSheetEntities);创建了一个PageInfo对象。这个对象不仅包含了分页查询的结果数据，还自动计算出了总页数、总记录数等分页信息，方便你在业务代码中使用。

综上所述，PageHelper通过拦截SQL执行并在执行前动态修改SQL来实现分页，简化了开发者手动编写分页逻辑的过程，提高了开发效率。

### QA：PageInfo中的总数是如何得出的？

PageInfo对象实例化时并不会重新查询数据库来计算总记录数。当你通过
```java
PageInfo<DirectiveSheetEntity> pageInfo = new PageInfo<>(directiveSheetEntities);
```
PageHelper会在修改SQL执行计数查询（Count Query）来获取总数，这个计数查询通常会在分页查询之前执行，因此在结果集返回给PageInfo构造方法时，总数信息已经通过之前的计数查询获得，并存储在PageHelper管理的上下文中。当创建PageInfo对象时，它会尝试从这个上下文中获取总数，而不需要再次查询数据库。