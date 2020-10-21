export class RequestError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, RequestError);
  }
}

/** Delays a promise from resolving for interval milliseconds if it succeeds */
export function delay<T>(promise: Promise<T>, interval: number) {
  return promise.then(
    data => new Promise<T>(resolve => setTimeout(() => resolve(data), interval))
  );
}

export function get<P>(url: string, signal: AbortSignal): Promise<P> {
  return fetch(url, {
    method: "get",
    headers: { "Content-Type": "application/json" },
    signal
  }).then(res =>
    res
      .json()
      .then(data =>
        res.ok
          ? data
          : Promise.reject(new RequestError(res.status, data.error.message))
      )
  );
}
