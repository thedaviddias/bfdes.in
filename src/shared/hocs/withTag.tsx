import * as React from "react";

/** Method to parse query compatible with client and server. Ref: https://stackoverflow.com/a/3855394/4981237 */
function parseQuery(queryString: string): Map<string, string> {
  return (/^[?#]/.test(queryString) ? queryString.slice(1) : queryString)
    .split("&")
    .reduce((params, param) => {
      const [key, value] = param.split("=");
      const decoded = value
        ? decodeURIComponent(value.replace(/\+/g, " "))
        : "";
      return params.set(key, decoded);
    }, new Map());
}

type Tag = {
  tag?: string;
};

type Location = {
  location: {
    search: string;
  };
};

function withTag(Component: React.SFC<Tag>): React.SFC<Location> {
  return function WithTag(props: Location): React.ReactElement {
    const { location, ...rest } = props;
    const query = parseQuery(location.search);
    return <Component tag={query.get("tag")} {...rest} />;
  };
}

export default withTag;
