import * as React from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../images/avatar.jpg";
import GitHub from "../images/github.png";
import RSS from "../images/rss.png";

const Profile = () => (
  <img className="avatar" src={Avatar} alt="Profile photo" />
);

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
    <a className="nav-item" href="https://www.github.com/bfdes">
      <img className="badge" src={GitHub} alt="GitHub link" />
    </a>
    <a className="nav-item" href="/feed.rss">
      <img className="badge" src={RSS} alt="RSS link" />
    </a>
  </div>
);

export default () => (
  <aside id="sidebar">
    <Profile />
    <NavBar />
    <Social />
  </aside>
);
