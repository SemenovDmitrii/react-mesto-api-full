import React, { useState } from "react"
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleChange(e) {
    const { value } = e.target;
    e.target.name === 'email' ? setEmail(value) : setPassword(value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    onRegister(password, email);
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
            value={email || ''}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="auth__input auth__content-password"
            required
            value={[password] || ''}
            onChange={handleChange}
          />
        </fieldset>
        <button type="submit" className="auth__form-submit">
          Зарегестрироваться
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

export default Register;
