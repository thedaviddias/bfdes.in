import * as React from "react";

type Props = {
  timestamp: number;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export default function(props: Props) {
  const date = new Date(props.timestamp);
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return <>{`${day} ${month} ${year}`}</>;
}
