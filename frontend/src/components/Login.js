import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ email, password });
  }

  return (
    <section className="auth">
      <form
        className="auth__form"
        name="form-registartion"
        onSubmit={handleSubmit}
      >
        <h2 className="auth__form-title">Вход</h2>
        <fieldset className="auth__field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth__input auth__content-email"
            required
            value={email || ""}
            onChange={handleEmailChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="auth__input auth__content-password"
            required
            value={password || ""}
            onChange={handlePasswordChange}
          />
        </fieldset>
        <button type="submit" className="auth__form-submit">
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;
