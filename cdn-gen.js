const fs = require('fs');
const path = require('path');

const cdnFolder = path.join(__dirname, 'cdn');
const outputFilePath = path.join(__dirname, 'cdn.html');

function generateTree(dir, baseUrl, depth = 0) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    let tree = `${'  '.repeat(depth)}<ul>\n`;

    items.forEach(item => {
        const itemPath = path.join(dir, item.name);
        const relativePath = path.relative(cdnFolder, itemPath);
        const url = `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;

        if (item.isDirectory()) {
            tree += `${'  '.repeat(depth + 1)}<li>${item.name}\n${generateTree(itemPath, baseUrl, depth + 2)}${'  '.repeat(depth + 1)}</li>\n`;
        } else {
            tree += `${'  '.repeat(depth + 1)}<li><a href="${url}">${item.name}</a></li>\n`;
        }
    });

    tree += `${'  '.repeat(depth)}</ul>\n`;
    return tree;
}

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CDN Directory</title>
</head>
<body>
  <h1>CDN Directory</h1>
  ${generateTree(cdnFolder, 'cdn')}
</body>
</html>
`;

fs.writeFileSync(outputFilePath, htmlContent, 'utf8');
console.log(`CDN HTML file generated at ${outputFilePath}`);