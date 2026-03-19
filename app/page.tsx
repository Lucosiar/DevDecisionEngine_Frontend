"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnalysisResultCard } from "./components/analysis-result-card";
import {
  AnalyzeRepository,
  AnalyzeResponse,
  analyzeRepository,
  fetchRepositories,
} from "./lib/analyze-api";

export default function Home() {
  const [repositories, setRepositories] = useState<AnalyzeRepository[]>([]);
  const [selectedRepositoryUrl, setSelectedRepositoryUrl] = useState("");
  const [isRepositoriesLoading, setIsRepositoriesLoading] = useState(true);
  const [repositoriesError, setRepositoriesError] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setRequestError("");
    setResult(null);

    try {
      const analysis = await analyzeRepository(selectedRepositoryUrl);
      setResult(analysis);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrio un error al analizar.";
      setRequestError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f7fb_0%,#eef2ff_100%)] px-4 py-10">
      <main className="mx-auto w-full max-w-3xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Dev Decision Engine
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Selecciona un repositorio y ejecuta el analisis.
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
            <AnalysisResultCard result={result} />
          </div>
        ) : null}
      </main>
    </div>
  );
}
