export const parseDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ]
  const day = date.getDate()
  const month = monthNames[date.getMonth()-1]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/** Method to parse query compatible with client and server. Ref: https://stackoverflow.com/a/3855394/4981237 */
export const parseQuery = (queryString: string) =>
  (/^[?#]/.test(queryString) ? queryString.slice(1) : queryString)
    .split('&')
    .reduce((params, param) => {
      const [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, {} as {[s: string]: string})
