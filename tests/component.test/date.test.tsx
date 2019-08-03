import { configure, shallow } from "enzyme";
import * as React from "react";
const Adapter = require("enzyme-adapter-react-16");

import Component from "../../src/shared/components/Date";

beforeAll(() => {
  configure({adapter: new Adapter()});
});

describe("<Date />", () => {
  it("renders UNIX birthday", () => {
    // Edge case
    const wrapper = shallow(<Component timestamp={0} />);
    expect(wrapper.text()).toBe("1 January 1970");
  });

  it("renders current time", () => {
    const monthNames = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December",
    ];
    const now = new Date();

    const day = now.getDate();
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const wrapper = shallow(
      <Component timestamp={now.getTime()} />,
    );
    expect(wrapper.text()).toBe(`${day} ${month} ${year}`);
  });
});
