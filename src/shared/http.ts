export class RequestError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, RequestError);
  }
}

export function get(url: string): Promise<Payload> {
  return fetch(url, {
    method: "get",
    headers: { "Content-Type": "application/json" }
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
