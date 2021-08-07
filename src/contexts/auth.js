
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

  async function signUp(email, senha, nome) {
    setLoading(true);
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
      .then(async (value) => {
        let uid = value.user.uid;

        await firebase.firestore().collection('users').doc(uid).set(
          {
            nome: nome,
            avatarUrl: null,
          }
        )
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

  function storageUser(data) {
    localStorage.setItem('Sistema CRM', JSON.stringify(data));
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
