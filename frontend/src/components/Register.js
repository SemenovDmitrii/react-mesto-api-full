import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const email = React.useRef();
  const password = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    props.onRegister(password.current.value, email.current.value);
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
