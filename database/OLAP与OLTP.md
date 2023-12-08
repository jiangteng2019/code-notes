OLAP与OLTP数据库

OLAP 意思是 On-Line Analytical Processing 联机分析处理，Clickhouse 就是典型的 OLAP 联机分析型数据库管理系统。OLAP 主要针对数据进行复杂分析汇总操作，业务系统每天都对当天所有运输团单做汇总统计，计算出每个省区的妥投率，这个操作就属于 OLAP 类数据处理。

OLTP 类数据处理，意思是 On-Line Transaction Processing 联机事务处理，要求系统实时进行数据操作的响应，需要支持事务，Mysql、Oracle、SQLServer 等都是 OLTP 型数据库。