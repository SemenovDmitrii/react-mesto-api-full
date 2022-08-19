import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__container">
          <div
            className="profile__avatar"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
          >
            <button
              className="profile__edit-avatar-button"
              onClick={props.onEditAvatar}
            ></button>
          </div>
          <div className="profile__info">
            <h1 className="profile__name-info">{currentUser.name}</h1>
            <button
              className="profile__edit-button link"
              type="button"
              onClick={props.onEditProfile}
            ></button>
            <p className="profile__about-me">{currentUser.about}</p>
          </div>
        </div>
        <button
          className="profile__add-button link"
          type="button"
          onClick={props.onAddPlace}
        ></button>
      </section>

      <section className="elements">
        <ul className="element-list">
          {props.cards.map((card) => (
            <Card
              card={card}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
              key={card._id}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
