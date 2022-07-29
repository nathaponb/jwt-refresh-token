import React from "react";
import "./App.css";
import instance from "./services/api";
import Header from "./components/Header";

interface ApiError {
  response: {
    data: {
      code: number;
      data: string;
      message: string;
    };
  };
}

function App() {
  const [user, setUser] = React.useState({ username: "", password: "" });
  const [accessToken, setAccesstoken] = React.useState<string | null>(null);
  const [api1Data, setApi1Data] = React.useState<string | null>(null);
  const [api2Data, setApi2Data] = React.useState<string | null>(null);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user.username.length || !user.password.length) {
      return;
    }
    try {
      const response = await instance.post("/login", {
        username: user.username,
        password: user.password,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      setAccesstoken(response.data.accessToken);
    } catch (err) {
      const e = err as ApiError;
    }
  }

  async function handleApi1() {
    try {
      const response = await instance.get("/api/first");
      setApi1Data(response.data.data);
    } catch (err: unknown) {
      const e = err as ApiError;
      setApi1Data(e.response.data.message);
    }
  }
  async function handleApi2() {
    try {
      const response = await instance.get("http://localhost:5000/api/second");
      setApi2Data(response.data.data);
    } catch (err) {
      const e = err as ApiError;
      setApi2Data(e.response.data.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    setAccesstoken(null);
  }

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccesstoken(token);
    }
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <Header />
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="username"
            onChange={handleFormChange}
            type="text"
            placeholder="username"
          />
          <input
            name="password"
            onChange={handleFormChange}
            type="password"
            placeholder="password"
          />
          <button type="submit">Login</button>
          <button onClick={handleLogout} type="button">
            Logout
          </button>
        </form>

        <section>
          <small className="token ">{accessToken}</small>
        </section>

        <section>
          <button onClick={handleApi1}>Dog API</button>
          <button onClick={handleApi2}>Cat API</button>
        </section>

        <section>
          <div className="code-block">
            {/* <p>Api1 Data: </p> */}
            <p className="code">{JSON.stringify(api1Data)}</p>
          </div>
          <div className="code-block">
            {/* <p>Api2 Data: </p> */}
            <p className="code">{JSON.stringify(api2Data)}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
