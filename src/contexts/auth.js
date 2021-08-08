
import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    function loadStorage() {
      const storageUser = localStorage.getItem('Sistema CRM');

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }

    loadStorage();

  }, [])


  //Fazendo login do usuario
  async function signIn(email, password) {
    setLoadingAuth(true);

    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const usuario = await firebase.firestore().collection('users').doc(uid).get();

        let data = {
          uid: uid,
          nome: usuario.data().nome,
          avatarUrl: usuario.data().avatarUrl,
          email: value.user.email
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);


      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      })

  }

  //Cadastrando um novo usuario
  async function signUp(email, password, nome) {
    setLoadingAuth(true);

    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await firebase.firestore().collection('users').doc(uid).set({
          nome: nome,
          avatarUrl: null,
        })
          .then(() => {

            let data = {
              uid: uid,
              nome: nome,
              email: value.user.email,
              avatarUrl: null
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);

          })

      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      })

  }

  //Salvando no localStorage os dados do usuario
  function storageUser(data) {
    localStorage.setItem('Sistema CRM', JSON.stringify(data));
  }

  //Logout do usuario
  async function signOut() {
    await firebase.auth().signOut();
    localStorage.removeItem('Sistema CRM');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signUp,
        signOut,
        signIn,
        loadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
