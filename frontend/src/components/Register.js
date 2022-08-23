import React from "react";
import { Link } from "react-router-dom";

function Register({handleRegister}) {

  const [formParams, setFormParams] = React.useState({
    email: '',
    password: '',
  })

  function handleSubmit(e) {
    e.preventDefault()
    handleRegister(formParams)
  } 

  function handleChange(e) {
    const { name, value } = e.target;
    setFormParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            onChange={handleChange}
            value={formParams.email}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="auth__input auth__content-password"
            required
            onChange={handleChange}
            value={formParams.password}
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
