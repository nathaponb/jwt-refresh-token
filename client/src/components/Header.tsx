import React from "react";

function Header() {
  return (
    <header>
      <h1>Login</h1>
      <p>Access token expires every 10 seconds</p>
      <p>
        but by the help of refresh token you will be authorized for 1 minute
      </p>
    </header>
  );
}

export default React.memo(Header);
