import * as React from "react";

/** Method to parse query compatible with client and server. Ref: https://stackoverflow.com/a/3855394/4981237 */
const parseQuery = (queryString: string) =>
  (/^[?#]/.test(queryString) ? queryString.slice(1) : queryString)
    .split("&")
    .reduce((params, param) => {
      const [key, value] = param.split("=");
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
      return params;
    }, {} as { [s: string]: string });

type Props = {
  tag?: string;
};

type Location = {
  search: string;
};

export default function(Component: React.SFC<Props>) {
  return (props: { location: Location }) => {
    const { location, ...rest } = props;
    const { tag } = parseQuery(location.search);
    return <Component tag={tag} {...rest} />;
  };
}
