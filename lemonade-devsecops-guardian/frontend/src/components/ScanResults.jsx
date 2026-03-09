import VulnerabilityCard from './VulnerabilityCard';

export default function ScanResults({ vulnerabilities, onExport }) {
  return (
    <section className="panel space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neon">Scan Results</h3>
        <button
          type="button"
          onClick={onExport}
          className="rounded-md border border-zinc-600 px-4 py-2 text-sm"
        >
          Export JSON Report
        </button>
      </div>

      {vulnerabilities.length === 0 ? (
        <p className="text-sm text-zinc-400">No vulnerabilities found yet. Start a scan.</p>
      ) : (
        <div className="space-y-3">
          {vulnerabilities.map((vuln, index) => (
            <VulnerabilityCard key={`${vuln.type}-${index}`} vulnerability={vuln} />
          ))}
        </div>
      )}
    </section>
  );
}
