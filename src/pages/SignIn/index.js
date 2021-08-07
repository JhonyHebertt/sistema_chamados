
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './signin.css';
import logo from '../../assets/logo.png';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function Acessar(e) {
    e.preventDefault();
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="logo" />
        </div>

        <form onSubmit={Acessar} >
          <h1> Entra</h1>
          <input type="text" placeholder="teste@teste.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit" > Acessar</button>
        </form>

        <Link to="/register" >Criar Conta</Link>
      </div>

    </div>
  )
}
