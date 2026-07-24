"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
};

function sanitizeSvg(svg: string) {
  return svg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chartId = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          securityLevel: "loose",
          startOnLoad: false,
          theme: "default",
        });

        const result = await mermaid.render(`mermaid-${chartId}`, chart);

        if (!cancelled) {
          setSvg(sanitizeSvg(result.svg));
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setSvg(null);
          setError("Could not render mermaid diagram.");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, chartId]);

  if (error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="rounded-md border border-neutral-200 px-4 py-3 text-sm text-neutral-500 dark:border-zinc-800 dark:text-zinc-400">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-md border border-neutral-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
