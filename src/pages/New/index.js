import { useState, useEffect, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

import './new.css';
import { FiPlus } from 'react-icons/fi'

export default function New() {
  const { id } = useParams();
  const history = useHistory();

  const [carregandoClientes, setCarregandoClientes] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(0);
  const [editCliente, setEditCliente] = useState(false);

  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function buscarClientes() {
      await firebase.firestore().collection('customers').get()
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })

          if (lista.length === 0) {
            console.log('Nenhum cliente cadastrado');
            setCarregandoClientes(false);
            setClientes([{ id: '1', nomeFantasia: 'Sugestão' }]);
            return;
          }

          setClientes(lista);
          setCarregandoClientes(false);

          if (id) {
            fCarregarid(lista);
          }

        })
        .catch((error) => {
          console.log(error);
          setCarregandoClientes(false);
          setClientes([{ id: '1', nomeFantasia: '' }]);
        })
    }
    buscarClientes();
  }, [id]);

  async function fCarregarid(lista) {
    await firebase.firestore().collection('chamados').doc(id).get()
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
        setClienteSelecionado(index);
        setEditCliente(true);
      })
      .catch((error) => {
        console.log(error);
        setEditCliente(false);
      })
  }

  async function fRegistrar(e) {
    e.preventDefault();

    if (!editCliente) {
      await firebase.firestore().collection('chamados').add({
        created: new Date(),
        cliente: clientes[clienteSelecionado].nomeFantasia,
        clienteId: clientes[clienteSelecionado].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
        .then(() => {
          toast.success('Chamado registrado!');
          setClienteSelecionado(0);
          setComplemento('');
          setAssunto('Suporte');
          setStatus('Aberto');
          history.push('/dashboard');
        })
        .catch((erro) => {
          console.log(erro);
          toast.error('Erro ao salvar!');
        })
    }
    else {
      await firebase.firestore().collection('chamados').doc(id).update({
        cliente: clientes[clienteSelecionado].nomeFantasia,
        clienteId: clientes[clienteSelecionado].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
        .then(() => {
          toast.success('Chamado editado com sucesso!');
          setClienteSelecionado(0);
          setComplemento('');
          setAssunto('Suporte');
          setStatus('Aberto');
          history.push('/dashboard');
        })
        .catch((error) => { console.log(error); toast.error('Erro ao editar chamado!') })
    }

  }

  function fCarregarClientes(e) {
    setClienteSelecionado(e.target.value);
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Novo chamado">
          <FiPlus size={25} />
        </Title>

        <div className="container">

          <form className="form-profile" onSubmit={fRegistrar} >

            <label>Cliente</label>
            {carregandoClientes ? (
              <input type="text" disabled={true} value="Carregando clientes..." />
            ) : (
              <select value={clienteSelecionado} onChange={fCarregarClientes} >
                {clientes.map((item, index) => {
                  return (
                    <option key={item.id} value={index} >
                      {item.nomeFantasia}
                    </option>
                  )
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={(e) => setAssunto(e.target.value)} >
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input type="radio" name="radio" value="Aberto" onChange={(e) => setStatus(e.target.value)} checked={status === 'Aberto'} />
              <span>Em Aberto</span>

              <input type="radio" name="radio" value="Progresso" onChange={(e) => setStatus(e.target.value)} checked={status === 'Progresso'} />
              <span>Progresso</span>

              <input type="radio" name="radio" value="Atendido" onChange={(e) => setStatus(e.target.value)} checked={status === 'Atendido'} />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea type="text" placeholder="Descreva seu problema (opcional)." value={complemento} onChange={(e) => setComplemento(e.target.value)} />

            <button type="submit">fRegistrar</button>

          </form>

        </div>

      </div>
    </div>
  )
}