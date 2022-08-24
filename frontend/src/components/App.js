import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
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
import Login from "./Login";
import Register from "./Register";
import { api } from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function App() {
  const history = useHistory();
  const [registerStatus, setRegisterStatus] = React.useState(false);
  const [loggedIn, setLogged] = React.useState(false);
  const [email, setEmail] = React.useState('')
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

  function onRegister(password, email) {
    auth.register(password, email)
      .then((res) => {
        if (res.statusCode !== 201) {
          setEmail(res.email);
          setRegisterStatus(true);
          history.push("/sign-in");
          setIsInfoTooltipPopupOpen(true);
        }
      })
      .catch((err) => {
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка : ${err}`);
      });
  }

  function onAuthorize(password, email) {
    auth
      .authorize(password, email)
      .then((token) => {
        auth.checkToken(token)
        .then((res) => {
          setLogged(true);
          setEmail(res.email);
          history.push("/");
        })
      })
      .catch((err) => {
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(`Ошибка : ${err}`);
      });
  }

  function onSignOut() {
    localStorage.removeItem('jwt');
    setLogged(false)
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setLogged(true)
            setEmail(res.email)
            history.push('/')
          }
        })
        .catch((err) => console.log(err))
    }
  };

  React.useEffect(() => {
    tokenCheck()
  }, []);

  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user)
          setCards(cards.reverse())
        })
        .catch((err) => console.log(err));
      tokenCheck()
    }
  }, [loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Header loggedIn={loggedIn} onSignOut={onSignOut} email={email} />

            <Main
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />

            <Footer loggedIn={loggedIn}/>
          </ProtectedRoute>

          <Route path="/sign-in">
            <Header authLink="sign-up" loggedIn={false} />
            <Login onAuthorize={onAuthorize} />
          </Route>

          <Route path="/sign-up">
            <Header authLink="sign-in" loggedIn={false} />
            <Register onRegister={onRegister} />
          </Route>

          <Route exact path="/">
            {loggedIn ? <Redirect to="*" /> : <Redirect to="/sign-in" />}
          </Route>
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
