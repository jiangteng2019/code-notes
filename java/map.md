### java中的HashMap实现

1. java中的 HashMap 内部使用数组储存值;
2. 由于map需要判断对应的键是否相等，和通过键的哈希值计算索引，所以作为键的对象需要实现equals 和 hashcode 方法;
3. HashMap初始化时默认的数组大小只有16
4. 