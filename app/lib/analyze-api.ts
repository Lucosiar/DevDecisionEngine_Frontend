export type AnalyzePriority = "HIGH" | "MEDIUM" | "LOW";

export interface AnalyzeRepository {
  id: string;
  name: string;
  url: string;
}

export interface AnalyzeResponse {
  problem: string;
  cause: string;
  impact: string;
  priority: AnalyzePriority;
  solution: string;
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
  repositoryUrl: string,
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repositoryUrl }),
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
