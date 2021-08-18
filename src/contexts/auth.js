
import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);//Dados do usuario logado
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //busca dados o usuario salvo no localStorage caso exista
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
  async function fLogar(email, password) {
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
        toast.success('Bem vindo de volta!');
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
        toast.error('Email/Senha inválido!');
      })

  }

  //Cadastrando um novo usuario
  async function fCadastrar(email, password, nome) {
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
            toast.success('Bem vindo a plataforma!');
          })
      })
      .catch((error) => {
        console.log(error);
        toast.error('Ops algo deu errado!');
        setLoadingAuth(false);
      })
  }

  //Salvando no localStorage os dados do usuario
  function storageUser(data) {
    localStorage.setItem('Sistema CRM', JSON.stringify(data));
  }

  //Logout do usuario
  async function fDeslogar() {
    await firebase.auth().signOut();
    localStorage.removeItem('Sistema CRM');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        logado: !!user,
        user,
        loading,
        fCadastrar,
        fDeslogar,
        fLogar,
        loadingAuth,
        setUser,
        storageUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
