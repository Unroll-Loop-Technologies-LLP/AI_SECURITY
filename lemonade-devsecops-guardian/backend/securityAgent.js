const { analyzeCode } = require('./lemonadeClient');

function normalizeVulnerabilities(result, source = 'inline') {
  const vulnerabilities = Array.isArray(result?.vulnerabilities) ? result.vulnerabilities : [];
  return vulnerabilities.map((item) => ({
    source,
    type: item.type || 'Unknown',
    severity: (item.severity || 'low').toLowerCase(),
    explanation: item.explanation || 'No explanation provided.',
    fix: item.fix || 'No secure fix provided.',
  }));
}

async function analyzeSourceCode(code, source = 'inline') {
  if (!code || typeof code !== 'string') {
    return [];
  }

  const result = await analyzeCode(code);
  return normalizeVulnerabilities(result, source);
}

module.exports = {
  analyzeSourceCode,
};
