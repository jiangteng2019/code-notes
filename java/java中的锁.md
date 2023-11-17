1. ReadWriteLock 与 StampedLock 分别属于什么锁？

        ReadWriteLock 和 StampedLock 都是 Java 提供的锁机制，它们各自有不同的特性和使用场景。

        1. ReadWriteLock：这是一种读写锁，它允许多个线程同时读取，但只允许一个线程写入。这种锁适合读操作远多于写操作的场景。ReadWriteLock 提供了两个锁，一个是读锁，一个是写锁。通过它可以解决一些读写问题，比如读读共享，读写互斥，写写互斥。

        2. StampedLock：这是 Java 8 引入的一种新的锁机制，它也支持读写锁的功能，但比 ReadWriteLock 更强大。StampedLock 提供了三种模式的锁，分别是写锁、读锁和乐观读。乐观读是一种更加轻量级的锁，适用于读操作远多于写操作的场景。StampedLock 的性能优于 ReadWriteLock，但使用起来更复杂，需要更小心地管理锁的状态。

        总的来说，ReadWriteLock 是一种悲观锁，而 StampedLock 则提供了乐观锁的功能。