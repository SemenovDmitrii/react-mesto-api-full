import React, { useEffect, useState } from "react";
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
import api from "../utils/Api.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function App() {
  const history = useHistory();
  const [registerStatus, setRegisterStatus] = useState(false);
  const [loggedIn, setLogged] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
    useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ isOpen: false });
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [email, setUserEmail] = useState("");
  const isOpen =
    isInfoTooltipPopupOpen ||
    isEditAvatarPopupOpen ||
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    selectedCard.isOpen;

  // React.useEffect(() => {
  //   if (!loggedIn) return;
  //   api.getUserInfo().then(setCurrentUser).catch(console.error);
  // }, [loggedIn]);

  // React.useEffect(() => {
  //   if (!loggedIn) return;
  //   api
  //     .getInitialCards()
  //     .then((res) => {
  //       setCards(res?.reverse());
  //     })
  //     .catch((err) => console.error(err));
  // }, [loggedIn]);

  // useEffect(() => {
  //   checkToken();
  //   if (loggedIn) {
  //     history.push('/');
  //   Promise.all([api.getUserInfo(), api.getInitialCards()])
  //     .then(([userInfo, cards]) => {
  //       setCurrentUser(userInfo);
  //       setCards(cards.reverse());
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //     }
  // }, [loggedIn]);

  // const checkToken = () => {
  //   const token = localStorage.getItem('jwt');
  //   if(token) {
  //     setLogged(true);
  //   auth
  //     .getToken(token)
  //     .then((res) => {
  //       if(res) {
  //         setUserEmail(res.email)
  //       };
  //       history.push('/');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // }

  // React.useEffect(() => {
  //   const token = localStorage.getItem("jwt");
  //   if (token) {
  //     auth
  //       .checkToken(token)
  //       .then((data) => {
  //         setLogged(true);
  //         setUserEmail(data.email);
  //         history.push("/");
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [history]);

  // React.useEffect(() => {
  //   if (loggedIn) {
  //     Promise.all([api.getUserInfo(token), api.getInitialCards(token)])
  //       .then((resData) => {
  //         const [userData, cardList] = resData;
  //         setCurrentUser(userData.data);
  //         setCards(cardList.reverse());
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [loggedIn, token]);

  // React.useEffect(() => {
  //   loadToken();
  //   if (loggedIn) {
  //     history.push('/');
  //   Promise.all([api.getUserInfo(), api.getInitialCards()])
  //     .then(([userInfo, cards]) => {
  //       setCurrentUser(userInfo);
  //       setCards(cards.reverse());
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //     }
  // }, [loggedIn]);

  // const loadToken = () => {
  //   const token = localStorage.getItem('jwt');
  //   if(token) {
  //     setLogged(true);
  //   auth
  //     .checkToken(token)
  //     .then((res) => {
  //       if(res) {
  //         setUserEmail(res.email)
  //       };
  //       history.push('/');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   }
  // }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
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

  function handleRegistration(password, email) {
    // return auth
    //   .registration(password, email)
    //   .then(() => {
    //     setUserEmail(email);
    //     setRegisterStatus(true);
    //     setIsInfoTooltipPopupOpen(true);
    //     history.push("/sign-in");
    //   })
    //   .catch((err) => {
    //     setRegisterStatus(false);
    //     setIsInfoTooltipPopupOpen(true);
    //     console.log(`Ошибка регистрации. ${err}`);
    //   });
    auth.registration(password, email)
            .then(() => {
                setRegisterStatus(true);
                setIsInfoTooltipPopupOpen(true);
                history.push("/sign-in");

            })
            .catch((err) => {
              setRegisterStatus(false);
                  setIsInfoTooltipPopupOpen(true);
                console.log(err)
            });
  }

  function handleAuthorize(password, email) {
    // return auth
    //   .authorize(email, password)
    //   .then((data) => {
    //       localStorage.setItem("jwt", data.token);
    //       setLogged(true);
    //       setUserEmail(email);
    //       history.push("/");
    //   })
    //   .catch((err) => {
    //     setRegisterStatus(false);
    //     setIsInfoTooltipPopupOpen(true);
    //     console.log(`Невозможно войти. ${err}`);
    //   });
    auth.authorize(password, email)
            .then((data) => {
                setLogged(true);
                localStorage.setItem('jwt', data.token);
                tokenCheck();
                setUserEmail(email);
                history.push('/');
            }).catch((error) => {
            console.log(error);
        })
  }

  const tokenCheck = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
        auth.getToken(token)
            .then((res) => {
                if (res) {
                    setUserEmail(res.data.email);
                    setLogged(true);
                }
            }).catch(error => console.log(error));
    }
}

useEffect(() => {
  tokenCheck();
}, []);

useEffect(() => {
  if (loggedIn) {
      history.push('/sign-up');
      return;
  }
  history.push('/');
}, [loggedIn]);

  function handleSignOut() {
    localStorage.removeItem("jwt");
    setLogged(false);
    history.push("/sign-in");
  }

  // useEffect(() => {
  //   const handleCheckToken = () => {
  //     const jwt = localStorage.getItem("jwt");
  //     if (!jwt) {
  //       return;
  //     }
  //     auth
  //       .checkToken(jwt)
  //       .then((res) => {
  //         setUserEmail(res.email);
  //         setLogged(true);
  //         history.push("/");
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   handleCheckToken();
  // }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
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
            onCardDelete={handleCardDelete}
            cards={cards}
            component={Main}
          />

          <Route path="/sign-in">
            <Header authLink="sign-up" loggedIn={loggedIn} userEmail={email} />
            <Login onAuthorize={handleAuthorize} />
          </Route>

          <Route path="/sign-up">
            <Header authLink="sign-in" loggedIn={loggedIn} userEmail={email} />
            <Register onRegister={handleRegistration} />
          </Route>

          <Route exact path="*">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
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
        <PopupWithForm name="confirm" title="Вы уверены?" buttonText="Да" />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
