import { shallow } from "enzyme";
import * as React from "react";

import Date from "shared/components/Date";

describe("<Date /> on server", () => {
  it("renders UNIX birthday", () => {
    const wrapper = shallow(<Date timestamp={0} />);
    expect(wrapper.text()).toBe("1 January 1970");
  });

  it("renders current time", () => {
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
    const now = new global.Date();

    const day = now.getDate();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const wrapper = shallow(<Date timestamp={now.getTime()} />);
    expect(wrapper.text()).toBe(`${day} ${month} ${year}`);
  });
});
