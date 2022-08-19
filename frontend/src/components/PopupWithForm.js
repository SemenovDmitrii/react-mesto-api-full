import React from "react";

function PopupWithForm(props) {
  function handleOverlayClose(evt) {
    if (evt.target.classList.contains("popup")) {
      props.onClose();
    }
  }

  return (
    <div
      className={`popup ${props.isOpen ? "popup_opened" : ""}`}
      onMouseDown={handleOverlayClose}
    >
      <div className="popup__container">
        <button
          className="popup__close-button"
          type="button"
          onClick={props.onClose}
        ></button>
        <h2 className="popup__title">{props.title}</h2>
        <form
          className="popup__form"
          method="post"
          name={props.name}
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button className="popup__button" type="submit">
            {props.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
