export const parseDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return date.toLocaleDateString('en-gb', options)
}

/** Method to parse query compatible with client and server. Ref: https://stackoverflow.com/a/3855394/4981237 */
export const parseQuery = (queryString: string) =>
  (/^[?#]/.test(queryString) ? queryString.slice(1) : queryString)
    .split('&')
    .reduce((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, {} as {[s: string]: string})

export type Post = {title: string, wordCount: number, body: string, tags: string[], created: number}
export type Posts = {[s: string]: Post}

export class NetworkError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    Error.captureStackTrace(this, NetworkError)
  }
}

const client = (req: Request) => 
  fetch(req).then(res => 
    res.json().then(data => {
      const { status } = res
      return (status >= 200 && status < 300) ? data : Promise.reject(new NetworkError(status, data.error.message))
    })
  )

export const get = (url: string) => 
  client(new Request(url, {
    method: 'get',
    headers: new Headers({'content-type': 'application/json'})
  }))
