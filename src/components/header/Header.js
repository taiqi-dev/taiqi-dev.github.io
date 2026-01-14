import React, {useContext, useEffect, useRef, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import Headroom from "react-headroom";
import "./Header.scss";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import StyleContext from "../../contexts/StyleContext";
import {
  greeting,
  workExperiences,
  skillsSection,
  openSource,
  blogSection,
  talkSection,
  achievementSection,
  resumeSection
} from "../../portfolio";

function Header({showSectionLinks = true, showProjectsLink = true}) {
  const {isDark} = useContext(StyleContext);
  const [forceHide, setForceHide] = useState(false);
  const hideTimeoutRef = useRef(null);
  const viewExperience = workExperiences.display;
  const viewOpenSource = openSource.display;
  const viewSkills = skillsSection.display;
  const viewAchievement = achievementSection.display;
  const viewBlog = blogSection.display;
  const viewTalks = talkSection.display;
  const viewResume = resumeSection.display;

  const handleNavClick = () => {
    setForceHide(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setForceHide(false);
      hideTimeoutRef.current = null;
    }, 450);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Headroom>
      <header
        className={
          (isDark ? "dark-menu header" : "header") +
          (forceHide ? " header--force-hidden" : "")
        }
      >
        <Link to="/" className="logo" onClick={handleNavClick}>
          {/* <span className="grey-color"> &lt;</span> */}
          <span className="logo-name">{greeting.username}</span>
          {/* <span className="grey-color">/&gt;</span> */}
          {/* <span className="logo-email">wtq3555@gmail.com</span> */}
        </Link>
        <input className="menu-btn" type="checkbox" id="menu-btn" />
        <label
          className="menu-icon"
          htmlFor="menu-btn"
          style={{color: "white"}}
        >
          <span className={isDark ? "navicon navicon-dark" : "navicon"}></span>
        </label>
        <ul className={isDark ? "dark-menu menu" : "menu"}>
          <li>
            <NavLink
              exact
              to="/"
              onClick={handleNavClick}
              activeClassName="menu-link--active"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about_me"
              onClick={handleNavClick}
              activeClassName="menu-link--active"
            >
              About Me
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/art"
              onClick={handleNavClick}
              activeClassName="menu-link--active"
            >
              Game Art
            </NavLink>
          </li>
          {/* {showSectionLinks && viewResume && (
            <li>
              <a href="#resume" onClick={handleNavClick}>
                Resume
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && viewSkills && (
            <li>
              <a href="#skills" onClick={handleNavClick}>
                Skills
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && true && (
            <li>
              <a href="#education" onClick={handleNavClick}>
                Education
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && viewExperience && (
            <li>
              <a href="#experience" onClick={handleNavClick}>
                Work Exp
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && viewOpenSource && (
            <li>
              <a href="#opensource" onClick={handleNavClick}>
                Open Source
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && viewAchievement && (
            <li>
              <a href="#achievements" onClick={handleNavClick}>
                Achievements
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && viewBlog && (
            <li>
              <a href="#blogs" onClick={handleNavClick}>
                Blogs
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && viewTalks && (
            <li>
              <a href="#talks" onClick={handleNavClick}>
                Talks
              </a>
            </li>
          )} */}

          {/* {showSectionLinks && showProjectsLink && (
            <li>
              <a href="#big-projects-programming" onClick={handleNavClick}>
                Projects
              </a>
            </li>
          )} */}
          {/* {showSectionLinks && (
            <li>
              <a href="#contact" onClick={handleNavClick}>
                Contact Me
              </a>
            </li>
          )} */}
          <li>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <ToggleSwitch />
            </a>
          </li>
        </ul>
      </header>
    </Headroom>
  );
}
export default Header;
