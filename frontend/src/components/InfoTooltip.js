import React from "react";
import success from "../images/register-success.png";
import error from "../images/register-error.png";

function InfoTooltip(props) {
  function handleOverlayClose(evt) {
    if (evt.target.classList.contains("popup")) {
      props.onClose();
    }
  }

  return (
    <div onMouseDown={handleOverlayClose}>
      <div
        className={`popup popup_content_info-status ${
          props.isOpen && "popup_opened"
        }`}
      >
        <div className="popup__container">
          <div className="popup__info-status">
            <button
              className="popup__close-button"
              type="button"
              onClick={props.onClose}
            ></button>
            <img
              className="popup__image-message"
              src={props.messageStatus ? success : error}
              alt="img-status-info"
            />
            <h2 className="popup__text-message">
              {props.messageStatus
                ? "Вы успешно зарегистрировались!"
                : "Что-то пошло не так! Попробуйте ещё раз."}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
