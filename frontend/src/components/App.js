import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import api from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import Login from "./Login";
import Register from "./Register";
import * as auth from "../utils/auth.js";
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

function App() {
  const history = useHistory();
  const [registerStatus, setRegisterStatus] = React.useState(false);
  const [loggedIn, setLogged] = React.useState(false);
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
  const [email, setUserEmail] = React.useState("");
  const isOpen =
    isInfoTooltipPopupOpen ||
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.isOpen;

    React.useEffect(() => {
    checkToken();
    if (loggedIn) {
      history.push("/");
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, cards]) => {
          setCurrentUser(userInfo);
          setCards(cards.reverse());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  const checkToken = () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setLogged(true);
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setUserEmail(res.email);
          }
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // React.useEffect(() => {
  //   const jwt = localStorage.getItem("jwt");
  //   if (jwt) {
  //     auth
  //       .checkToken(jwt)
  //       .then((res) => {
  //         if (res) {
  //           setLogged(true);
  //           setUserEmail(res.email);
  //           history.push("/");
  //         } else {
  //           setLogged(false);
  //           setUserEmail("");
  //         }
  //       })
  //       .catch((err) => console.log("Error: ", err));
  //   }
  // }, []);

  // React.useEffect(() => {
  //   if (loggedIn === true) {
  //     Promise.all([api.getInitialCards(), api.getUserInfo()])
  //       .then(([cards, userInfo]) => {
  //         setCards(cards);
  //         setCurrentUser(userInfo);
  //       })
  //       .catch((err) => console.log("Error: ", err));
  //     history.push("/");
  //   }
  // }, [loggedIn, history]);

  function onRegister(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        setRegisterStatus(true);
        setIsInfoTooltipPopupOpen(true);
        history.push("/sign-in");
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
      });
  }

  function onAuthorize(password, email) {
    auth
      .authorize(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setLogged(true);
        setUserEmail(email);
        history.push("/");
      })
      .catch((err) => {
        console.log(`Ошибка : ${err}`);
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
      });
  }

  function onLogout() {
    localStorage.removeItem("jwt");
    setLogged(false);
    history.push("/sign-in");
    setUserEmail("");
  }

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
        setCards((state) => state.filter((c) => c._id !== card._id));
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <Switch>
          <Route exact path="/sign-in">
            <Header authLink="sign-up" loggedIn={false} />
            <Login onAuthorize={onAuthorize} />
          </Route>

          <Route exact path="/sign-up">
            <Header authLink="sign-in" loggedIn={false} />
            <Register onRegister={onRegister} />
          </Route>

          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header loggedIn={loggedIn} email={email} onLogout={onLogout} />
            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />

            <Footer />
          </ProtectedRoute>
        </Switch>

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
