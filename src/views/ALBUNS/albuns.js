import React, { useState, useEffect } from 'react';
import '../PUBLICACOES/PublicacoesView.css';
import axios from 'axios';
import handleSubmit from './criar_evento';
import TopicSelector from './topicSelector'; // Import TopicSelector component
import { useNavigate } from 'react-router-dom';
import CreatealbumButton from '../../componentes/botao_view_eventos/criar_evento';
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import moment from 'moment';
import 'moment/locale/pt'; // Importar o locale português
import Modal from 'react-modal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useParams } from 'react-router-dom';

moment.locale('pt'); // Definir o locale para português

const AlbunsView = () => {
  const { areaId } = useParams();
  const [albuns, setAlbuns] = useState([]); // Inicialize como um array vazio
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showalbunsList, setShowalbunsList] = useState(true);
    const [selectedButton, setSelectedButton] = useState('list'); // Default to "list" button
    const [centroId, setCentroId] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [albumToDelete, setalbumToDelete] = useState(null);
    const [showHideModal, setShowHideModal] = useState(false);
    const [albumToHide, setalbumToHide] = useState(null);
    const [removalReason, setRemovalReason] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [albumToEdit, setalbumToEdit] = useState(null);
    const [album, setalbum] = useState(null);
    const [showSuccessMessageDelete, setShowSuccessMessageDelete] = useState(false);
    const [showSuccessMessageHide, setShowSuccessMessageHide] = useState(false);
    const [filter, setFilter] = useState('all');
    const [showDetailViewDenunciada, setShowDetailViewDenunciada] = useState(false);
    const [albumDetailDenunciada, setalbumDetailDenunciada] = useState(null);
    const [showMedidasModal, setShowMedidasModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showSuccessMessageAlert, setShowSuccessMessageAlert] = useState(false);
    
    const [selectedAlbum, setselectedAlbum] = useState(null);
    const [showDeleteModalMedidas, setShowDeleteModalMedidas] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [showSuccessMessageMedidas, setShowSuccessMessageMedidas] = useState(false);
    const [showApprovalView, setShowApprovalView] = useState(false);
    const [albumDetail, setalbumDetail] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('descricao');
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectMessage, setRejectMessage] = useState('');
    const [showDetailView, setShowDetailView] = useState(false);
    const [albumDetailActive, setalbumDetailActive] = useState(null);
    const weekDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [showReportedModal, setShowReportedModal] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState('');
    const [descricao, setDescricao] = useState('');
    const [paginaweb, setPaginaweb] = useState('');
    const [telemovel, setTelemovel] = useState('');
    const [selectedField, setSelectedField] = useState('');
    const [formFields, setFormFields] = useState([{ name: '' }]);
    const [showFormModal, setShowFormModal] = useState(false);
    const [email, setEmail] = useState('');
    const [horario, setHorario] = useState({
    "Inicio": { inicioData: '', InicioHora: '' },
    "Fim": { fimData: '', FimHora: ''}

});


const [dataInicioAtividade, setDataInicioAtividade] = useState('');
const [dataFimAtividade, setDataFimAtividade] = useState('');



const [estado, setEstado] = useState('');
const [capaImagemalbum, setCapaImagemalbum] = useState('');
const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);
const [tipodealbum, setTipoDealbum] = useState('');


const [novaClassificacao, setNovaClassificacao] = useState(0);

const [imagensGaleria, setImagensGaleria] = useState([]);

const [localizacao, setLocalizacao] = useState('');
const navigate = useNavigate();
const [imageSrc, setImageSrc] = useState(null); // Estado para imagem escolhida
const [galeria, setGaleria] = useState([]); // Estado para a galeria de imagens
const [topicos, setTopicos] = useState([]);

; // Defina o ID da área aqui

const [showAllComentarios, setShowAllComentarios] = useState(false);
const [comentariosExibidos, setComentariosExibidos] = useState([]);
useEffect(() => {
  setComentariosExibidos(showAllComentarios ? comentarios : comentarios.slice(0, 1));
}, [comentarios, showAllComentarios]);

const [loading, setLoading] = useState(false);

const [isOpen, setIsOpen] = useState(false); 
// Form states
const [nome, setNome] = useState('');
const [autor,setAutor] = useState({ nome: '', sobrenome: '', caminho_foto: ''});
const [topico, setTopico] = useState('');
const autor_id = sessionStorage.getItem('user_id');

const [userId, setUserId] = useState(null);
const [user, setUser] = useState({ nome: '', sobrenome: '', caminho_foto: ''  });

const [estrelas, setEstrelas] = useState(1);
const [mediaAvaliacoes, setMediaAvaliacoes] = useState(null);

const [comentariosParaRemover, setComentariosParaRemover] = useState([]);
const [firstName, setFirstName] = useState('');

const [participantes, setParticipantes] = useState([]);

const [modalIsOpen, setModalIsOpen] = useState(false);

const [dataalbum, setDataalbum] = useState('');

const openModalParticipantes = () => {
  setModalIsOpen(true); // Abre o modal
};

const closeModalParticipantes = () => {
  setModalIsOpen(false); // Fecha o modal
};

const [showComentarioModal, setShowComentarioModal] = useState(false);

useEffect(() => {
  if (modalIsOpen) {
    console.log("Modal está aberto agora!");
    // Aqui você poderia, por exemplo, carregar dados adicionais necessários para o modal.
  }
}, [modalIsOpen]); // A dependência modalIsOpen faz com que o efeito seja executado sempre que modalIsOpen muda.


const handleChange = (event) => {
  setFirstName(event.target.value);
};

const handleClear = () => {
  setFirstName('');
};

useEffect(() => {
  const storedCentroId = sessionStorage.getItem('centro_id');
  if (storedCentroId) {
    setCentroId(storedCentroId);
  }
}, []);

useEffect(() => {
  const buscaralbuns = async () => {
    if (!areaId) {
      console.log('areaid não definido');
      return;
    }
    console.log(`Buscando albuns para areaid: ${areaId}`);
    try {
      const response = await axios.get(`https://backend-teste-q43r.onrender.com/albuns/listByArea/${areaId}`);
      if (response.data && Array.isArray(response.data)) {
        console.log(response.data);
        setAlbuns(response.data);
      } else {
        console.error('Resposta da API vazia ou formato de dados incorreto');
      }
    } catch (error) {
      console.error('Erro ao buscar publicações:', error);
      setError(error.message);
    }
  };

  buscaralbuns();
}, [areaId]);


const handleViewDetailsClick = (album) => {
  setselectedAlbum(album);
  setShowDetailView(true);
};

const [areas, setAreas] = useState('');

useEffect(() => {
  // Função para buscar as áreas da API
  const fetchAreas = async () => {
    try {
      const response = await axios.get('https://backend-teste-q43r.onrender.com/areas/listarAreas'); // Substitua com a URL correta da sua API para buscar as áreas
      setAreas(response.data);
    } catch (error) {
      console.error('Erro ao buscar áreas:', error);
    }
  };

  fetchAreas();
}, []);


const handlePendingViewClick = (album) => {
  setalbumDetail(album);
  setShowApprovalView(true);
};

const handleReportedViewClick = (album) => {
  setalbumDetailDenunciada(album);
  setShowDetailViewDenunciada(true);
};



// Form states
const handleHideClick = (album) => {
  setalbumToHide(album);
  setShowHideModal(true);
};

const handleEditClick = (album) => {
  setalbumToEdit(album);
  setselectedAlbum(album );
  setShowEditForm(true);
  setShowalbunsList(false);
  setShowMedidasModal(false);
  setShowDetailViewDenunciada(false); // Fechar o modal "Tomar Medidas"
};



const handleCancelHide = () => {
  setShowHideModal(false);
  setalbumToHide(null);
  setRemovalReason('');
};

const handleTabClick = (tab) => {
  setActiveTab(tab);
};

const handleDeleteClick = (album) => {
  setalbumToDelete(album);
  setShowDeleteModal(true);
};

const handleDeleteConfirm = () => {
  setShowDeleteModal(false);
  // Aqui você deve realizar a lógica para realmente deletar a publicação
  setShowSuccessMessage(true); // Exibir a mensagem de sucesso após a exclusão
};


