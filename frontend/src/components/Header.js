import React from "react";
import { Link } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import headerLogo from "../images/header-logo.svg";

function Header(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const authLinkText = {
    "sign-in": "Войти",
    "sign-up": "Регистрация",
  };
  return (
    <header className="header">
      <img src={headerLogo} alt="Логотип" className="header__logo link" />
      <div className="header__user-block">
        {props.loggedIn ? (
          <>
            <p className="header__user-email">{currentUser.email}</p>
            <button className="header__user-exit" onClick={props.onLogout}>
              Выйти
            </button>
          </>
        ) : (
          <Link className="header__auth-button" to={`/${props.authLink}`}>
            {authLinkText[props.authLink]}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
