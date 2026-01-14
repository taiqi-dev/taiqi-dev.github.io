import React, {useContext} from "react";
import "./ContactFooter.scss";
import {Fade} from "react-reveal";
import emoji from "react-easy-emoji";
import StyleContext from "../../contexts/StyleContext";
import {contactInfo} from "../../portfolio";
import SocialMedia from "../socialMedia/SocialMedia";

export default function ContactFooter() {
  const {isDark} = useContext(StyleContext);
  const subtitleLines = String(contactInfo.subtitle || "").split("\n");
  return (
    <Fade bottom duration={1000} distance="5px">
      <div id="contact" className="contact-footer">
        <h3 className={isDark ? "dark-mode contact-footer__title" : "contact-footer__title"}>
          {contactInfo.title}
        </h3>
        <p className={isDark ? "dark-mode contact-footer__subtitle" : "contact-footer__subtitle"}>
          {subtitleLines.map((line, index) => (
            <span key={index}>
              {line}
              {index < subtitleLines.length - 1 && <br />}
            </span>
          ))}
        </p>
        <div className="contact-footer__details">
          {contactInfo.number && (
            <a className="contact-footer__link" href={"tel:" + contactInfo.number}>
              {contactInfo.number}
            </a>
          )}
          <a className="contact-footer__link" href={"mailto:" + contactInfo.email_address}>
            {contactInfo.email_address}
          </a>
        </div>
        <div className="contact-footer__social">
          <SocialMedia />
        </div>
        <div className="contact-footer__credits">
          <p className={isDark ? "dark-mode contact-footer__credit-text" : "contact-footer__credit-text"}>
            {emoji("Made with ❤️ by DeveloperFolio Team")}
          </p>
          <p className={isDark ? "dark-mode contact-footer__credit-text" : "contact-footer__credit-text"}>
            Theme by{" "}
            <a
              href="https://github.com/saadpasta/developerFolio"
              target="_blank"
              rel="noreferrer"
            >
              developerFolio
            </a>
          </p>
        </div>
      </div>
    </Fade>
  );
}