const closeDeleteModal = () => {
  setShowDeleteModal(false);
  setalbumToDelete(null);
};
const handleCancelDelete = () => {
  setShowDeleteModal(false);
  setalbumToDelete(null);
};
const handleConfirmDelete = async () => {
  try {
    await axios.delete(`https://backend-teste-q43r.onrender.com/albuns/delete/${albumToDelete.id}`);
    setAlbuns(albuns.filter(p => p.id !== albumToDelete.id));
    setShowSuccessMessageDelete(true); // Exibir a mensagem de sucesso após a exclusão
  } catch (error) {
    if (error.response) {
      // O servidor respondeu com um status fora do intervalo 2xx
      console.error('Erro na resposta da API:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // A requisição foi feita, mas nenhuma resposta foi recebida
      console.error('Erro na requisição:', error.request);
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Erro ao configurar a requisição:', error.message);
    }
    console.error('Erro ao deletar album:', error.config);
  }
  setShowDeleteModal(false);
};







const openModal = () => {
  setShowFormModal(true);
};

// Função para fechar a modal
const closeModal = () => {
  setShowFormModal(false);
};



const addFieldToForm = () => {
  if (selectedField) {
    setFormFields([...formFields, { type: selectedField, value: '' }]);
    setSelectedField('');
    closeModal();
  }
};




const formatarData = (data) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(data).toLocaleDateString('pt-PT', options);
};

const handleCreatealbumClick = () => {
  setShowCreateForm(true);
  setShowalbunsList(false);
  setSelectedButton('create'); // Set the selected button
};


const handleCreateForm = () => {

  //setShowCreateForm(true);
  setShowSuccessMessage(true);
};


const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('Iniciando handleSubmit'); // Log para verificar se a função está sendo chamada

  

  const albumData = {
    nome, 
    area_id: area, // Nome do album
    descricao, 
    centro_id: centroId,
    autor_id: sessionStorage.getItem('user_id')
  };
  
  console.log('Dados do Album:', albumData); // Log dos dados que serão enviados

  try {
      const response = await axios.post('https://backend-teste-q43r.onrender.com/albuns/create', albumData, {
          headers: {
              'Content-Type': 'application/json',
          },
      });

      console.log('Resposta do Backend:', response); // Log da resposta do backend

      if (response.status === 201) { // Ajuste o código de status para 201 Created
          setShowSuccessMessage(true); // Mostrar modal de sucesso
      } else {
          console.error('Erro na resposta do Backend:', response); // Log de erro caso a resposta não seja 201
          // Lógica de erro
      }
  } catch (error) {
      console.error('Erro ao criar album:', error); // Log do erro
  }
};


const handleShowalbumListClick = () => {
  setShowCreateForm(false);
  setShowalbunsList(true);
  setSelectedButton('list'); // Set the selected button
};

const handleCreatealbunsubmit = ({ nome, topico }) => {
  // Adiciona a nova publicação aos dados estáticos
  const novoalbum = {
    id: albuns.length + 1,
    nome,
    topico,
    createdAt: new Date().toISOString(),
    estado: "Active"
  };
  setAlbuns([...albuns, novoalbum]);
  setShowCreateForm(false);
  setShowalbunsList(true);
};

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
};


const handleDelete = (album) => {
  // Aqui você deve adicionar a lógica para deletar a publicação
  // Após deletar, você pode atualizar o estado `publicacoes` para remover a publicação
  setAlbuns(albuns.filter(p => p.id !== album.id));
  closeDeleteModal();
};

const handleConfirmHide = () => {
  handleToggleVisibility(albumToHide);
  setShowHideModal(false);
  setRemovalReason('');
  setShowSuccessMessageHide(true); // Exibir a mensagem de sucesso após ocultar
};


const containerStyle = {
  width: '100%',
  height: '200px'
};

const center = {
  lat: 40.64679593699455,
  lng: -7.91968580401233
};

const API_KEY = 'AIzaSyC6d4W1bxeX8v1G6mmLFCTzao3BrXOTa7s'; // Substitua pela sua API Key do Google Maps

const [mapCenter, setMapCenter] = useState(center); // center é a posição inicial do mapa
const [address, setAddress] = useState('');

const handleAddressChange = (event) => {
  setAddress(event.target.value);
};

const handleAddressSubmit = async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: address,
          key: API_KEY, // substitua pela sua chave de API
        },
      });
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setMapCenter(location);
      } else {
        alert('Local não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
    }
  }
};
const handleButtonClick = (filter) => {
  setFilter(filter);
  setShowalbunsList(true);
  setShowCreateForm(false);
  setShowEditForm(false);
  setSelectedButton(filter);
};

// Todos os albuns são considerados no início
let filteredalbuns = [...albuns]; // Faça uma cópia de todos os albuns

// Agora aplique os filtros por título e estado
filteredalbuns = filteredalbuns.filter(album => {
  if (!album.nome || !album.estado) return false;

  // Filtro por título
  const matchesTitle = album.nome.toLowerCase().includes(searchTerm.toLowerCase());

  // Filtro por estado
  let matchesState = true; // Assume que é verdadeiro para 'all' ou nenhum filtro de estado selecionado
  switch (filter) {
    case 'por validar':
      matchesState = album.estado === 'Por validar';
      break;
    case 'ativa':
      matchesState = album.estado === 'Ativa';
      break;
    case 'denunciada':
      matchesState = album.estado === 'Denunciada';
      break;
    case 'finalizada':
      matchesState = album.estado === 'Finalizada';
      break;
    default:
      matchesState = true;
  }

  console.log('Filtro atual:', filter);
  console.log('Estado do album:', album.estado);

  // Combina ambos os filtros: título e estado
  return matchesTitle && matchesState;
});



const countalbunsPorValidar = albuns.filter(p => p.estado && p.estado.toLowerCase() === 'por validar').length;
const countalbunsAtivas = albuns.filter(p => p.estado && p.estado.toLowerCase() === 'ativa').length;
const countalbunsDenunciadas = albuns.filter(p => p.estado && p.estado.toLowerCase() === 'denunciada').length;
const countalbunsFinalizados = albuns.filter(p => p.estado && p.estado.toLowerCase() === 'Finalizada').length;

const handleMedidasClick = () => {
  setShowMedidasModal(true);
};

const handleCloseMedidasModal = () => {
  setShowMedidasModal(false);      
};

const handleAlertClick = () => {
  setShowAlertModal(true);
  setShowMedidasModal(false);
};

const handleSendAlert = () => {
  // Adicione a lógica para enviar o alerta aqui
  console.log("Alerta enviado:", alertMessage);

  // Mostrar mensagem de sucesso
  setShowSuccessMessageAlert(true);

  // Após enviar o alerta, você pode fechar o modal
  setShowAlertModal(false);
};

const handleDeleteClickMedidas = () => {
  setShowDeleteModalMedidas(true);
  setShowMedidasModal(false); // Fechar o modal de "Tomar Medidas"
};


const handleDeleteMedidas = () => {
// Adicione a lógica para enviar a mensagem de remoção aqui
console.log("Motivo da remoção:", deleteMessage);
// Após enviar a mensagem, você pode fechar o modal
setShowDeleteModalMedidas(false);
setShowSuccessMessageMedidas(true);
};

const handleInfoClick = (album) => {
setalbumDetail(album);
setShowApprovalView(true);
};

const handleApproveClick = () => {
setShowApproveModal(true);
approveLocal(albumDetail.id);

};

const handleConfirmApprove = () => {
// Adicione a lógica para aprovar o local aqui
console.log("Local aprovado!");
setShowApproveModal(false);
setShowSuccessMessageMedidas(true); // Mostrar a mensagem de sucesso após a aprovação
};

const handleRejectClick = () => {
setShowRejectModal(true);
handleRejectAndDelete();
};

const handleRejectAndDelete = async () => {
try {
  const response = await axios.delete(`https://backend-teste-q43r.onrender.com/albuns/delete/${albumDetail.id}`);
  if (response.status === 200) {
    console.log('album eliminada com sucesso:', response.data);
    // Adicione qualquer lógica adicional, como redirecionamento ou atualização da UI
  } else {
    console.error('Erro ao eliminar album:', response);
  }
} catch (error) {
  console.error('Erro ao eliminar album:', error);
}
};

const handleRejectApprove = () => {
// Adicione a lógica para aprovar o local aqui
console.log("Local rejeitado!");
setShowRejectModal(false);
setShowSuccessMessageMedidas(true); // Mostrar a mensagem de sucesso após a aprovação
};

const handleRejectSubmit = () => {
// Adicione a lógica para enviar a rejeição aqui
console.log("Rejeição enviada:", rejectMessage);
setShowRejectModal(false);
};
const isOpenNow = (horario) => {
const currentDay = moment().format('dddd'); // Dia da semana atual em português
const currentTime = moment(); // Hora atual

console.log("Horário Completo:", horario);
console.log("Dia Atual:", currentDay);
console.log("Hora Atual:", currentTime.format('HH:mm'));

if (!horario || !horario[currentDay]) {
  console.log("Horário não definido para o dia atual ou horário é nulo.");
  return false;
}

const todaySchedule = horario[currentDay];
if (todaySchedule.toLowerCase() === 'fechado') {
  console.log("O local está fechado hoje.");
  return false;
}

const [openTime, closeTime] = todaySchedule.split('-');
const openMoment = moment(openTime, 'HH:mm');
const closeMoment = moment(closeTime, 'HH:mm');

console.log("Horário de Abertura:", openMoment.format('HH:mm'));
console.log("Horário de Fechamento:", closeMoment.format('HH:mm'));

const isOpen = currentTime.isBetween(openMoment, closeMoment);
console.log("Está Aberto Agora:", isOpen);

return isOpen;
};




