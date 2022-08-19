import React from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      buttonText="Сохранить"
      onSubmit={handleSubmit}
      {...props}
    >
      <fieldset className="popup__field">
        <input
          className="popup__input"
          type="url"
          name="avatar"
          id="new-avatar"
          required
          placeholder="Введите ссылку"
          ref={avatarRef}
        />
        <span className="popup__validate-error" id="new-avatar-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
