type Labels = Record<string, string | number | boolean>;

const counters: Record<string, Record<string, number>> = {};

function labelKey(labels: Labels) {
  return Object.entries(labels)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}="${v}"`)
    .join(",");
}

export function incCounter(name: string, labels: Labels = {}, value = 1) {
  const key = labelKey(labels);
  if (!counters[name]) counters[name] = {};
  counters[name][key] = (counters[name][key] ?? 0) + value;
}

export function formatPrometheus(): string {
  const lines: string[] = [];
  for (const [metric, series] of Object.entries(counters)) {
    for (const [labelStr, val] of Object.entries(series)) {
      const labelsFormatted = labelStr ? `{${labelStr}}` : "";
      lines.push(`${metric}${labelsFormatted} ${val}`);
    }
  }
  return lines.join("\n");
}