useEffect(() => {
if (selectedAlbum && selectedAlbum.horario) {
  setIsOpen(isOpenNow(selectedAlbum.horario));
}
}, [selectedAlbum]);


const handlePendingClick = (album) => {
// Lógica para tratar clique no botão de "Por validar"
// Exemplo: Abrir uma modal para validação
setselectedAlbum(album);
setShowPendingModal(true);
};

const handleReportedClick = (album) => {
// Lógica para tratar clique no botão de "Denunciada"
// Exemplo: Abrir uma modal para revisão de denúncia
setselectedAlbum(album);
setShowReportedModal(true);
};

useEffect(() => {
const Comentarios = async () => {
  try {
    const response = await axios.get(`https://backend-teste-q43r.onrender.com/comentarios_albuns/todoscomentarios/${selectedAlbum.id}`);
    console.log(response.data);
    setComentarios(response.data);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
  }
};

if (selectedAlbum) {
  Comentarios();
}
}, [selectedAlbum]);

const handleLike = async (comentarioId) => {
  try {
    await axios.post(`https://backend-teste-q43r.onrender.com/likescomentariosalbuns/like`, {
      comentario_album_id: comentarioId,
      user_id: sessionStorage.getItem('user_id')
    });

    // Após o sucesso, você pode incrementar o número de likes no estado local
    setComentarios(prevComentarios => prevComentarios.map(comentario => {
      if (comentario.id === comentarioId) {
        return { ...comentario, likes: comentario.likes + 1 };
      }
      return comentario;
    }));
  } catch (error) {
    console.error('Erro ao adicionar like:', error);
  }
};

const [optionsOpen, setOptionsOpen] = useState(null);

const toggleOptionsalbum = (mensagemId) => {
  setOptionsOpen(prevId => (prevId === mensagemId ? null : mensagemId));
};
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.comentario-options')) {
      setOptionsOpen(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);

const handleAddComentario = async () => {
const user_id = sessionStorage.getItem('user_id'); // Obtendo o user_id do sessionStorage
  const comentarioData = {
    album_id: selectedAlbum.id,
    texto_comentario: novoComentario,
    user_id,
    classificacao: novaClassificacao
  };

  try {
    const response = await axios.post('https://backend-teste-q43r.onrender.com/comentarios_albuns/criarcomentario', comentarioData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      // Sucesso ao adicionar comentário

      // Atualize todos os comentários do usuário com a nova classificação no frontend
      const updatedComentarios = comentariosExibidos.map(comentario => {
        if (comentario.usuario.id === user_id) {
          return {
            ...comentario,
            classificacao: novaClassificacao
          };
        }
        return comentario;
      });

      // Atualize o estado com os novos comentários
      setComentariosExibidos(updatedComentarios);

      // Limpe o comentário e a classificação
      setNovoComentario('');
      setNovaClassificacao(0); // ou qualquer valor que indique a ausência de classificação
    } else {
      console.error('Erro na resposta do Backend:', response);
    }
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
  }
};


const handleToggleVisibility = async (album) => {
try {
  const updatedVisivel = !album.visivel;
  await axios.put(`https://backend-teste-q43r.onrender.com/albuns/updateVisibility/${album.id}`, { visivel: updatedVisivel });
  setAlbuns(albuns.map(p => p.id === album.id ? { ...p, visivel: updatedVisivel } : p));
} catch (error) {
  console.error('Erro ao atualizar visibilidade da publicação:', error);
}
};

const handleCancel = () => {
navigate(-1); // Volta para a página anterior
};

const handleContinue = () => {
const tabs = ['descricao', 'galeria', 'horario', 'localizacao', 'comentarios', 'mais_informacoes'];
const currentIndex = tabs.indexOf(activeTab);
console.log('Índice atual:', currentIndex);   
if (currentIndex < tabs.length - 1) {
  setActiveTab(tabs[currentIndex + 1]);
}
};

const handleImageChange = (event) => {
const file = event.target.files[0];
const reader = new FileReader();
reader.onloadend = () => {
  setImageSrc(reader.result);
};
if (file) {
  reader.readAsDataURL(file);
}
};

const uploadImage = async (file) => {
const formData = new FormData();
formData.append('key', '4d755673a2dc94483064445f4d5c54e9'); // substitua pela sua chave da API imgbb
formData.append('image', file);

const response = await axios.post('https://api.imgbb.com/1/upload', formData);
return response.data.data.url; // Certifique-se de que está retornando a URL correta
};


const onDrop = async (acceptedFiles) => {
const uploadedImages = await Promise.all(
  acceptedFiles.map(async (file) => {
    const url = await uploadImage(file);
    return { file, preview: URL.createObjectURL(file), url };
  })
);
setGaleria([...galeria, ...uploadedImages]);
};


const { getRootProps, getInputProps } = useDropzone({
onDrop,
accept: 'image/*'
});

const [area, setArea] = useState('');

useEffect(() => {
// Função para buscar os tópicos da API
const Topicos = async () => {
  try {
    const response = await axios.get(`https://backend-teste-q43r.onrender.com/topicos/topicosdeumaarea/${areaId}`); // Substitua areaId pelo id da área
    setTopicos(response.data);
  } catch (error) {
    console.error('Erro ao buscar tópicos:', error);
  }
};

Topicos();
}, [area]);

const fetchUser = async (id) => {
try {
  const response = await axios.get(`https://backend-teste-q43r.onrender.com/users/user/${id}`);
  console.log("Resposta da API:", response.data); // Adicione este log
  setUser(response.data);
} catch (error) {
  console.error('Error fetching user:', error);
}
};


useEffect(() => {
const id = sessionStorage.getItem('user_id'); // ou de onde quer que você esteja obtendo o ID do usuário
console.log("ID do usuário logado:", id);
if (id) {
  setUserId(id);
  fetchUser(id);
}
}, []);



const handleAvaliacaoChange = (e) => {
setEstrelas(e.target.value);
};

const handleAvaliacaoSubmit = async (e) => {
e.preventDefault();
const userId = sessionStorage.getItem('user_id');
const albumId = selectedAlbum.id;

try {
  const response = await axios.post('https://backend-teste-q43r.onrender.com/avaliacao_albuns/criar', {
    album_id: albumId,
    autor_id: userId,
    estrelas: estrelas
  });
  console.log('Avaliação criada:', response.data);
  // Atualizar a UI ou fazer outras ações necessárias após criar a avaliação
} catch (error) {
  console.error('Erro ao criar avaliação:', error);
}
};

const MediaAvaliacoes2 = async () => {
try {
  const response = await axios.get(`https://backend-teste-q43r.onrender.com/avaliacao_albuns/media/${selectedAlbum.id}`);
  setMediaAvaliacoes(response.data);
} catch (error) {
  console.error('Erro ao buscar média de avaliações:', error);
}
};

// useEffect(() => {
// if (selectedAlbum) {
//   MediaAvaliacoes();
// }
// }, [selectedAlbum]);



useEffect(() => {
  if (albumToEdit) {
    setNome(albumToEdit.nome);
    setAutor(albumToEdit.autor_id);
    setDescricao(albumToEdit.descricao);
    setTopico(albumToEdit.topico_id);
    setLocalizacao(albumToEdit.localizacao);
    setEstado(albumToEdit.estado);
    // Formatar as datas para o formato datetime-local
    const dataInicioFormatada = new Date(albumToEdit.datainicioatividade).toISOString().slice(0, 16);
    const dataFimFormatada = new Date(albumToEdit.datafimatividade).toISOString().slice(0, 16);
    setDataInicioAtividade(dataInicioFormatada);
    setDataFimAtividade(dataFimFormatada);
    setCapaImagemalbum(albumToEdit.capa_imagem_album);
    setLatitude(albumToEdit.latitude);
    setLongitude(albumToEdit.longitude);
    setTipoDealbumId(albumToEdit.tipodealbum_id);
    setArea(albumToEdit.area_id);

    // Se houver uma galeria de imagens associada ao album
    if (albumToEdit.imagens) {
      setGaleria(albumToEdit.imagens.map((image) => ({
        id: image.id,
        url: image.caminho_imagem,
        preview: image.caminho_imagem
      })));
    }
  }
}, [albumToEdit]);



// const handleRemoveImage = (index) => {
// const updatedGaleria = [...galeria];
// updatedGaleria.splice(index, 1);
// setGaleria(updatedGaleria);
// };

const handleRemoveComentario = async (comentarioId) => {
try {
  await axios.delete(`https://backend-teste-q43r.onrender.com/comentarios_albuns/delete/${comentarioId}`);
  setComentarios(comentarios.filter(comentario => comentario.id !== comentarioId));
} catch (error) {
  console.error('Erro ao remover comentário:', error);
}
};

