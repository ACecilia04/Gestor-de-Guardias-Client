const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '.');
const outputFile = path.resolve(__dirname, 'dashboard.html');

let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard de Archivos</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    pre { background: #f4f4f4; padding: 10px; border: 1px solid #ccc; overflow-x: auto; }
    h2 { color: #2c3e50; }
    .file-block { margin-bottom: 40px; }
  </style>
</head>
<body>
  <h1>Contenido de archivos en ${path.basename(rootDir)}</h1>
`;

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);

    // Excluir node_modules
    if (stat.isDirectory()) {
      if (file === 'node_modules') continue;
      walk(fullPath);
    } else {
      let content = '';
      try {
        content = fs.readFileSync(fullPath, 'utf-8');
      } catch (err) {
        content = '[Error al leer el archivo]';
      }

      html += `
        <div class="file-block">
          <h2>${relativePath}</h2>
          <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>
      `;
    }
  }
}

walk(rootDir);

html += `
</body>
</html>
`;

fs.writeFileSync(outputFile, html);
console.log(`✅ Dashboard generado en: ${outputFile}`);
