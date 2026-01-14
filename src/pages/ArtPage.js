import React from "react";
import Header from "../components/header/Header";
import ProjectShowcase from "../containers/projectShowcase/ProjectShowcase";
import Footer from "../components/footer/Footer";
import ContactFooter from "../components/footer/ContactFooter";
import ScrollToTopButton from "../containers/topbutton/Top";
import {pageSettings} from "../portfolio";

export default function ArtPage() {
  const settings = (pageSettings && pageSettings.art) || {};
  const showFooter = settings.showFooter !== false;
  const showContactFooter = settings.showContactFooter !== false;

  return (
    <>
      <Header />
      <ProjectShowcase showProgramming={false} showDesign={false} showArt />
      {showFooter && <Footer />}
      {showContactFooter && <ContactFooter />}
      <ScrollToTopButton />
    </>
  );
}