const handleSubmitEdit = async (e) => {
  e.preventDefault();

  const formattedHorario = {};
  for (const [dia, { inicio, fim, fechado }] of Object.entries(horario)) {
    formattedHorario[dia] = fechado ? 'Fechado' : `${inicio}-${fim}`;
  }

  const albumData = {
    nome, 
    area_id: area, // Nome do album
    descricao,
    capa_imagem_album: capaImagemalbum, 
    centro_id: centroId,
    autor_id: albumToEdit.autor_id || sessionStorage.getItem('user_id'),
   
  };

  try {
    const response = await axios.put(`https://backend-teste-q43r.onrender.com/albuns/update/${albumToEdit.id}`, albumData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) { // Ajuste o código de status para 201 
      
      setShowSuccessMessage(true); // Mostrar modal de sucesso
    } else {
      console.error('Erro na resposta do Backend:', response); // Log de erro caso a resposta não seja 201
      // Lógica de erro adicional, se necessário
    }
    console.log('album atualizado:', response.data);
    
  } catch (error) {
    console.error('Erro ao atualizar album:', error);
  }
};


const marcarComentarioParaRemover = (comentarioId) => {
setComentariosParaRemover([...comentariosParaRemover, comentarioId]);
setComentarios(comentarios.filter(comentario => comentario.id !== comentarioId));
};


