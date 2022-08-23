import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
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
          Зарегестрироваться
        </button>
      </form>
      <div className="auth__signin-container">
        <p className="auth__text">Уже зарегистрированы?</p>
        <Link to="/signin" className="auth__signin">
          Войти
        </Link>
      </div>
    </section>
  );
}

export default Register;
