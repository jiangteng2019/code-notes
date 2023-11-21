const markdownIt = require('markdown-it');
const fs = require('fs');
const filePath = process.argv[2];

const md = markdownIt({
    html: true,
    typographer: true,
});

function compileMarkdown() {
    try {
        console.log(filePath)
        if (!filePath) {
            console.log("filePath not exit");
            return;
        }
        // 读取文件内容
        const fileContent = fs.readFileSync(filePath, 'utf8');
        // 渲染 Markdown 内容
        const html = md.render(fileContent);
        return html; // 返回渲染后的 HTML 内容
    } catch (error) {
        console.log(error);
    }
}

const renderedHtml = compileMarkdown();
console.log(renderedHtml); // 输出渲染后的 HTML 内容