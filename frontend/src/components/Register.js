import React from 'react';
import { Link } from "react-router-dom";

export default function Register(props) {
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
      props.onRegister({ email, password });
  }

  return (
    <section className="auth">
      <form
        className="auth__form"
        name="form-registartion"
        onSubmit={handleSubmit}
      >
        <h2 className="auth__form-title">Регистрация</h2>
        <fieldset className="auth__field">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth__input auth__content-email"
            required
            value={email || ""}
            onChange={handleChangeEmail}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="auth__input auth__content-password"
            required
            value={password || ""}
            onChange={handleChangePassword}
          />
        </fieldset>
        <button type="submit" className="auth__form-submit">
          Зарегистрироваться
        </button>
      </form>
      <div className="auth__signin-container">
        <p className="auth__text">Уже зарегистрированы?</p>
        <Link to="/sign-in" className="auth__signin">
          Войти
        </Link>
      </div>
    </section>
  );
}
