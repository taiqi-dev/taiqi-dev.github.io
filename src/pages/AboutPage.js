import React from "react";
import Header from "../components/header/Header";
import Greeting from "../containers/greeting/Greeting";
import Skills from "../containers/skills/Skills";
import StackProgress from "../containers/skillProgress/skillProgress";
import Education from "../containers/education/Education";
import WorkExperience from "../containers/workExperience/WorkExperience";
import Footer from "../components/footer/Footer";
import ContactFooter from "../components/footer/ContactFooter";
import ScrollToTopButton from "../containers/topbutton/Top";
import {pageSettings} from "../portfolio";

export default function AboutPage() {
  const settings = (pageSettings && pageSettings.about) || {};
  const showFooter = settings.showFooter !== false;
  const showContactFooter = settings.showContactFooter !== false;

  return (
    <>
      <Header />
      <Greeting />
      <Skills />
      <StackProgress />
      <Education />
      <WorkExperience />
      <img src="/images/divider.png" alt="divider" className="img-divider" />
      {showFooter && <Footer />}
      {showContactFooter && <ContactFooter />}
      <ScrollToTopButton />
    </>
  );
}
