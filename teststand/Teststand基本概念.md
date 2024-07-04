## TestStand基本概念

在TestStand中，通过序列文件（Sequence File）、主序列（Main Sequence）、子序列（Subsequence）、步骤组（Step Group）、步骤（Step）这种树状结构来组织不同的测试和操作。

1. 步骤（Step）步骤是TestStand测试程序中的最小单元，无论多么复杂的测试程序也是由许多步骤构成的。
2. 代码模块（Code Module）一个步骤可以调用不同应用开发环境编写的代码模块，这是TestStand的一大特点。TestStand是如何识别这些代码模块并与其进行数据交互的呢？这得借助于模块适配器（Module Adapter）。
3. 序列（Sequence）序列是一系列步骤的有序组合。将不同的步骤按顺序排列，就形成了一个序列。
4. 步骤组（Step Groups）为了更好地对步骤进行组织，TestStand将每个序列分成三个步骤组，分别是设置组（Setup Group）、主体组（Main Group）、清理组（Cleanup Group）。每个步骤组里面包含一系列步骤。[插图]设置组：一般包含初始化仪器、治具、待测件，以及资源分配的步骤。[插图]主体组：即序列的主体部分，包含大部分步骤，如待测件的测试。[插图]清理组：通常包含关闭系统电源，恢复测试仪器、治具、待测件到初始状态，资源的释放和关闭等操作。
5. 序列文件（Sequence File）在TestStand树状结构的最顶端是序列文件。一个序列文件中可以包含多个序列。
