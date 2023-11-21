- 新建一个空白文件夹 empty
- 待删除的文件夹为dist
- 使用命令：

```sh
robocopy empty dist /purge
robocopy empty_dir will_delete_dir /purge
```
robocopy: 这是 Windows 中的一个命令行实用程序，用于复制文件和目录。

empty_dir: 这是要复制的源目录。

will_delete_dir: 这是目标目录，如果存在同名文件或目录，它们将被删除。

/purge: 这是一个选项，表示在目标目录中删除任何与源目录不匹配的文件和目录。

因此，这个命令的含义是将 empty_dir 目录中的内容复制到 will_delete_dir 目录中，并使用 /purge 选项来确保目标目录中没有源目录中不存在的文件或目录。请注意，在使用此命令时要格外小心，因为它会删除目标目录中的文件和目录。