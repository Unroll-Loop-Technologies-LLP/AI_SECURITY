const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const simpleGit = require('simple-git');
const { analyzeSourceCode } = require('./securityAgent');

const SCANNED_EXTENSIONS = new Set(['.js', '.ts', '.py', '.java']);

async function collectSourceFiles(dir, output = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectSourceFiles(fullPath, output);
      continue;
    }

    if (SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      output.push(fullPath);
    }
  }

  return output;
}

async function scanRepository(repoUrl) {
  const tempBase = await fs.mkdtemp(path.join(os.tmpdir(), 'lemonade-scan-'));
  const clonePath = path.join(tempBase, 'repo');
  const git = simpleGit();

  try {
    await git.clone(repoUrl, clonePath, ['--depth', '1']);

    const files = await collectSourceFiles(clonePath);
    const vulnerabilities = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const relPath = path.relative(clonePath, file);
      const results = await analyzeSourceCode(content, relPath);
      vulnerabilities.push(...results);
    }

    return {
      scannedFiles: files.length,
      vulnerabilities,
    };
  } finally {
    await fs.rm(tempBase, { recursive: true, force: true });
  }
}

module.exports = {
  scanRepository,
};
