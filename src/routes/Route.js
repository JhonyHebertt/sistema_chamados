

import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';

export default function RouteWrapper({ component: Component, isPrivate, ...rest }) {
  const { logado, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div></div>
    )
  }

  if (!logado && isPrivate) {
    return <Redirect to="/" />
  }

  //Não deixa voltar pra pagina de login/cadastro caso esteja logado
  if (logado && !isPrivate) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Route
      {...rest}
      render={props => (
        <Component {...props} />
      )}
    />
  )
}