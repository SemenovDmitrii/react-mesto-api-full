import { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import * as auth from "../utils/Authorization.js";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmPopup from "./ConfirmPopup.js";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import api from "../utils/Api.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function App() {
  const history = useHistory();
  const [registerStatus, setRegisterStatus] = useState(false);
  const [loggedIn, setLogged] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ isOpen: false });
  const [currentUser, setCurrentUser] = useState({});
  const [removedCard, setRemovedCard] = useState({});
  const [cards, setCards] = useState([]);
  const [email, setUserEmail] = useState("");
  const isOpen =
    isInfoTooltipPopupOpen ||
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isConfirmPopupOpen ||
    selectedCard.isOpen;

  useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards([])])
      .then(([userInfo, cards]) => {
        setCurrentUser(userInfo.data);
        setCards(cards.card.reverse());
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [history, loggedIn]);

  function handleCardLike(card) {
  //   const isLiked = card.likes.some((i) => i._id === currentUser._id);
  //   api
  //     .changeLikeCardStatus(card._id, isLiked)
  //     .then((newCard) => {
  //       setCards((state) =>
  //         state.map((c) => (c._id === card._id ? newCard.card : c))
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  const isLiked = card.likes.some(i => i === currentUser._id)
  api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard.card : c))

    }).catch((err) => {
      console.log(err);
    });
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
        closeAllPopups();
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
  function handleCardDeleteClick(card) {
    setIsConfirmPopupOpen(true);
    setRemovedCard(card);
  }

  function closeAllPopups() {
    setIsInfoTooltipPopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ isOpen: false });
    setIsConfirmPopupOpen(false);
  }

  useEffect(() => {
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

  function handleUpdateUser({ name, about }) {
    api
      .patchUserInfo(name, about)
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

  function handleUpdateAvatar({ avatar }) {
    api
      .patchAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .postCard(name, link)
      .then((newCard) => {
        setCards([newCard.card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    const userToken = localStorage.getItem("jwt");
    if (userToken) {
      auth
        .getToken(userToken)
        .then((data) => {
          setLogged(true);
          setUserEmail(data.email);
          history.push("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn, history]);

  function handleRegistration(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setRegisterStatus(true);
          setIsInfoTooltipPopupOpen(true);
          history.push("/sign-in");
        }
      })
      .catch((err) => {
        console.log(err);
        setLogged(false);
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
      });
  }

  function handleAuthorize({ email, password }) {
    auth
      .authorize({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setLogged(true);
        setUserEmail(email);
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
        setRegisterStatus(false);
        setIsInfoTooltipPopupOpen(true);
      });
  }

  function handleSignOut() {
    localStorage.removeItem("jwt");
    setLogged(false);
    history.push("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <Header email={email} onSignOut={handleSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDeleteClick}
            cards={cards}
            component={Main}
          />
          <Route path="/sign-in">
            <Login onLogin={handleAuthorize} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={handleRegistration} />
          </Route>
        </Switch>

        <Footer />

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
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onConfirm={handleCardDelete}
          card={removedCard}
        />
        {/* <PopupWithForm name="confirm" title="Вы уверены?" buttonText="Да" /> */}
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
