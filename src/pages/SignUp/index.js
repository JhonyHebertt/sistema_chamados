
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import './signup.css';
import logo from '../../assets/logo.png';

export default function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { fCadastrar, loadingAuth } = useContext(AuthContext);

  function fCadastro(e) {
    e.preventDefault();

    if (nome !== '' && email !== '' && senha !== '') {
      fCadastrar(email, senha, nome)
    }

  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo" />
        </div>

        <form onSubmit={fCadastro}>
          <h1>Cadastrar</h1>
          <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="*******" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button type="submit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
        </form>

        <Link to="/">Já tem uma conta? Entre</Link>
      </div>
    </div>
  );
}
