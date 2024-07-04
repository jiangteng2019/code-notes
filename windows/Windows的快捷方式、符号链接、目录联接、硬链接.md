## Windows的快捷方式、符号链接、目录联接、硬链接

    快捷方式(Shortcut) 这是一种特殊的文件,它像指针一样指向另一个文件/文件夹/程序。双击快捷方式就可以打开它所指向的文件/程序。快捷方式只包含所指目标的位置信息,本身的大小很小。删除快捷方式不会影响目标文件。

    符号链接(Symbolic Link) 这是一种特殊的文件,它存储了指向其他文件的路径。类似于快捷方式,但更为底层。删除符号链接通常不会影响目标文件。符号链接在Windows Vista以后版本支持。

    目录联接(Junction) 这是一种特殊的目录,它如同指针指向另一个目录。用户可以像访问普通目录一样访问联接目录,打开目录里显示目标目录里的内容。删除联接不会影响目标目录。

    硬链接(Hard Link) 硬链接指向文件的物理地址,与原文件共享相同的数据块。删除一个硬链接并不影响其他有相同数据的硬链接,只有当最后一个硬链接被删除后,文件的数据块才会被释放。硬链接不能跨分区或跨驱动器,只读文件无法创建硬链接。

### 示例:

```sh
# 创建原始文件test
echo >> test.txt "hello world"

# 创建符号链接
E:\test>mklink test-symbol.txt test.txt
为 test-symbol.txt <<===>> test.txt 创建的符号链接

# 创建硬链接
E:\test>mklink /H  test-hard.txt test.txt
为 test-hard.txt <<===>> test.txt 创建了硬链接

# 使用图形化工具创建快捷方式，一共生成4个文件

```

```
 E:\test 的目录

2023/12/27  16:32    <DIR>          .
2023/12/27  16:32    <DIR>          ..
2023/12/27  16:32                44 test-hard.txt
2023/12/27  16:27               868 test-lnk.txt.lnk
2023/12/27  16:24    <SYMLINK>      test-symbol.txt [test.txt]
2023/12/27  16:32                44 test.txt
```

分别写入对应的文本

```sh
# 向原始文件中写入 raw
echo >> test.txt "raw"

# 向符号链接中写入 symbol
echo >> test-symbol.txt "symbol"

# 向硬链接中写入 hard
echo >> test-hard.txt "hard"

# 快捷方式中写人 lnk

echo >> test-lnk.txt "lnk"

```

最终的文件内容

```sh
 "hello world"
 "raw"
 "symbol"
 "hard"
```

可以看到快捷方式无法写入。
