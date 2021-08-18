
import { useState, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';

import firebase from '../../services/firebaseConnection';

import avatar from '../../assets/avatar.png';
import { FiSettings, FiUpload } from 'react-icons/fi';
import './profile.css';

export default function Profile() {
  const { user, setUser, storageUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user && user.nome);
  const email = (user && user.email);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [ImgUpload, setImgUpload] = useState(null);

  async function fSalvar(e) {
    e.preventDefault();

    //salvar só o nome
    if (ImgUpload === null && nome !== '') {
      await firebase.firestore().collection('users').doc(user.uid).update({ nome: nome })
        .then(() => {
          let data = {
            ...user,
            nome: nome
          };
          setUser(data);
          storageUser(data);
        })
    }
    else //salvar nome e imagem
      if (ImgUpload !== null && nome !== '') {
        fSalvarDados()
      }
  }

  function fCarregarImg(e) {
    if (e.target.files[0]) {
      const imagem = e.target.files[0];

      if (imagem.type === 'image/jpeg' || imagem.type === 'image/png') {
        setImgUpload(imagem);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
      }
      else {
        alert('Envei uma imagem "jpeg" ou "png"');
        setImgUpload(null);
        return null;
      }
    }
  }

  async function fSalvarDados() {
    const idAtual = user.uid;

    const upload = await firebase.storage().ref(`images/${idAtual}/${ImgUpload.name}`).put(ImgUpload).then(
      async () => {
        await firebase.storage().ref(`images/${idAtual}`).child(ImgUpload.name).getDownloadURL()
          .then(
            async (url) => {
              let urlFoto = url;

              await firebase.firestore().collection('users').doc(user.uid).update({
                avatarUrl: urlFoto,
                nome: nome
              })
                .then(() => {
                  let data = {
                    ...user,
                    avatarUrl: urlFoto,
                    nome: nome
                  };
                  setUser(data);
                  storageUser(data);
                })
            }
          )
      })
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Meu perfil">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={fSalvar} >

            <label className="label-avatar">
              <span>
                <FiUpload color="#FFF" size={25} />
              </span>

              <input type="file" accept="image/*" onChange={fCarregarImg} /><br />
              {avatarUrl === null ?
                <img src={avatar} width="250" height="250" alt="Foto de perfil do usuario" />
                :
                <img src={avatarUrl} width="250" height="250" alt="Foto de perfil do usuario" />
              }
            </label>

            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>Email</label>
            <input type="text" value={email} disabled={true} />

            <button type="submit">Salvar</button>

          </form>
        </div>
      </div>
    </div>
  )
}