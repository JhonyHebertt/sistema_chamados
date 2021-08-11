
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';

export default function Dashboard() {
  const { signOut } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <div className="content">
        <h1>PAGINA DASHBOARD</h1>
        <button onClick={() => signOut()}>Fazer logout</button>
      </div>
    </div>
  )
}