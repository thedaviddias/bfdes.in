import * as React from "react";
import { NavLink } from "react-router-dom";

const Avatar = () =>
  <img className="avatar" src={require("../images/avatar.jpg")} alt="Profile photo" />;

const NavBar = () => (
  <div id="nav">
    <NavLink to="/posts" className="nav-item" activeClassName="active">
      <h2>Blog</h2>
    </NavLink>
    <NavLink to="/about" className="nav-item" activeClassName="active">
      <h2>About</h2>
    </NavLink>
  </div>
);

const Social = () => (
  <div id="social">
    <a className="nav-item" href="https://www.github.com/bfdes" >
      <img className="badge" src={require("../images/github.png")} alt="GitHub link" />
    </a>
    <a className="nav-item" href="/feed.rss" >
      <img className="badge" src={require("../images/rss.png")} alt="RSS link" />
    </a>
  </div>
);

export default () => (
  <aside id="sidebar">
    <Avatar />
    <NavBar />
    <Social />
  </aside>
);
