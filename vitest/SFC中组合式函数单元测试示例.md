## SFC中组合式函数单元测试示例

与官网的示例不同，官网的示例测试组合式函数指的是，使用了响应式api的函数进行测试，进而分为使用了宿主组件api（onMountend）和未使用宿主组件api的函数。[参见](https://cn.vuejs.org/guide/scaling-up/testing.html#testing-composables)

这里的函数指的是纯粹的工具函数，可以独立运行、也可以在任意地方运行的函数。从实践来说，这一类的函数应该属于工具函数，放在单独的工具utils文件夹下，针对这一类的工具函数，对于单元测试来说应该很简单才对。但是如何不小心将其写在了vue的setup语法糖的组件内部，该如何进行测试呢？

首先将待测试函数进行导出:
```js
function calculateTime(timeStamp: number): Array<number> {
    try {
        const now = Date.now();
        if (timeStamp <= now) {
            return [0, 0, 0, 0];
        }
        // 秒级时间
        const duration = Math.ceil((timeStamp - now) / 1000);
        // 计算天数
        const days = Math.floor(duration / 24 / 3600);
        // 计算小时
        const hours = Math.floor((duration - days * 3600 * 24) / 3600);
        // 计算分钟
        const minutes = Math.floor((duration - days * 3600 * 24 - hours * 3600) / 60);
        // 计算秒数
        const seconds = Math.floor(duration - days * 3600 * 24 - hours * 3600 - minutes * 60);

        return [days, hours, minutes, seconds];

    } catch (error) {
        console.log(error);
        return [0, 0, 0, 0];
    }

}

defineExpose({
    calculateTime
})

```
在单元测试文件内:
```js
// vitest api导入
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
// 导入工具函数mount，用于渲染组件
import { mount } from '@vue/test-utils'

// 对组件的测试流程
describe('LaunchCountdown', () => {
    let wrapper: any;
    let calculateTime: any;

    beforeEach(() => {
        // 使用mount渲染组件
        wrapper = mount(LaunchCountdown);
        // 拿到组件示例以及暴露在组件上的工具函数
        calculateTime = wrapper.vm.calculateTime;
    });

    afterEach(() => {
        wrapper.unmount();
    })

// 针对函数的测试用例
    describe('calculateTime function', () => {
        it('returns an array with four elements', () => {
            const now = Date.now();
            expect(calculateTime(now)).toHaveLength(4);
        });

        it('returns days, hours, minutes, and seconds greater than or equal to 0', () => {
            const now = Date.now();
            const [days, hours, minutes, seconds] = calculateTime(now);

            expect(days).toBeGreaterThanOrEqual(0);
            expect(hours).toBeGreaterThanOrEqual(0);
            expect(minutes).toBeGreaterThanOrEqual(0);
            expect(seconds).toBeGreaterThanOrEqual(0);
        });

        it('returns hours less than 24, and minutes and seconds less than 60', () => {
            const now = Date.now();
            const [, hours, minutes, seconds] = calculateTime(now);

            expect(hours).toBeLessThan(24);
            expect(minutes).toBeLessThan(60);
            expect(seconds).toBeLessThan(60);
        });
    });
});
```