import React, { useState } from "react"

function Login({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleChange(e) {
    const { value } = e.target;
    e.target.name === 'email' ? setEmail(value) : setPassword(value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAuth(password, email);
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
            value={email || ''}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            className="auth__input auth__content-password"
            required
            value={password || ''}
            onChange={handleChange}
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