const approveLocal = async (albumId) => {
try {
  const response = await axios.put(`https://backend-teste-q43r.onrender.com/albuns/update/${albumId}`, {
    estado: 'Ativa',
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 200) {
    console.log('Publicação aprovada com sucesso');
    // Atualize o estado local se necessário, por exemplo:
    setselectedAlbum((prev) => ({ ...prev, estado: 'Ativo' }));
  } else {
    console.error('Erro ao aprovar publicação:', response);
  }
} catch (error) {
  console.error('Erro ao aprovar publicação:', error);
}
};

useEffect(() => {
  const fetchParticipantes = async () => {
      setLoading(true);
      try {
          const response = await axios.get(`https://backend-teste-q43r.onrender.com/listaparticipantes_album/album/${selectedAlbum.id}`);
          setParticipantes(response.data);
          setLoading(false);
      } catch (err) {
          setError('Falha ao buscar participantes');
          setLoading(false);
      }
  };

  fetchParticipantes();
}, [selectedAlbum]);


useEffect(() => {
  const fetchAlbuns = async () => {
    try {
      const response = await axios.get(`https://backend-teste-q43r.onrender.com/albuns/listByArea/${areaId}`);
      setAlbuns(response.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns por área:', error);
    }
  };

  if (areaId) {
    fetchAlbuns ();
  }
}, [areaId]);


useEffect(() => {
  console.log('Álbuns carregados:', albuns); // Verifique se os álbuns estão sendo atualizados
}, [albuns]);

const adicionarParticipante = async (albumId, usuarioId) => {
  try {
      const response = await axios.post('https://backend-teste-q43r.onrender.com/listaparticipantes_album/adicionar_participante/', {
          album_id: albumId,
          usuario_id: usuarioId
      });
      const data = await response.json();
      if (response.status === 201) {
        setParticipantes(prevParticipantes => [...prevParticipantes, data.participante]);
          // Atualize seu estado ou faça qualquer outra ação necessária após adição bem sucedida
      } else {
      }
  } catch (error) {
      if (error.response) {
          // Resposta com status fora do intervalo 2xx
          console.error('Erro ao adicionar participante:', error.response.data);
      } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          console.error('Erro ao adicionar participante:', error.request);
      } else {
          // Algo aconteceu na configuração da requisição
          console.error('Erro:', error.message);
      }
  }
};

useEffect(() => {
  if (selectedAlbum) {
    console.log('Selected album:', selectedAlbum);
    console.log('Participantes:', participantes);
    console.log('UserId:', userId);
  } else {
    console.log('album ainda não foi carregado ou está nulo.');
  }
}, [selectedAlbum, participantes, userId]); // Dependências para re-logar quando mudarem


// async function getAddressFromCoordinates(latitude, longitude) {
//   const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=API_KEY`);
//   const data = await response.json();

//   if (data.results && data.results.length > 0) {
//     return data.results[0].formatted_address;
//   } else {
//     return 'Endereço não encontrado';
//   }
// }

// // Em algum lugar do seu componente React:
// const [endereco, setEndereco] = useState('');

// useEffect(() => {
//   if (selectedAlbum.latitude && selectedAlbum.longitude) {
//     getAddressFromCoordinates(selectedAlbum.latitude, selectedAlbum.longitude)
//       .then(address => setEndereco(address))
//       .catch(error => console.error('Erro ao obter endereço:', error));
//   }
// }, [selectedAlbum.latitude, selectedAlbum.longitude]);


// Exemplo para garantir que o selectedAlbum e userId estejam definidos
const albumId = selectedAlbum ? selectedAlbum.id : null; // Certifique-se de que está pegando o ID corretamente

useEffect(() => {
  const fetchalbum = async () => {
    // Verifica se o albumId não é null
    if (albumId) {
      try {
        const response = await axios.get(`https://backend-teste-q43r.onrender.com/albums/${albumId}`);
        setselectedAlbum(response.data);
      } catch (error) {
        console.error('Erro ao buscar o album:', error);
      }
    } else {
      console.log("albumId não está definido");
    }
  };

  fetchalbum();
}, [albumId]); // Certifique-se de passar o albumId corretamente



useEffect(() => {
  if (selectedAlbum && selectedAlbum.id) {
    const fetchMediaAvaliacoes = async () => {
      try {
        const response = await axios.get(`https://backend-teste-q43r.onrender.com/comentarios_albuns/mediaavaliacoes/${selectedAlbum.id}`);
        setMediaAvaliacoes(response.data);
      } catch (error) {
        console.error('Erro ao buscar a média das avaliações:', error);
      }
    };

    fetchMediaAvaliacoes();
  } else {
    console.log("selectedAlbum ou albumId não está definido");
  }
}, [selectedAlbum]);



useEffect(() => {
  const fetchImagensGaleria = async () => {
    if (selectedAlbum && selectedAlbum.id) {
      try {
        const response = await axios.get(`https://backend-teste-q43r.onrender.com/galeria_album/listar_todas_imagens/${selectedAlbum.id}`);
        setImagensGaleria(response.data);
      } catch (error) {
        console.error('Erro ao buscar imagens da galeria do álbum:', error);
      }
    }
  };

  fetchImagensGaleria();
}, [selectedAlbum]);

const [optionsOpenMarcar, setOptionsOpenMarcar] = useState(null);

const toggleOptionsMarcar = (denunciaId) => {
  console.log("Toggle Options for Denuncia ID:", denunciaId);
  setOptionsOpenMarcar(prevId => {
    const newId = (prevId === denunciaId ? null : denunciaId);
    console.log("Setting optionsOpenMarcar to:", newId);
    return newId;
  });
};


// No useEffect para detectar clique fora:
// useEffect(() => {
//   const handleClickOutside = (event) => {
//     console.log("Clicked outside:", event.target);
//     if (!event.target.closest('.comentario-options-publicacao')) {
//       console.log("Resetting optionsOpenMarcar");
//       setOptionsOpenMarcar(null);
//     }
//   };

//   document.addEventListener('click', handleClickOutside);
//   return () => {
//     document.removeEventListener('click', handleClickOutside);
//   };
// }, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.denuncia-actions')) {
      setOptionsOpenMarcar(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, []);

const [comentariosalbuns, setComentariosalbuns] = useState([]);

const handleDeleteComentarioalbum = async (comentarioId) => {
  try {
    const response = await axios.delete(`https://backend-teste-q43r.onrender.com/comentarios_albuns/apagarcomentario/${comentarioId}`);
    if (response.status === 200) {
      alert('Comentário excluído com sucesso');
      setComentariosalbuns(comentariosalbuns.filter(comentario => comentario.id !== comentarioId)); // Atualize a lista de comentários
    } else {
      console.error('Erro ao excluir o comentário:', response);
      alert('Ocorreu um erro ao excluir o comentário');
    }
  } catch (error) {
    console.error('Erro ao excluir o comentário:', error);
    alert('Ocorreu um erro ao excluir o comentário');
  }
};


const [tiposDealbum, setTiposDealbum] = useState([]);

useEffect(() => {
  // Função para buscar os tipos de albuns da API
  const fetchTiposDealbum = async () => {
    try {
      const response = await axios.get('https://backend-teste-q43r.onrender.com/tipodealbum/listarTipos'); // URL correta da sua API para buscar os tipos de albuns
      setTiposDealbum(response.data);
    } catch (error) {
      console.error('Erro ao buscar tipos de album:', error);
    }
  };

  fetchTiposDealbum();
}, []);

const [tipoDealbumId, setTipoDealbumId] = useState('');


// Adicionar estado para rastrear as imagens removidas
const [imagensRemovidas, setImagensRemovidas] = useState([]);

const handleRemoveImage = (index) => {
  // Remove a imagem do array de galeria baseado no índice
  const updatedGallery = galeria.filter((_, i) => i !== index);
  
  // Atualiza o estado
  setGaleria(updatedGallery);

  // Verifique se a imagem tem um ID e o adicione à lista de imagens removidas
  const imagemRemovida = galeria[index]; // Captura a imagem que está sendo removida

  if (imagemRemovida && imagemRemovida.id) {
    setImagensRemovidas([...imagensRemovidas, imagemRemovida.id]);
  } else {
    console.warn('Imagem removida não tem ID:', imagemRemovida);
  }
};

const [denuncias, setDenuncias] = useState([]);

useEffect(() => {
  
  const fetchDenuncias = async () => {
    try {
      const response = await axios.get(`https://backend-teste-q43r.onrender.com/denuncias_comentarios_albuns/denunciasPoralbum/${albumDetailDenunciada?.id}`);
      console.log("Fetched denuncias response:", response.data);
      setDenuncias(response.data);
      console.log(denuncias);
    } catch (error) {
      console.error('Erro ao buscar denúncias:', error);
    }
  };

  if (albumDetailDenunciada) {
    fetchDenuncias();
  }
}, [albumDetailDenunciada?.id]);

const marcarDenunciaComoResolvida = async (denunciaId) => {
  try {
    const response = await axios.put(`https://backend-teste-q43r.onrender.com/denuncias_comentarios_albuns/update/${denunciaId}`, { resolvida: true });
    if (response.status === 200) {
      setDenuncias(prevDenuncias => prevDenuncias.map(denuncia => 
        denuncia.id === denunciaId ? { ...denuncia, resolvida: true } : denuncia
      ));
      setOptionsOpenMarcar(null); // Fecha o menu de opções após marcar como resolvida
    }
  } catch (error) {
    console.error('Erro ao marcar denúncia como resolvida:', error);
  }
};

useEffect(() => {
  console.log('Denuncias state atualizado:', denuncias);  // Log do estado
}, [denuncias]);



return (
  <div className="publicacoes-div_princ"> 
    {!showCreateForm && !showEditForm && !showDetailViewDenunciada && !showApprovalView && !showDetailView && <h1 className="publicacoes-title2">Lista de álbuns</h1>}
    {!showCreateForm && !showEditForm && !showDetailViewDenunciada && !showApprovalView && !showDetailView &&(
      <div className="publicacoes-button-container">
        <div className="left-buttons">
        {}
          <CreatealbumButton
            onClick={() => handleButtonClick('all')}
            iconSrc="https://i.ibb.co/P4nsk4w/Icon-criar.png"
            iconBgColor="#e0f7fa"
            title="albuns Totais"
            subtitle={albuns.length.toString()}
            isSelected={selectedButton === 'all'}
          />
          <CreatealbumButton
            iconSrc="https://i.ibb.co/Y3jNfMt/pending-icon-512x504-9zrlrc78.png"
            iconBgColor="#FFEECC"
            title="Por validar"
            subtitle={countalbunsPorValidar.toString()}
            isSelected={selectedButton === 'por validar'}
            onClick={() => handleButtonClick('por validar')}
          />
          <CreatealbumButton
            iconSrc="https://i.ibb.co/D8QwJ6M/active-removebg-preview.png"
            iconBgColor="#CCFFCC"
            title="Ativos"
            subtitle={countalbunsAtivas.toString()}
            isSelected={selectedButton === 'ativa'}
            onClick={() => handleButtonClick('ativa')}
          />
          
          <CreatealbumButton
            iconSrc="https://i.ibb.co/RPC7vW8/Icon-denuncia.png"
            iconBgColor="#FFE0EB"
            title="Denunciados"
            subtitle={countalbunsDenunciadas.toString()}
            isSelected={selectedButton === 'denunciada'}
            onClick={() => handleButtonClick('denunciada')}
          />
        </div>
        <div className="right-button">
          <CreatealbumButton
            onClick={handleCreatealbumClick}
            iconSrc="https://i.ibb.co/P4nsk4w/Icon-criar.png"
            iconBgColor="#e0f7fa"
            title="Criar album"
            subtitle="Criar..."
            isSelected={selectedButton === 'create'}
          />
        </div>
      </div>
    )}
    {!showDetailViewDenunciada && !showApprovalView && !showDetailView && showalbunsList && (
      <div className="search-container">
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Procurar por Álbum..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <i className="fas fa-search search-icon"></i>
      </div>
      </div>
    )}
    
    {showEditForm && (
      <div className="publicacoes_div_princ"><h1 className="publicacoes-title2">Editar informações do album</h1>
      <div className="header">
      <h1 className="header-title">{selectedAlbum.nome}</h1>
      <div className="author">
          <div className="authorName"><span>Autor :</span></div>
          <img src={selectedAlbum.user.caminho_foto} alt={selectedAlbum.user.nome} className="author-icon" />
          <span>{selectedAlbum.user.nome} {selectedAlbum.user.sobrenome}</span>
      
        </div>

        </div>
    <div className="tabs">
      <button
        className={`tab ${activeTab === 'descricao' ? 'active' : ''}`}
        onClick={() => handleTabClick('descricao')}
      >
        <i className="fas fa-info-circle tab-icon"></i> Descrição
      </button>
      <button
        className={`tab ${activeTab === 'galeria' ? 'active' : ''}`}
        onClick={() => handleTabClick('galeria')}
      >
        <i className="fas fa-images tab-icon"></i> Galeria
      </button>
      
      <button
        className={`tab ${activeTab === 'localizacao' ? 'active' : ''}`}
        onClick={() => handleTabClick('localizacao')}
      >
        <i className="fas fa-map-marker-alt tab-icon"></i> Localização
      </button>
      
      
          </div>
          <div className="tab-content">
          {activeTab === 'descricao' && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
        <label>Área do Local</label>
        <select value={area} onChange={(e) => setArea(e.target.value)}>
        <option value="">Selecionar área</option>
        {areas.map((areaOption) => (
          <option key={areaOption.id} value={areaOption.id}>
            {areaOption.nome}
          </option>
        ))}
      </select>
      </div>
            <div className="form-group">
            <label>Tópico do Local</label>
              <select value={topico} onChange={(e) => setTopico(e.target.value)}>
                <option value="">selecionar tópico</option>
                {topicos.map((topico) => (
                  <option key={topico.id} value={topico.id}>{topico.nome}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
  <label>Nome do album</label>
  <input type="text" placeholder="inserir nome do album" value={nome} onChange={(e) => setNome(e.target.value)} />
</div>
<div className="form-group">
  <label>Estado do album</label>
  <select value={estado} onChange={(e) => setEstado(e.target.value)}>
    <option value="">Selecionar estado</option>
    <option value="Ativa">Ativa</option>
    <option value="Denunciada">Denunciada</option>
    <option value="Por validar">Por validar</option>
    <option value="Finalizada">Finalizada</option>
  </select>
</div>


<div className="form-group">
  <label>Descrição do album</label>
  <input type="text" placeholder="inserir uma breve descrição do album" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
</div>
<div className="form-group">
  <label>Tipo de album</label>
  <select value={tipoDealbumId} onChange={(e) => setTipoDealbumId(e.target.value)}>
    <option value="">Selecionar Tipo de album</option>
    {tiposDealbum.map((tipo) => (
      <option key={tipo.id} value={tipo.id}>{tipo.nome_tipo}</option>  
    ))}
  </select>
</div>
            <div className="form-buttons">
              <button type="button" className="cancel-button"onClick={handleCancel}>Cancelar</button>
              <button type="button" className="save-button" onClick={handleSubmitEdit}><i className="fas fa-save"></i>Alterações</button>
            </div>
          </form>
        )}

{activeTab === 'galeria' && (
  <div className="tab-content_galeria">
    <h2>Galeria do album</h2>
    <div {...getRootProps({ className: 'dropzone' })} className="gallery-upload">
      <input {...getInputProps()} />
      <div className="upload-box">
        <span className="upload-icon">+</span>
        <span className="upload-text">Upload</span>
      </div>
      <p className="gallery-info">
        <i className="fas fa-info-circle"></i> A primeira foto será a foto de capa do album
      </p>
    </div>
    <div className="uploaded-images">
      {galeria.map((file, index) => (
        <div key={index} className="image-preview">
          <img src={file.preview} alt={`preview ${index}`} />
          <button className="remove-image" onClick={() => handleRemoveImage(index)}>x</button>
        </div>
      ))}
    </div>
    <div className="form-buttons">
      <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
      <button type="button" className="save-button" onClick={handleSubmitEdit}><i className="fas fa-save"></i>Alterações</button>
    </div>
  </div>
)}

        {activeTab === 'localizacao' && (
          <div className="tab-content_localizacao">
            <h2>Localização do local</h2>
            <div className="localizacao-content">
            <div className="form-group">
  <label>Latitude</label>
  <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
</div>
<div className="form-group">
  <label>Longitude</label>
  <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
</div>

<a 
        href={`https://www.google.com/maps?q=${selectedAlbum.latitude},${selectedAlbum.longitude}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="map-button"
      >
        Ver no Google Maps
      </a>
            </div>
            <div className="form-buttons">
              <button type="button" className="cancel-button"onClick={handleCancel}>Cancelar</button>
              <button type="button" className="save-button" onClick={handleSubmitEdit}><i className="fas fa-save"></i>Alterações</button>
            </div>
          </div>
        )}




        
  {showSuccessMessage && <div className="modal-backdrop"></div>}
            {showSuccessMessage && (
              <div className="success-message_delete">
                <div className="success-message-icon"></div>
                <h1>Publicação editada com sucesso!</h1>
                <button onClick={() => setShowSuccessMessage(false)}>Continuar</button>
              </div>
            )}
    

    </div>
  </div>
  )}

  {showDetailView && selectedAlbum && (
    <div className="publicacoes_div_princ">
      {selectedAlbum && console.log('selectedAlbum:', selectedAlbum)}
      <h1 className="publicacoes-title2">Informações do álbum</h1>
      <div className="header">
        <h1 className="header-title">{selectedAlbum.nome}</h1>
        <div className="author">
          <div className="authorName"><span>Autor :</span></div>
          <img src={selectedAlbum.autor.caminho_foto} alt={selectedAlbum.autor.nome} className="author-icon" />
          <span>{selectedAlbum.autor.nome} {selectedAlbum.autor.sobrenome}</span>
      
        </div>

      </div>
  <div className="tab-content2">
    {/* {selectedAlbum.galeria && selectedAlbum.galeria.length > 0 && (
      <>
        <button className="tab active"><i className="fas fa-images tab-icon"></i> Galeria do album</button>
        <div className="gallery">
          {selectedAlbum.galeria.map((image, index) => (
            <img key={index} src={image} alt={`Galeria ${index}`} className="gallery-image" />
          ))}
        </div>
      </>
    )} */}
    <div className="tab-content2">
  {imagensGaleria && imagensGaleria.length > 0 && (
    <>
      <button className="tab active"><i className="fas fa-images tab-icon"></i> Galeria do Álbum</button>
      <div className="gallery">
        {imagensGaleria.map((image, index) => (
          <img key={index} src={image.caminho_imagem} alt={`Galeria ${index}`} className="gallery-image" />
        ))}
      </div>
    </>
  )}
</div>

{/* {selectedAlbum.user && (
  <>
    <button className="tab active">
  <i className="fas fa-check tab-icon"></i>
  Participantes ({participantes.length}) </button>
  

  
  {!participantes.some(participante =>  Number(participante.usuario.id) === Number(userId))  && (
      <button className="user-plus-button" onClick={() => adicionarParticipante(selectedAlbum.id, userId)}>
        <i className="fas fa-user-plus tab-icon user-plus-icon"></i> Participar no album
      </button>
    )}
  

    <div className="description">
      <div className="participantes-info-container">
        <div className="participants-info">
          
          <div className="participant-icons">
            {participantes.slice(0, 5).map((participante, index) => (
              <img key={index} src={participante.usuario.caminho_foto} alt={`${participante.usuario.nome} ${participante.usuario.sobrenome}`} className="participant-icon"/>
            ))}
            {participantes.length > 5 && (
              <div onClick={openModalParticipantes} className="more-participants">
                <img src={participantes[5].usuario.caminho_foto} alt="Mais participantes" className="more-icon"/>
                <span className="more-number">+{participantes.length - 5}</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>

    
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModalParticipantes}
      contentLabel="Lista Completa de Participantes"
      className="modal-participantes"
      overlayClassName="overlay-participantes"
    >
      <div className="modal-content">
        <h2>Lista Completa de Participantes</h2>
        <div className="modal-body">
          {participantes.map(participante => (
            <div key={participante.usuario.id} className="participant-detail">
              <img src={participante.usuario.caminho_foto} alt={`${participante.usuario.nome} ${participante.usuario.sobrenome}`} className="participant-icon"/>
              <span>{participante.usuario.nome} {participante.usuario.sobrenome}</span>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button onClick={closeModalParticipantes} className="close-button">Fechar</button>
        </div>
      </div>
    </Modal>
  </>
)} */}



{selectedAlbum.createdAt && (
  <>
    <button className="tab active">
      <i className="fas fa-calendar-alt tab-icon"></i> Data do album
    </button>
    <div className="description">
      <p><strong>Data:</strong> {new Date(selectedAlbum.createdAt).toLocaleString()}</p>
    </div>
  </>
)}



    {selectedAlbum.descricao && (
      <>
        <button className="tab active"><i className="fas fa-info-circle tab-icon"></i> Descrição do album</button>
        <div className="description">
          <p>{selectedAlbum.descricao}</p>
        </div>
      </>
    )}
    {/* {selectedAlbum.latitude && (
  <>
    <button className="tab active">
      <i className="fas fa-map-marker-alt tab-icon"></i> Localização
    </button>
    <div className="location">
      <p><strong>Localização:</strong> {selectedAlbum.latitude}, {selectedAlbum.longitude}</p>
      <a 
        href={`https://www.google.com/maps?q=${selectedAlbum.latitude},${selectedAlbum.longitude}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="map-button"
      >
        Ver no Google Maps
      </a>
    </div>
  </>
)} */}

{/* {selectedAlbum.topico &&  (
  <>
    <button className="tab active">
      <i className="fas fa-tag tab-icon"></i> Relacionado com Este album
    </button>
    <div className="description tags-container">
      <span className="tag">
        <i className="fas fa-tags tag-icon"></i> {selectedAlbum.topico.nome}
      </span>
      
      <p>
        <i className="fas fa-tag"></i> {selectedAlbum.tipo_album.nome_tipo}
      </p>
    
    </div>
  </>
)} */}

{/* <div className="tab-content2">
  {imagensGaleria && imagensGaleria.length > 0 && (
    <>
      <button className="tab active"><i className="fas fa-images tab-icon"></i> Galeria do album</button>
      <div className="gallery">
        {imagensGaleria.map((image, index) => (
          <img key={index} src={image.caminho_imagem} alt={`Galeria ${index}`} className="gallery-image" />
        ))}
      </div>
    </>
  )}
</div> */}


    {/* Seção de Comentários */}
    {/* Seção de Comentários */}
    {selectedAlbum && (selectedAlbum.estado === 'Ativa' || selectedAlbum.estado === 'Denunciada') && (
  // Seu código aqui, que será executado se o estado for 'Ativa' ou 'Denunciada'

<div> 
  <button className="tab active"><i className="fas fa-comments tab-icon"></i> Comentários e Avaliações</button>
  <div className="comentarios-section">
    <div className="avaliacoes-resumo">
      
      <div className="avaliacoes-info">
        {mediaAvaliacoes && mediaAvaliacoes.total > 0 ? (
          <>
            <span className="avaliacoes-media">
              {mediaAvaliacoes.media.toFixed(1)}
            </span>
            <div className="stars">
              {Array.from({ length: 5 }, (_, index) => (
                <i
                  key={index}
                  className={`fas fa-star${index < Math.round(mediaAvaliacoes.media) ? '' : '-o'}`}
                />
              ))}
            </div>
            <span className="avaliacoes-total">
              com base em {mediaAvaliacoes.total} {mediaAvaliacoes.total === 1 ? 'avaliação' : 'avaliações'}
            </span>
          </>
        ) : (
          <span className="avaliacoes-media">Sê o primeiro a avaliar este album!</span>
        )}
      </div>
    </div>

    <div className="comentarios-list">
      {comentariosExibidos.map((comentario) => (
        <div key={comentario.id} className="comentario">
          <div className="comentario-header">
            {comentario.usuario && comentario.usuario.caminho_foto && (
              <img src={comentario.usuario.caminho_foto} alt={`${comentario.usuario.nome} ${comentario.usuario.sobrenome}`} className="comentario-avatar" />
            )}
            <div className="comentario-info">
              {comentario.usuario && (
                <>
                  <span className="comentario-autor">{comentario.usuario.nome} {comentario.usuario.sobrenome}</span>
                  <span className="comentario-data">{new Date(comentario.createdat).toLocaleDateString()}</span>
                </>
              )}
            </div>
            
          </div>

          {/* Aqui você adiciona a lógica para exibir a classificação textual */}
          <div className="comentario-rating">
            {comentario.classificacao > 0 && (
              <>
                <div className="stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`fas fa-star${index < comentario.classificacao ? '' : '-o'}`}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {comentario.classificacao === 5 && 'Excelente'}
                  {comentario.classificacao === 4 && 'Bom'}
                  {comentario.classificacao === 3 && 'Médio'}
                  {comentario.classificacao === 2 && 'Fraco'}
                  {comentario.classificacao === 1 && 'Péssimo'}
                </span>
              </>
            )}
          </div>
          <div className="comentario-options">
        <div className="options-button" onClick={() => toggleOptionsalbum(comentario.id)}>
          <i className="fas fa-ellipsis-v"></i>
        </div>
        {optionsOpen === comentario.id && (
          <div className="options-menu">
            <button onClick={() => handleDeleteComentarioalbum(comentario.id)}>
              <i className="fas fa-trash-alt custom-delete-icon"></i> Excluir Mensagem
            </button>
          </div>
        )}
      </div>
          <div className="comentario-conteudo">
            <p>{comentario.texto_comentario}</p>
          </div>
          {/* Botão de Like */}
      <div className="comentario-like">
  <button className="comentario-like-button" onClick={() => handleLike(comentario.id)}>
    {comentario.likes} <i className="fas fa-thumbs-up" style={{color: '#1877F2'}}></i>
  </button>
</div>
        </div>
      ))}
    </div>

    <button className="btn-comentarios margin-bottom" onClick={() => setShowAllComentarios(!showAllComentarios)}>
      {showAllComentarios ? 'Esconder Comentários' : 'Mostrar todos os Comentários'}
    </button>

    <div className="comment-button-container">
      <button className="btn-comentar" onClick={() => setShowComentarioModal(true)}>Comentar</button>
    </div>

</div>
{showComentarioModal && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setShowComentarioModal(false)}>&times;</span>
      <div className="modal-header">
        <h2>Classifique o Álbum</h2>
      </div>
      <div className="modal-body">
        <div className="rating">
          <select 
            value={novaClassificacao} 
            onChange={(e) => setNovaClassificacao(parseInt(e.target.value))}
            style={{ fontSize: '2rem' }}
          >
            <option value="0">Sem Classificação</option>
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </select>
        </div>

        <textarea
          className="comment-textarea"
          placeholder="Escreva o Comentário"
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
        />
      </div>

      <div className="modal-footer">
        <button onClick={handleAddComentario} className="btn-comentar">Publicar</button>
      </div>
    </div>
  </div>
)}




</div>
)}

  </div>
</div>
)}



{showApprovalView && albumDetail && (
  <div className="publicacoes_div_princ">
     {console.log('albumDetail:', albumDetail)}
      <h1 className="publicacoes-title2">Informações do album</h1>
      <div className="header">
        <h1 className="header-title">{albumDetail.nome}</h1>
        <div className="author">
          <div className="authorName"><span>Autor :</span></div>
          <img src={albumDetail.user.caminho_foto} alt={albumDetail.user.nome} className="author-icon" />
          <span>{albumDetail.user.nome} {albumDetail.user.sobrenome}</span>
      
        </div>

      </div>
  <div className="tab-content2">
    
  {albumDetail.imagens && albumDetail.imagens.length > 0 && (
    <>
        <button className="tab active"><i className="fas fa-images tab-icon"></i> Galeria do album</button>
        <div className="gallery">
            {albumDetail.imagens.map((image, index) => (
                <img key={index} src={image.caminho_imagem} alt={`Galeria ${index}`} className="gallery-image" />
            ))}
        </div>
    </>
)}



{albumDetail.datainicioatividade && (
  <>
    <button className="tab active">
      <i className="fas fa-calendar-alt tab-icon"></i> Data do album
    </button>
    <div className="description">
      <p><strong>Data:</strong> {new Date(albumDetail.datainicioatividade).toLocaleString()}</p>
    </div>
  </>
)}



    {albumDetail.descricao && (
      <>
        <button className="tab active"><i className="fas fa-info-circle tab-icon"></i> Descrição do album</button>
        <div className="description">
          <p>{albumDetail.descricao}</p>
        </div>
      </>
    )}
    {albumDetail.latitude && (
  <>
    <button className="tab active">
      <i className="fas fa-map-marker-alt tab-icon"></i> Localização
    </button>
    <div className="location">
      <p><strong>Localização:</strong> {albumDetail.latitude}, {albumDetail.longitude}</p>
      <a 
        href={`https://www.google.com/maps?q=${albumDetail.latitude},${albumDetail.longitude}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="map-button"
      >
        Ver no Google Maps
      </a>
    </div>
  </>
)}

{albumDetail.topico &&  (
  <>
    <button className="tab active">
      <i className="fas fa-tag tab-icon"></i> Relacionado com Este album
    </button>
    <div className="description tags-container">
      <span className="tag">
        <i className="fas fa-tags tag-icon"></i> {albumDetail.topico.nome}
      </span>
      
      <p>
        <i className="fas fa-tag"></i> {albumDetail.tipo_album.nome_tipo}
      </p>
    
    </div>
  </>
)}



    <div className="form-buttons">
    <button className="reject-button" onClick={handleRejectClick}>
      <i className="fas fa-times"></i> Rejeitar Local
    </button>
    <button className="approve-button" onClick={handleApproveClick}>
      <i className="fas fa-check"></i> Aprovar Local
    </button>


  </div>
  </div>
  
</div>
)}
{showRejectModal && (
<div className="modal-backdrop">
  <div className="modal">
    <div className="modal-header">
    <img src="https://i.ibb.co/tstvCh3/Captura-de-ecr-2024-06-28-170539.png"/>
      <span>Rejeitar Local ?</span>
    </div>
    <div className="modal-body">
      <p>
        Insira abaixo o motivo por qual rejeitou a aprovação deste local sugerido por este utilizador, o qual vai ser notificado da sua ação.
      </p>
      <textarea
        className="large-textareaAlert"
        placeholder="...motivo da rejeição..."
        value={rejectMessage}
        onChange={(e) => setRejectMessage(e.target.value)}
        maxLength="240"
      />
      <div className="character-count">{rejectMessage.length}/240</div>
    </div>
    <div className="modal-footer2">
      <button type="button" className="cancel-button" onClick={() => setShowRejectModal(false)}>Cancelar</button>
      <button type="button" className="rejeitar-submit-button" onClick={handleRejectApprove}>Rejeitar</button>
    </div>
  </div>
</div>
)}



{showApproveModal && (
<div className="modal-approve-backdrop">
  <div className="modal-approve">
    <div className="modal-approve-header">
    <img src="https://i.ibb.co/pvK4g0y/Captura-de-ecr-2024-06-28-163917.png" alt="Captura-de-ecr-2024-06-28-163917" />
      <h2>Aprovar Local ?</h2>
    </div>
    <div className="modal-approve-body">
      <p>
        Ao aprovar este local, irá de imediato ficar disponível na aplicação para a consulta dos utilizadores.
      </p>
    </div>
    <div className="modal-approve-footer">
      <button type="button" className="approve-cancel-button" onClick={() => setShowApproveModal(false)}>Cancelar</button>
      <button type="button" className="approve-confirm-button" onClick={handleConfirmApprove}>Aprovar</button>
      
    </div>
  </div>
</div>
)}



  {showDetailViewDenunciada &&  albumDetailDenunciada&& (
  <div className="publicacoes_div_princ">
    <h1 className="publicacoes-title2">Denúncias do album</h1>
    <div className="header">
      <h1 className="header-title">{albumDetailDenunciada.nome}</h1>
      <div className="author">
        <div className="authorName"><span>Autor :</span></div>
        {albumDetailDenunciada.user?.caminho_foto && (
          <img src={albumDetailDenunciada.user.caminho_foto} alt={albumDetailDenunciada.user.nome} className="author-icon" />
        )}
        {albumDetailDenunciada.user && (
          <span>{albumDetailDenunciada.user.nome} {albumDetailDenunciada.user.sobrenome}</span>
        )}
      </div>
    </div>
    <div className="tab-content2">
      <div className="denuncia-header2">
        <h2>Lista de Denúncias</h2>
        <span className="total-denuncias">Total: {denuncias.length} {denuncias.length === 1 ? 'Denúncia' : 'Denúncias'}</span>
      </div>
      <div className="denuncias-list">
      
      
        {denuncias.map((denuncia) => (
          
          <div key={denuncia.id} className="denuncia">
             <div className="denuncia-header">
             <div className="denunciante-info">
          {denuncia.denunciador?.caminho_foto && (
            <img src={denuncia.denunciador.caminho_foto} alt={`${denuncia.denunciador.nome} ${denuncia.denunciador.sobrenome}`} className="denuncia-avatar" />
          )}
          <div className="denunciante-texto">
          {denuncia.denunciador && (
            <>
              <span className="denuncia-autor">{denuncia.denunciador.nome} {denuncia.denunciador.sobrenome}</span>
              <span className="denuncia-data">{new Date(denuncia.data_denuncia).toLocaleDateString()}</span>
            </>
          )}
        </div> </div>
        <div className="denuncia-actions">
                {!denuncia.resolvida && (
                  <div className="options-button" onClick={() => toggleOptionsMarcar(denuncia.id)}>
                    <i className="fas fa-ellipsis-v"></i>
                  </div>
                )}
                {optionsOpenMarcar === denuncia.id && (
  <div className="options-menu">
    <button onClick={() => marcarDenunciaComoResolvida(denuncia.id)}>
      <i className="fas fa-check-circle custom-check-icon"></i> Marcar como Resolvida
    </button>
  </div>
)}
                {denuncia.resolvida && (
                  <span className="denuncia-resolvida">Denúncia Resolvida</span>
                )}
              </div>
            </div>
      <div className="denuncia-conteudo">
        <p><strong>Motivo:</strong> {denuncia.motivo_denuncia}</p>
        <p><strong>Informação Adicional:</strong> {denuncia.descricao_denuncia}</p>
      </div>
          </div>
        ))}
      </div>
      <div className="form-buttons">
        <button type="button" className="cancel-button" onClick={() => setShowDetailViewDenunciada(false)}>Cancelar</button>
        <button type="button" className="save-button" onClick={handleMedidasClick}>Tomar Medidas</button>
      </div>
    </div>
    </div>
  
)}





{showMedidasModal && (
<>
  <div className="modal-backdrop2"></div>
  <div className="modal">
    <div className="modal-header">
    <img src="https://i.ibb.co/PDt0P85/Captura-de-ecr-2024-06-26-171232.png" alt="Captura-de-ecr-2024-06-26-171232" className="modal-icon" />
      <span>Tomar medidas:</span>
    </div>
    <div className="modal-body">
    <div className="option" onClick={handleDeleteClickMedidas}>
        <img src="https://i.ibb.co/18XzT1q/Captura-de-ecr-2024-06-26-171433.png" alt="Captura-de-ecr-2024-06-26-171433" />
        <span>Eliminar Local</span>
      </div>
      <div className="option" onClick={() => handleEditClick(albumDetailDenunciada)}>
        <img src="https://i.ibb.co/9hm2v8B/Captura-de-ecr-2024-06-26-171921.png" alt="Captura-de-ecr-2024-06-26-171921" />
        <span>Editar Local</span>
      </div>
      <div className="option" onClick={handleAlertClick}>
        <img src="https://i.ibb.co/ZHC0zw5/Captura-de-ecr-2024-06-26-172004.png" alt="Captura-de-ecr-2024-06-26-172004" />
        <span>Alertar Autor do album</span>
      </div>
    </div>
    <div className="modal-footer">
      <button type="button" className="cancel-button" onClick={() => setShowMedidasModal(false)}>Cancelar</button>
    </div>
  </div>
</>
)}

{showDeleteModalMedidas && (
<>
  <div className="modalDeleteMedidas">
    <div className="modalDeleteMedidas-header">
      <img src="https://i.ibb.co/4dfypxd/Captura-de-ecr-2024-06-28-111846.png" alt="Delete Icon" />
      <span>Eliminar album?</span>
    </div>
    <div className="modalDeleteMedidas-body">
      <p>
        O user que criou este album irá ser notificado sobre a sua ação!
        Insira abaixo o motivo por qual removeu o album deste utilizador, o qual vai ser notificado da sua ação.
      </p>
      <textarea
        className="large-textareaDeleteMedidas"
        placeholder="...motivo de remoção..."
        value={deleteMessage}
        onChange={(e) => setDeleteMessage(e.target.value)}
        maxLength="240"
      />
      <div className="character-count">{deleteMessage.length}/240</div>
    </div>
    <div className="modalDeleteMedidas-footer">
      <button type="button" className="cancel-button" onClick={() => setShowDeleteModalMedidas(false)}>Cancelar</button>
      <button type="button" className="delete-button" onClick={handleDeleteMedidas}>Eliminar</button>
    </div>
  </div>
  <div className="modalDeleteMedidas-backdrop" />
</>
)}

{showSuccessMessageMedidas && (
<div className="modal-backdrop">
  <div className="success-message_delete">
    <div className="success-message-icon"></div>
    <h1>Ação aplicada com sucesso!</h1>
    <button onClick={() => setShowSuccessMessageMedidas(false)}>Continuar</button>
  </div>
</div>
)}



{showAlertModal && (
<div className='modalAlert-backdrop2'>
<div className="modalAlert">
  <div className="modalAlert-header">
    <img src="https://i.ibb.co/ZHC0zw5/Captura-de-ecr-2024-06-26-172004.png" alt="Alert Icon" />
    <span>Alertar Autor</span>
  </div>
  <div className="modalAlert-body">
    <p>
      Insira abaixo o que deseja alertar para o autor deste album, para que este possa o mesmo editar
    </p>
    <textarea
      className="large-textareaAlert"
      placeholder="...motivo de alerta..."
      value={alertMessage}
      onChange={(e) => setAlertMessage(e.target.value)}
      maxLength="240"
    />
    <div className="character-count">{alertMessage.length}/240</div>
  </div>
  <div className="modalAlert-footer">
    <button type="button" className="cancel-button" onClick={() => setShowAlertModal(false)}>Cancelar</button>
    <button type="button" className="submit-button" onClick={handleSendAlert}>Enviar</button>
  </div>
</div>
</div>
)}


{showSuccessMessageAlert && <div className="modal-backdrop"></div>}
{showSuccessMessageAlert && (
  <div className="success-message_delete">
    <div className="success-message-icon"></div>
    <h1>Ação aplicada com sucesso!</h1>
    <button onClick={() => setShowSuccessMessageAlert(false)}>Continuar</button>
  </div>
)}


{showCreateForm && (
      <div className="publicacoes_div_princ"><h1 className="publicacoes-title2">Criar Álbum</h1>
        <div className="header">
          <h1 className="header-title">Nome do álbum</h1>
          <div className="author">
          <div className="authorName"><span>Autor :</span></div>
          <img src={user.caminho_foto} alt="Eu" className="author-icon" />
  <span>{user.nome} {user.sobrenome}</span> 
</div>
        </div>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'descricao' ? 'active' : ''}`}
            onClick={() => handleTabClick('descricao')}
          >
            <i className="fas fa-info-circle tab-icon"></i> Descrição
          </button>
          
         </div>
          <div className="tab-content">
                {activeTab === 'descricao' && (
          <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label>Área do Local</label>
  <select value={area} onChange={(e) => setArea(e.target.value)}>
  <option value="">Selecionar área</option>
  {areas.map((areaOption) => (
    <option key={areaOption.id} value={areaOption.id}>
      {areaOption.nome}
    </option>
  ))}
</select>
</div>

            <div className="form-group">
            <label>Nome do Álbum</label>
            <input type="text" placeholder="inserir nome do local" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="form-group">
            <label>Descrição do Álbum</label>
            <input type="text" placeholder="inserir uma breve descrição do local" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>
            </div>
           <div className="form-buttons">
            <button type="button" className="cancel-button"onClick={handleCancel}>Cancelar</button>
            <button type="button" className="submit-button" onClick={handleSubmit} >Continuar</button>
          </div>
        </form>
      )}

      


      {showSuccessMessage && <div className="modal-backdrop"></div>}
        {showSuccessMessage && (
          <div className="success-message_delete">
            <div className="success-message-icon"></div>
            <h1>album criado com sucesso!</h1>
            <p>Como é o administrador do seu centro, não será necessário passar pelo processo de validação.</p>
            <button onClick={() => setShowSuccessMessage(false)}>Continuar</button>
          </div>
        )}

        </div>
      </div>
    )}

    {!showDetailViewDenunciada && !showApprovalView && !showDetailView && showalbunsList && (
      <div className="publications-view">
        <table className="publications-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nome do Álbum</th>
              <th>Data de Criação</th>
              <th>Estado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
  {albuns.length > 0 ? (
    albuns.map((album, index) => (
      <tr key={album.id}>
        <td>{index + 1}</td>
        <td>{album.nome}</td>
        <td>{formatarData(album.createdAt)}</td>
        <td>
          <span className={`publications-status ${album.estado ? album.estado.toLowerCase().replace(' ', '-') : ''}`}>
            {album.estado || 'Sem estado'}
          </span>
        </td>
        <td>
          <div className="edit-buttons-container">
            <button className="edit-btn" onClick={() => handleViewDetailsClick(album)}>i</button>
            <button className="publications-edit-btn" onClick={() => handleHideClick(album)}>
              <i className={`fas ${album.visivel ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            </button>
            <button className="publications-edit-btn" onClick={() => handleEditClick(album)}>✏️</button>
            <button className="publications-edit-btn" onClick={() => handleDeleteClick(album)}>🗑️</button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">Nenhum álbum encontrado</td>
    </tr>
  )}
</tbody>


          </table>
        </div>
      )}
    </div>
  );
};

export default AlbunsView;