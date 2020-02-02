export default class Params {
  readonly offset: number
  readonly limit: number
  readonly tag?: string

  constructor(offset = 0, limit = 6, tag?: string) {
    // Sanitise illegal values
    this.offset = Math.max(offset, 0);
    this.limit = Math.max(limit, 1);
    this.tag = tag;
  }

  static fromString(queryString: string): Params {
    const parsed = (/^[?#]/.test(queryString) ? queryString.slice(1) : queryString)
      .split("&")
      .reduce((params, param) => {
        const [key, value] = param.split("=");
        const decoded = value
          ? decodeURIComponent(value.replace(/\+/g, " "))
          : "";
        return params.set(key, decoded);
      }, new Map<string, string>());
    const offset = parseInt(parsed.get("offset"))
    const limit = parseInt(parsed.get("limit"))
    return new this(offset, limit, parsed.get("tag"))
  }

  public toString(): string {
    const { offset, limit, tag } = this;
    let queryString = "";
    if(offset) {
      queryString += `?offset=${offset}`
    }
    if(limit) {
      queryString += offset ? `&limit=${limit}` : `?limit=${limit}`
    }
    if(tag) {
      queryString += (offset || limit) ? `&tag=${tag}` : `?tag=${tag}`
    }
    return queryString;
  }

  public equals(other: Params): boolean {
    const { offset, limit, tag } = this;
    return offset == other.offset && limit == other.limit && tag == other.tag
  }
}
