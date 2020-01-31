import * as React from "react";
import { NavLink } from "react-router-dom";
import { Avatar, GitHub, RSS } from "shared/images";

const Profile: React.FC = () => (
  <img className="avatar" src={Avatar} alt="Profile photo" />
);

const NavBar: React.FC = () => (
  <div id="nav">
    <NavLink to="/posts" className="nav-item" activeClassName="active">
      <h2>Blog</h2>
    </NavLink>
    <NavLink to="/about" className="nav-item" activeClassName="active">
      <h2>About</h2>
    </NavLink>
  </div>
);

const Social: React.FC = () => (
  <div id="social">
    <a className="nav-item" href="https://www.github.com/bfdes">
      <img className="badge" src={GitHub} alt="GitHub link" />
    </a>
    <a className="nav-item" href="/feed.rss">
      <img className="badge" src={RSS} alt="RSS link" />
    </a>
  </div>
);

const Sidebar: React.FC = () => (
  <aside id="sidebar">
    <Profile />
    <NavBar />
    <Social />
  </aside>
);

export default Sidebar;
