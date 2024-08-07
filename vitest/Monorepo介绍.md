## Monorepo介绍

Monorepo进化史

1. 阶段一：单仓库巨石应用， 一个 Git 仓库维护着项目代码，随着迭代业务复杂度的提升，项目代码会变得越来越多，越来越复杂，大量代码构建效率也会降低，最终导致了单体巨石应用，这种代码管理方式称之为 Monolith。

1. 阶段二：多仓库多模块应用，于是将项目拆解成多个业务模块，并在多个 Git 仓库管理，模块解耦，降低了巨石应用的复杂度，每个模块都可以独立编码、测试、发版，代码管理变得简化，构建效率也得以提升，这种代码管理方式称之为 MultiRepo。

1. 阶段三：单仓库多模块应用，随着业务复杂度的提升，模块仓库越来越多，MultiRepo这种方式虽然从业务上解耦了，但增加了项目工程管理的难度，随着模块仓库达到一定数量级，会有几个问题：跨仓库代码难共享；分散在单仓库的模块依赖管理复杂（底层模块升级后，其他上层依赖需要及时更新，否则有问题）；增加了构建耗时。于是将多个项目集成到一个仓库下，共享工程配置，同时又快捷地共享模块代码，成为趋势，这种代码管理方式称之为 MonoRepo。[see](https://juejin.cn/post/7215886869199896637)

很显然，巨石应用在现在流行的微服务架构的开发面前，已经是日渐落幕。从写代码开始接触的就是这种模式。一个项目的所有的功能都放在一个仓库中，尤其是jsp的开发时代，通常前后端的代码都是放在一起的。

后来前后端分离，前后端的项目终于可以分开了，可以各自追求自己的工程化开发模式，提高开发效率。项目的模块多了以后，并且模块与模块之间的关联并不是很大，出来了一个软件项目使用了多个工程目录，实现开发不同的模块。这种的开发模式就是MultiRepo模式。但是写过这种多工程的前端项目都知道，虽然模块之前能够很好的解耦，但是对于项目之前的公共部分的依赖维护是在是太痛苦了。例如登录、主题切换、语言切换，其实这些在生产环境都还好，但是开发环境下的公有组件的维护实在太痛苦了。需要安装私库才能提升一下开发体验。

这里值得一说的是java的多模块模式。maven非常推崇多模块开发，使用专门的模块用于依赖安装。这种开发模式就是通常说的MonoRepo。不得不说这种模式非常灵活也易于维护。如果项目有共有模块依赖，可以单独使用一个模块作为依赖管理；如果应用部署需要使用微服务架构，那么打包的时候可以针对每个模块进行打包；如果线上环境不具备多包部署条件，那么又可以打包成一个单独的jar包。非常灵活，易于应对开发遇到的各种环境的问题。
