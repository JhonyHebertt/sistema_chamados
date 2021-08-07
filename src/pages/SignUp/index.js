
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './signup.css';
import { AuthContext } from '../../contexts/auth'
import logo from '../../assets/logo.png';

export default function SignUp() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { signUp } = useContext(AuthContext);

  function Acessar(e) {
    e.preventDefault();

    if (nome !== '' && email !== '' && senha !== '') {
      signUp(email, senha, nome)
    }
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="logo" />
        </div>

        <form onSubmit={Acessar} >
          <h1>Cadastrar</h1>
          <input type="text" placeholder="seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="teste@teste.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="********" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit" > Cadastrar</button>
        </form>

        <Link to="/" >Já tem uma Conta? Entre</Link>
      </div>

    </div>
  )
}
