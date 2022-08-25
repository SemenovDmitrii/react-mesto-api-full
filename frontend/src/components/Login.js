import React from "react";

function Login(props) {
  const email = React.useRef();
  const password = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.current.value || !password.current.value){ return; }
    props.onAuthorize(password.current.value, email.current.value);
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
            ref={email}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="auth__input auth__content-password"
            required
            ref={password}
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
