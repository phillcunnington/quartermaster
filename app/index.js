import React from "react";
import ReactDOM from "react-dom";
import Backend from "./backend";

class App extends React.Component {
  render() {
    return (
      <div>
      Hello
      </div>
    );
  }
}

Backend.initialise()
  .then((data) => {
    ReactDOM.render(
      <App data={data} />,
      document.getElementById("app")
    );
  });
