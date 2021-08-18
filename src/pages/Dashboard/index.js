import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';

import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';

import './dashboard.css';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';

const listaCh = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [ehVazio, setEhVazio] = useState(false);
  const [ultDoc, setultDoc] = useState();
  const [detalheCh, setDetalheCh] = useState();
  const [janela, setJanela] = useState(false);



  useEffect(() => {
    fCarregandoChs();
    return () => { }
  }, []);

  async function fCarregandoChs() {
    await listaCh.limit(5).get()
      .then((snapshot) => { fListarChs(snapshot) })
      .catch((erro) => {
        console.log(erro);
        setCarregandoMais(false)
      })
    setCarregando(false);
  }

  async function fListarChs(snapshot) {
    const listaVazia = snapshot.size === 0;

    if (!listaVazia) {
      let lista = [];
      //"map" do firebase
      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento
        })
      })

      const ultimoDoc = snapshot.docs[snapshot.docs.length - 1];//pegando ultimo doc da lista
      setultDoc(ultimoDoc);
      setChamados(chamados => [...chamados, ...lista]);

    }
    else {
      setEhVazio(true);
    }
    setCarregandoMais(false);
  }

  async function fCarregarMaisChs() {
    setCarregandoMais(true);
    await listaCh.startAfter(ultDoc).limit(5).get().then((snapshot) => { fListarChs(snapshot) })
  }

  function fJanelaDetalhes(item) {
    setJanela(!janela);
    setDetalheCh(item);
  }

  if (carregando) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Atendimentos">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados registrados</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>

        {chamados.length === 0 ? ( //Se Ñ tiver ch Cadastrado
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>

            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        ) : ( //se tiver ch Cadastrado
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>

            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormated}</td>
                      <td data-label="#">
                        <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => fJanelaDetalhes(item)} >
                          <FiSearch color="#FFF" size={17} />
                        </button>
                        <Link to={`/edit/${item.id}`} className="action" style={{ backgroundColor: '#F6a935' }}>
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {carregandoMais && <h3 style={{ textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
            {!carregandoMais && !ehVazio && <button className="btn-more" onClick={fCarregarMaisChs}>Buscar mais</button>}
          </>
        )}
      </div>
      {janela && (
        <Modal
          conteudo={detalheCh}
          close={fJanelaDetalhes}
        />
      )}
    </div>
  )
}