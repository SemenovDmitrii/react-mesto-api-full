import React from "react";

function Login(props) {
  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');

  function handleChangeEmail(evt) {
      setEmail(evt.target.value);
  }

  function handleChangePassword(evt) {
      setPassword(evt.target.value);
  }

  function handleSubmit(evt) {
      evt.preventDefault();
      props.onLogin({ email, password });
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
            onChange={handleChangeEmail}
            value={email}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="auth__input auth__content-password"
            required
            onChange={handleChangePassword}
            value={password}
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
