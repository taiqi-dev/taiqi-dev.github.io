import React, {useEffect, useState} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import StackProgress from "./skillProgress/skillProgress";
import WorkExperience from "./workExperience/WorkExperience";
import Projects from "./projects/Projects";
import ProjectShowcase from "./projectShowcase/ProjectShowcase";
import StartupProject from "./StartupProjects/StartupProject";
import Achievement from "./achievement/Achievement";
import Blogs from "./blogs/Blogs";
import Footer from "../components/footer/Footer";
import Talks from "./talks/Talks";
import Podcast from "./podcast/Podcast";
import Education from "./education/Education";
import ScrollToTopButton from "./topbutton/Top";
import Twitter from "./twitter-embed/twitter";
import Profile from "./profile/Profile";
import SplashScreen from "./splashScreen/SplashScreen";
import {pageSettings, splashScreen} from "../portfolio";
import ContactFooter from "../components/footer/ContactFooter";
import "./Main.scss";

const Main = () => {
  const settings = (pageSettings && pageSettings.home) || {};
  const showFooter = settings.showFooter !== false;
  const showContactFooter = settings.showContactFooter !== false;
  const [isShowingSplashAnimation, setIsShowingSplashAnimation] = useState(() => {
    if (!splashScreen.enabled) {
      return false;
    }
    return sessionStorage.getItem("hasSeenSplash") !== "true";
  });

  useEffect(() => {
    if (splashScreen.enabled) {
      if (sessionStorage.getItem("hasSeenSplash") === "true") {
        setIsShowingSplashAnimation(false);
        return;
      }
      const splashTimer = setTimeout(
        () => {
          setIsShowingSplashAnimation(false);
          sessionStorage.setItem("hasSeenSplash", "true");
        },
        splashScreen.duration
      );
      return () => {
        clearTimeout(splashTimer);
      };
    }
  }, []);

  return (
    <>
      {isShowingSplashAnimation && splashScreen.enabled ? (
        <SplashScreen />
      ) : (
        <>
          <Header />
          {/* <Greeting /> */}
          {/* <Skills /> */}
          {/* <StackProgress /> */}
          {/* <Education /> */}
          
          <ProjectShowcase showArt={false} />
          <WorkExperience />
          
          <Projects />
          <StartupProject />
          <Achievement />
          <Blogs />
          <Talks />
          <Twitter />
          <Podcast />
          {/* <Profile /> */}
          {showFooter && <Footer />}
          {showContactFooter && <ContactFooter />}
          <ScrollToTopButton />
        </>
      )}
    </>
  );
};

export default Main;
