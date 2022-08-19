import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const nameRef = React.useRef();
  const linkRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlace({
      name: nameRef.current.value,
      link: linkRef.current.value,
    });
  }

  React.useEffect(() => {
    nameRef.current.value = "";
    linkRef.current.value = "";
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="add-mesto"
      title="Новое место"
      buttonText="Создать"
      onSubmit={handleSubmit}
      {...props}
    >
      <fieldset className="popup__field">
        <input
          className="popup__input"
          type="text"
          name="name"
          id="element-input"
          required
          placeholder="Название"
          minLength="2"
          maxLength="30"
          ref={nameRef}
        />
        <span className="popup__validate-error" id="element-input-error"></span>
        <input
          className="popup__input"
          type="url"
          name="link"
          id="url-input"
          required
          placeholder="Ссылка на картинку"
          ref={linkRef}
        />
        <span className="popup__validate-error" id="url-input-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
