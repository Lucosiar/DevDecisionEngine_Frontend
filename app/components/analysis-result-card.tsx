import { AnalyzeResponse } from "../lib/analyze-api";

interface AnalysisResultCardProps {
  result: AnalyzeResponse;
  githubIssueUrl?: string | null;
}

export function AnalysisResultCard({
  result,
  githubIssueUrl,
}: AnalysisResultCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Resultado</h2>

      <dl className="mt-4 space-y-4">
        <div>
          <dt className="text-sm font-medium text-slate-500">Problema</dt>
          <dd className="mt-1 text-slate-800">{result.problem}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Causa</dt>
          <dd className="mt-1 text-slate-800">{result.cause}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Impacto</dt>
          <dd className="mt-1 text-slate-800">{result.impact}</dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Prioridad</dt>
          <dd className="mt-1">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
              {result.priority}
            </span>
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Solucion</dt>
          <dd className="mt-1 text-slate-800">{result.solution}</dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-slate-200 pt-4">
        {githubIssueUrl ? (
          <a
            href={githubIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Crear Issue en GitHub
          </a>
        ) : (
          <p className="text-sm text-slate-500">
            No se pudo construir el link de GitHub para este repositorio.
          </p>
        )}
      </div>
    </section>
  );
}
