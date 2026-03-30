export type AnalyzePriority = "HIGH" | "MEDIUM" | "LOW";

export interface AnalyzeFinding {
  problem: string;
  cause: string;
  impact: string;
  priority: AnalyzePriority;
  solution: string;
  confidence: number;
}

export interface AnalyzeRepository {
  id: string;
  name: string;
  url: string;
}

export interface AnalyzeResponse extends AnalyzeFinding {
  summary: string;
  findings: AnalyzeFinding[];
  mode: "error" | "repository";
}

export interface AnalyzeRequest {
  repositoryUrl?: string;
  error?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export async function fetchRepositories(): Promise<AnalyzeRepository[]> {
  const response = await fetch(`${API_BASE_URL}/analyze/repositories`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar los repositorios.");
  }

  return (await response.json()) as AnalyzeRepository[];
}

export async function analyzeRepository(
  request: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  const payload = normalizeAnalyzeRequest(request);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "No se pudo analizar el error.";

    try {
      const payload = (await response.json()) as { message?: string };
      if (payload?.message) {
        message = payload.message;
      }
    } catch {
      // keep default message
    }

    throw new Error(message);
  }

  const data = (await response.json()) as AnalyzeResponse;
  return data;
}

function normalizeAnalyzeRequest(request: AnalyzeRequest): AnalyzeRequest {
  const repositoryUrl = request.repositoryUrl?.trim();
  const error = request.error?.trim();

  return {
    repositoryUrl: repositoryUrl && repositoryUrl.length > 0 ? repositoryUrl : undefined,
    error: error && error.length > 0 ? error : undefined,
  };
}
