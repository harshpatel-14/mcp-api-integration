
export type ApiError = { message: string; status?: number };
export function handleError(error: any): ApiError {
  if (error.response) {
    return {
      message: error.response.data?.message || "Something went wrong",
      status: error.response.status
    };
  }
  return { message: "Network error" };
}
