import { AnalyzeFinding, AnalyzeResponse } from "../lib/analyze-api";
import { GithubIssueDraft } from "../lib/github-issue";

interface AnalysisResultCardProps {
  result: AnalyzeResponse;
  githubIssues: GithubIssueDraft[];
}

export function AnalysisResultCard({
  result,
  githubIssues,
}: AnalysisResultCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Resultado</h2>
            <details className="group relative">
              <summary className="flex h-6 w-6 cursor-pointer list-none items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-600 transition hover:border-sky-400 hover:text-sky-600">
                ?
              </summary>
              <div className="absolute left-0 top-8 z-10 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-xl">
                <p>
                  Ese porcentaje es la confidence que devuelve el análisis para
                  cada hallazgo. Intenta representar cuánta seguridad tiene el
                  sistema de que ese problema está bien identificado.
                </p>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li>
                    90-100%: el problema parece muy claro por el código o el
                    stacktrace.
                  </li>
                  <li>
                    70-89%: es bastante probable, pero puede faltar algo de
                    contexto.
                  </li>
                  <li>40-69%: es una hipótesis razonable, no una certeza.</li>
                  <li>{`<40%: diagnóstico débil o muy incompleto.`}</li>
                </ul>
                <p className="mt-3 text-slate-600">
                  Importante: no es una métrica real calculada con pruebas
                  automáticas. Ahora mismo es una estimación del modelo, útil
                  para priorizar, pero no debería interpretarse como garantía
                  matemática.
                </p>
                <p className="mt-3 text-slate-600">
                  Si hace falta, esto se puede cambiar por niveles tipo Alta /
                  Media / Baja certeza o quitarse del frontend.
                </p>
              </div>
            </details>
          </div>
          <p className="mt-1 text-sm text-slate-600">{result.summary}</p>
        </div>
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          {result.findings.length} hallazgo{result.findings.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {result.findings.map((finding, index) => {
          const githubIssue = githubIssues.find(
            (issue) => issue.findingIndex === index,
          );

          return (
            <article
              key={`${finding.problem}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">
                  {index + 1}. {finding.problem}
                </h3>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={finding.priority} />
                  <span className="text-xs font-medium text-slate-500">
                    {finding.confidence}% confianza
                  </span>
                </div>
              </div>

              <dl className="mt-4 space-y-4">
                <Field label="Causa" value={finding.cause} />
                <Field label="Impacto" value={finding.impact} />
                <Field label="Solución" value={finding.solution} />
                <Field label="Próxima acción" value={finding.nextAction} />
              </dl>

              <div className="mt-5 border-t border-slate-200 pt-4">
                {githubIssue ? (
                  <a
                    href={githubIssue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    Crear issue de este problema
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">
                    No se pudo construir el link de GitHub para este hallazgo.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-800">{value}</dd>
    </div>
  );
}

function PriorityBadge({ priority }: Pick<AnalyzeFinding, "priority">) {
  const className =
    priority === "HIGH"
      ? "bg-rose-100 text-rose-800"
      : priority === "MEDIUM"
        ? "bg-amber-100 text-amber-800"
        : "bg-emerald-100 text-emerald-800";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${className}`}
    >
      {priority}
    </span>
  );
}
