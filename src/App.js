import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "./App.scss";
import Main from "./containers/Main";
import AboutPage from "./pages/AboutPage";
import ArtPage from "./pages/ArtPage";
import {StyleProvider} from "./contexts/StyleContext";
import {useLocalStorage} from "./hooks/useLocalStorage";

function App() {
  const darkPref = window.matchMedia("(prefers-color-scheme: dark)");
  const [isDark, setIsDark] = useLocalStorage("isDark", darkPref.matches);
  const changeTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={isDark ? "dark-mode" : null}>
      <StyleProvider value={{isDark: isDark, changeTheme: changeTheme}}>
        <Router>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/about_me" component={AboutPage} />
            <Route exact path="/art" component={ArtPage} />
          </Switch>
        </Router>
      </StyleProvider>
    </div>
  );
}

export default App;
