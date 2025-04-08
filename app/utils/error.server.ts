export function handleError(error: unknown): { message: string } {
  if (error instanceof Error) return { message: error.message };
  if (typeof error === "object" && error !== null) {
    return { message: String((error as any).message) };
  }
  return { message: "Unknown error occurred" };
}
