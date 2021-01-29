import React from "react";
import Main from "./components/Main"

const Router = require("react-router-dom").HashRouter;

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="Container">
        <Main/>
      </div>
    </Router>
  );
}

export default App;