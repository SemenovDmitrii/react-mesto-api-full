import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [inputName, setInputName] = React.useState("");
  const [inputDescription, setInputDescription] = React.useState("");

  function handleChangeInputName(e) {
    setInputName(e.target.value);
  }
  function handleChangeInputDescription(e) {
    setInputDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser({
      name: inputName,
      about: inputDescription,
    });
  }

  React.useEffect(() => {
    setInputName(currentUser.name);
    setInputDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      {...props}
    >
      <fieldset className="popup__field">
        <input
          className="popup__input"
          type="text"
          name="name"
          id="name-input"
          required
          placeholder="Имя"
          minLength="2"
          maxLength="40"
          value={inputName || ""}
          onChange={handleChangeInputName}
        />
        <span className="popup__validate-error" id="name-input-error"></span>
        <input
          className="popup__input"
          type="text"
          name="about"
          id="about-input"
          required
          placeholder="О себе"
          minLength="2"
          maxLength="200"
          value={inputDescription || ""}
          onChange={handleChangeInputDescription}
        />
        <span className="popup__validate-error" id="about-input-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
