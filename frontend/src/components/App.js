import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
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
  const [userEmail, setUserEmail] = React.useState("");
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
  const isOpen =
    isInfoTooltipPopupOpen ||
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.isOpen;

  React.useEffect(() => {
    if (!loggedIn) return;
    api
      .getUserInfo()
      .then(setCurrentUser)
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }, [loggedIn]);

  React.useEffect(() => {
    if (!loggedIn) return;
    api
      .getInitialCards()
      .then((res) => {
        setCards(res?.reverse());
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
      });
  }, [loggedIn]);

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

  function onRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setUserEmail(email);
        setRegisterStatus(true);
        setIsInfoTooltipPopupOpen(true);
        history.push("/signin");
      })
      .catch((err) => {
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка : ${err}`);
      });
  }

  function onAuthorize(email, password) {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("jwt", res.token);
          api.setToken(res.token);
          setUserEmail(email);
          setLogged(true);
          history.push("/");
        }
      })
      .catch((err) => {
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка : ${err}`);
      });
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setLogged(false);
    history.push("/signin");
  }

  React.useEffect(() => {
    const onCheckToken = () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        return;
      }
      auth
        .checkToken(jwt)
        .then((res) => {
          setUserEmail(res.email);
          setLogged(true);
          history.push("/");
        })
        .catch((err) => {
          console.log(`Ошибка : ${err}`);
        });
    };
    onCheckToken();
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <Header
          loggedIn={loggedIn}
          onSignOut={onSignOut}
          userEmail={userEmail}
        />
        <Switch>
          <ProtectedRoute
            path="/"
            loggedIn={loggedIn}
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>

          <Route path="/signin">
            <Login onAuthorize={onAuthorize} />
          </Route>

          <Route exact path="*">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
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
