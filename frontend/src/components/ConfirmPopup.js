import React from "react";
import PopupWithForm from "./PopupWithForm.js";

export default function ConfirmPopup(props) {
    function handleSubmit(evt) {
        evt.preventDefault();
        props.onConfirm(props.card);
    }

    return (
        <PopupWithForm
            name="confirm"
            title="Вы уверены?"
            buttonText={props.isLoading ? "Удаление..." : "Да"}
            isOpen={props.isOpen}
            onClose={props.onClose}
            onSubmit={handleSubmit}
        />
    )
}