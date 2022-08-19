import React from "react";

function ImagePopup(props) {
  function handleOverlayClose(evt) {
    if (evt.target.classList.contains("popup")) {
      props.onClose();
    }
  }

  return (
    <div onMouseDown={handleOverlayClose}>
      <div
        className={`popup popup_type_look-image ${
          props.card.isOpen && "popup_opened"
        }`}
      >
        <div className="popup__container-image">
          <button
            className="popup__close-button"
            type="button"
            onClick={props.onClose}
          ></button>
          <figure className="popup__figure">
            <img
              className="popup__image"
              src={props.card.link}
              alt={props.card.name}
            />
            <figcaption className="popup__image-caption">
              {props.card.name}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;
