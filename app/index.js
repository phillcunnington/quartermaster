import React from "react";
import ReactDOM from "react-dom";
import Backend from "./backend";
import numeral from "numeral";
numeral.defaultFormat("$0,0.00");
numeral.language('en-GB', {
    delimiters: {
        thousands: ',',
        decimal: '.'
    },
    currency: {
        symbol: '£'
    }
});
numeral.language('en-GB');

class AccountsTotal extends React.Component {
  render() {
    return (
      <div id="accountsTotal">
        Accounts Total: {numeral(this.props.total / 100).format()}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div id="appContainer">
        <AccountsTotal total={this.props.data.accounts.total} />
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
