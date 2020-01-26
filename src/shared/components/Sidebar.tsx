import * as React from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../images/avatar.jpg";
import GitHub from "../images/github.png";
import RSS from "../images/rss.png";

function Profile(): React.ReactElement {
  return <img className="avatar" src={Avatar} alt="Profile photo" />;
}

function NavBar(): React.ReactElement {
  return (
    <div id="nav">
      <NavLink to="/posts" className="nav-item" activeClassName="active">
        <h2>Blog</h2>
      </NavLink>
      <NavLink to="/about" className="nav-item" activeClassName="active">
        <h2>About</h2>
      </NavLink>
    </div>
  );
}

function Social(): React.ReactElement {
  return (
    <div id="social">
      <a className="nav-item" href="https://www.github.com/bfdes">
        <img className="badge" src={GitHub} alt="GitHub link" />
      </a>
      <a className="nav-item" href="/feed.rss">
        <img className="badge" src={RSS} alt="RSS link" />
      </a>
    </div>
  );
}

function Sidebar(): React.ReactElement {
  return (
    <aside id="sidebar">
      <Profile />
      <NavBar />
      <Social />
    </aside>
  );
}

export default Sidebar;
