import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import * as auth from "../utils/Authorization.js";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import { api } from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function App() {
  const history = useHistory();
  const [registerStatus, setRegisterStatus] = React.useState(false);
  const [loggedIn, setLogged] = React.useState(false);
  // const [authLink, setAuthLink] = React.useState("sign-up");
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({ isOpen: false });
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [email, setEmail] = React.useState("");

  const isOpen =
    isInfoTooltipPopupOpen ||
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.isOpen;

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(`Ошибка : ${err}`);
        });
    } else {
      api
        .putLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(`Ошибка : ${err}`);
        });
    }
  }
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((c) => {
            return c._id !== card._id;
          })
        );
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    card.isOpen = true;
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsInfoTooltipPopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ isOpen: false });
  }

  React.useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", closeByEscape);
      return () => {
        document.removeEventListener("keydown", closeByEscape);
      };
    }
  }, [isOpen]);

  function getInitialData() {
    Promise.all([api.getInitialCards(), api.getUserInfo()])
      .then((result) => {
        const [cards, user] = result;
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }

  function handleUpdateUser(userInfo) {
    api
      .patchUserInfo(userInfo)
      .then((userInfo) => {
        setCurrentUser({
          ...currentUser,
          name: userInfo.name,
          about: userInfo.about,
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }

  function handleUpdateAvatar(userInfo) {
    api
      .patchAvatar(userInfo)
      .then((userInfo) => {
        setCurrentUser({
          ...currentUser,
          avatar: userInfo.avatar,
        });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }

  function handleAddPlaceSubmit(card) {
    api
      .postCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }

  function onRegister(data) {
    auth
      .register(data)
      .then((res) => {
        if (res.email) {
          setRegisterStatus(true);
          history.push("/sign-in");
        } else {
          setRegisterStatus(false);
        }
        setIsInfoTooltipPopupOpen(true);
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }
  function checkToken() {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      auth
        .checkToken(jwt)
        .then((res) => {
          setEmail(res.email);
          setLogged(true);
          getInitialData();
          history.push("/");
        })
        .catch((err) => {
          setLogged(false);
          setIsInfoTooltipPopupOpen(true);
          console.log(`Ошибка : ${err}`);
        });
    }
  }
  function onAuthorize(data) {
    auth
      .authorize(data)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        checkToken();
      })
      .catch((err) => {
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка : ${err}`);
      });
  }

  function onLogout() {
    localStorage.removeItem("jwt");
    setLogged(false);
    history.push("/sign-in");
  }

  React.useEffect(() => {
    checkToken();
  }, [history, loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <Header loggedIn={loggedIn} onLogout={onLogout} email={email} />
        <Switch>
          <Route path="/sign-up">
            <Header authLink="sign-in" loggedIn={false} />
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/sign-in">
            <Header authLink="sign-up" loggedIn={false} />
            <Login onAuthorize={onAuthorize} />
          </Route>
          <ProtectedRoute
            path="/"
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            component={Main}
          />
        </Switch>
        <Footer loggedIn={loggedIn} />

        <InfoTooltip
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          messageStatus={registerStatus}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <PopupWithForm name="confirm" title="Вы уверены?" buttonText="Да" />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
