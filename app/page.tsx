"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnalysisResultCard } from "./components/analysis-result-card";
import {
  AnalyzeRequest,
  AnalyzeRepository,
  AnalyzeResponse,
  analyzeRepository,
  fetchRepositories,
} from "./lib/analyze-api";
import { buildGithubIssueUrls } from "./lib/github-issue";

const ERROR_INPUT_MAX_LENGTH = 8000;
const ANALYSIS_LOADING_STEPS = [
  "IA leyendo código...",
  "IA extrayendo errores...",
  "IA priorizando impacto...",
  "IA preparando decisiones accionables...",
] as const;
const ANALYSIS_LOADING_STEP_DELAYS = [1400, 1800, 2400] as const;

export default function Home() {
  const [repositories, setRepositories] = useState<AnalyzeRepository[]>([]);
  const [selectedRepositoryUrl, setSelectedRepositoryUrl] = useState("");
  const [errorInput, setErrorInput] = useState("");
  const [isRepositoriesLoading, setIsRepositoriesLoading] = useState(true);
  const [repositoriesError, setRepositoriesError] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [lastAnalyzeRequest, setLastAnalyzeRequest] =
    useState<AnalyzeRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadRepositories() {
      setIsRepositoriesLoading(true);
      setRepositoriesError("");

      try {
        const options = await fetchRepositories();
        if (isCancelled) {
          return;
        }

        setRepositories(options);
        setSelectedRepositoryUrl(options[0]?.url ?? "");
      } catch (error) {
        if (isCancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los repositorios.";
        setRepositoriesError(message);
      } finally {
        if (!isCancelled) {
          setIsRepositoriesLoading(false);
        }
      }
    }

    void loadRepositories();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIndex(0);
      return;
    }

    const timeoutIds = ANALYSIS_LOADING_STEP_DELAYS.map((delay, index) =>
      window.setTimeout(() => {
        setLoadingStepIndex(index + 1);
      }, ANALYSIS_LOADING_STEP_DELAYS.slice(0, index + 1).reduce((total, current) => total + current, 0)),
    );

    return () => {
      timeoutIds.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, [isLoading]);

  const canSubmit =
    !isRepositoriesLoading &&
    selectedRepositoryUrl.trim().length > 0 &&
    !isLoading;

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setIsLoading(true);
    setLoadingStepIndex(0);
    setRequestError("");
    setResult(null);
    setLastAnalyzeRequest(null);

    try {
      const requestPayload: AnalyzeRequest = {
        repositoryUrl: selectedRepositoryUrl,
        error: errorInput,
      };

      const analysis = await analyzeRepository(requestPayload);
      setResult(analysis);
      setLastAnalyzeRequest(requestPayload);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al analizar.";
      setRequestError(message);
    } finally {
      setIsLoading(false);
    }
  }

  const githubIssues = useMemo(() => {
    if (!result || !lastAnalyzeRequest?.repositoryUrl) {
      return [];
    }

    return buildGithubIssueUrls({
      repositoryUrl: lastAnalyzeRequest.repositoryUrl,
      analysis: result,
      reportedError: lastAnalyzeRequest.error,
    });
  }, [lastAnalyzeRequest, result]);

  const activeLoadingStep = ANALYSIS_LOADING_STEPS[loadingStepIndex];

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(180deg,#f5f7fb_0%,#eef2ff_100%)] px-4 py-10">
        <main className="mx-auto w-full max-w-3xl">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
            <header>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Dev Decision Engine
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Selecciona un repositorio, pega un error o deja el campo vacío
                para que el sistema inspeccione el código y detecte varios
                hallazgos automáticamente.
              </p>
            </header>

            <form className="mt-6 space-y-4" onSubmit={handleAnalyze}>
              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="repository-select"
              >
                Repositorio
              </label>
              <select
                id="repository-select"
                className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                value={selectedRepositoryUrl}
                onChange={(event) => setSelectedRepositoryUrl(event.target.value)}
                disabled={isRepositoriesLoading || repositories.length === 0}
              >
                {isRepositoriesLoading ? (
                  <option value="">Cargando repositorios...</option>
                ) : null}
                {!isRepositoriesLoading && repositories.length === 0 ? (
                  <option value="">No hay repositorios disponibles</option>
                ) : null}
                {repositories.map((repository) => (
                  <option key={repository.id} value={repository.url}>
                    {repository.name}
                  </option>
                ))}
              </select>

              <label
                className="block text-sm font-medium text-slate-700"
                htmlFor="error-input"
              >
                Error o stacktrace (opcional)
              </label>
              <textarea
                id="error-input"
                className="min-h-40 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                placeholder="Ejemplo: TypeError: Cannot read properties of undefined (reading 'map') at UserList..."
                value={errorInput}
                onChange={(event) => setErrorInput(event.target.value)}
                maxLength={ERROR_INPUT_MAX_LENGTH}
                disabled={isLoading}
                spellCheck={false}
              />
              <p className="text-xs text-slate-500">
                {errorInput.length}/{ERROR_INPUT_MAX_LENGTH} caracteres. Si lo
                dejas vacío, el backend analiza el repositorio y devuelve hasta
                5 hallazgos concretos.
              </p>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLoading ? "Analizando..." : "Analizar"}
              </button>
            </form>

            {repositoriesError ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {repositoriesError}
              </p>
            ) : null}

            {requestError ? (
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {requestError}
              </p>
            ) : null}
          </section>

          {result ? (
            <div className="mt-6">
              <AnalysisResultCard result={result} githubIssues={githubIssues} />
            </div>
          ) : null}
        </main>
      </div>

      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-sky-500" />
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-700">
                Analizando
              </p>
            </div>

            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              {activeLoadingStep}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Estamos revisando el contexto técnico y preparando una decisión
              accionable.
            </p>

            <div className="mt-6 space-y-3">
              {ANALYSIS_LOADING_STEPS.map((step, index) => {
                const isCompleted = index < loadingStepIndex;
                const isActive = index === loadingStepIndex;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      isActive
                        ? "border-sky-200 bg-sky-50 text-sky-900"
                        : isCompleted
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isActive
                          ? "bg-sky-600 text-white"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
