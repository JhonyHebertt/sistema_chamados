import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

import './signin.css';
import Logo from '../../assets/logo.png'

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { fLogar, loadingAuth } = useContext(AuthContext);

  function fAcessar(e) {
    e.preventDefault();

    if (email !== '' && senha !== '') {
      fLogar(email, senha)
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={Logo} alt="Sistema Logo" />
        </div>

        <form onSubmit={fAcessar}>
          <h1>Entrar</h1>
          <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="*******" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
        </form>

        <Link to="/register">Criar conta</Link>
      </div>
    </div>
  );
}