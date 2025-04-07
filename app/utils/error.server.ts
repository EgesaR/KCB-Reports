export function handleError(error: unknown): {
  message: string;
  status?: number;
} {
  if (error instanceof Error) {
    return { message: error.message };
  }
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: unknown; status?: number } };
    return {
      message: String(err.response?.data || "Unknown error"),
      status: err.response?.status,
    };
  }
  return { message: String(error) };
}
