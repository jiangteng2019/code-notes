const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const md = new markdownIt();

const convertDirectory = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            convertDirectory(fullPath); // 递归子目录
        } else if (path.extname(fullPath) === '.md') {
            let markdown = fs.readFileSync(fullPath, 'utf-8');
            let html = md.render(markdown);
            let htmlPath = fullPath.replace('.md', '.html');
            fs.writeFileSync(htmlPath, html);
        }
    });
};

convertDirectory('./'); // 替换为Markdown文件所在的目录