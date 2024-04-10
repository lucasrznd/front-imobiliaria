import React, { useEffect, useRef, useState } from "react"
import { ProprietarioModel } from "../models/ProprietarioModel"
import { Button } from "primereact/button";
import MenuApp from "../components/Menu";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Checkbox } from "primereact/checkbox";
import Rodape from "../components/Rodape";
import { ProprietarioService } from "../services/ProprietarioService";

export default function CadastroProprietario() {
    const [proprietario, setProprietario] = useState(new ProprietarioModel());
    const [proprietarios, setProprietarios] = useState([]);
    const proprietarioService = new ProprietarioService();

    const [nomeInvalido, setNomeInvalido] = useState(false);
    const [telefoneInvalido, setTelefoneInvalido] = useState(false);
    const [statusInvalido, setStatusInvalido] = useState(false);
    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteProprietarioDialog, setDeleteProprietarioDialog] = useState(false);
    const toast = useRef();

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoProprietarioAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaProprietarioAction} />
        </React.Fragment>
    );

    function novoProprietarioAction() {
        setProprietario(new ProprietarioModel());
        setDetalhesVisible(true);
        setNomeInvalido(false);
        setTelefoneInvalido(false);
    }

    function buscaProprietarioAction() {
        setProprietario(new ProprietarioModel());
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesProprietario(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteProprietario(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesProprietario = (proprietario) => {
        setProprietario({ ...proprietario });
        setDetalhesVisible(true);
    }

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarProprietario = async () => {
        await excluirProprietario();
        await listarProprietarios();
        setDeleteProprietarioDialog(false);
    }

    const confirmDeleteProprietario = (proprietario) => {
        setProprietario({ ...proprietario });
        setDeleteProprietarioDialog(true);
    }

    const hideDeleteProprietarioDialog = () => {
        setDeleteProprietarioDialog(false);
    }

    const deleteProprietarioDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteProprietarioDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarProprietario} />
        </React.Fragment>
    );

    const salvarProprietarioAction = () => {
        if (validarNome() && validarTelefone() && validarStatus()) {
            setDetalhesVisible(false);
            salvarProprietario();
            msgSucesso('Proprietário salvo com sucesso.');
        }
    }

    const buscarProprietarioAction = async () => {
        await buscarProprietarioPorId();
        setBuscarVisible(false);
    }

    function msgSucesso(msg) {
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: msg, life: 3000 });
    }

    function msgAviso(msg) {
        toast.current.show({ severity: 'warn', summary: 'Aviso', detail: msg, life: 3000 });
    }

    function msgErro(msg) {
        toast.current.show({ severity: 'error', summary: 'Erro', detail: msg, life: 3000 });
    }

    const validarNome = () => {
        if (proprietario.nome === undefined || proprietario.nome === '') {
            msgErro('Nome é obrigatório.');
            setNomeInvalido(true);
            return false;
        } else {
            setNomeInvalido(false);
            return true;
        }
    }

    const validarTelefone = () => {
        if (proprietario.telefone === undefined || proprietario.telefone === '') {
            msgErro('Telefone é obrigatório.');
            setTelefoneInvalido(true);
            return false;
        } else {
            setTelefoneInvalido(false);
            return true;
        }
    }

    const validarStatus = () => {
        if (proprietario.ativo === undefined) {
            msgErro('Status é obrigatório.');
            setStatusInvalido(true);
            return false;
        } else {
            setStatusInvalido(false);
            return true;
        }
    }

    function formatarStatus(rowData) {
        if (rowData && rowData.ativo) {
            if (rowData.ativo === true) {
                return 'Sim';
            }
        }
        return 'Não';
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" onClick={salvarProprietarioAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarProprietarioAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    const listarProprietarios = async () => {
        try {
            const response = await proprietarioService.listarTodos();
            setProprietarios(response.data);
        } catch (error) {
            msgErro('Erro ao carregar proprietários.')
        }
    }

    const buscarProprietarioPorId = async () => {
        try {
            const response = await proprietarioService.buscarPorId(proprietario.id);
            setProprietarios([response.data]);
            setProprietario(new ProprietarioModel());
        } catch (error) {
            msgErro('Erro ao buscar proprietário.');
        }
    }

    const salvarProprietario = async () => {
        if (proprietario.id === undefined) {
            await proprietarioService.salvar(proprietario);
            await listarProprietarios();
            setProprietario(new ProprietarioModel());
        } else {
            await proprietarioService.editar(proprietario);
            await listarProprietarios();
            setProprietario(new ProprietarioModel());
        }
    }

    const excluirProprietario = async () => {
        await proprietarioService.excluir(proprietario.id);
        msgAviso('Proprietário removido com sucesso.');
    }

    useEffect(() => {
        listarProprietarios();
    }, []);

    return (
        <div>
            <MenuApp />

            <div>
                <Toast ref={toast} />

                <Panel>
                    <Toolbar style={{ marginBottom: "10px" }} start={conteudoInicial} />

                    <div className="card">
                        <DataTable value={proprietarios} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Proprietários" rows={5} emptyMessage="Nenhum proprietário encontrado."
                            key="id">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="nome" header="Nome" align="center" alignHeader="center"></Column>
                            <Column field="telefone" header="Telefone" align="center" alignHeader="center"></Column>
                            <Column field="ativo" body={formatarStatus} header="Ativo" align="center" alignHeader="center" />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Proprietário" visible={detalhesVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <InputText id="nome" value={proprietario.nome} onChange={(e) => setProprietario({ ...proprietario, nome: e.target.value })} style={{ width: '300px' }}
                                required className={nomeInvalido ? "p-invalid" : ""} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='telefone' style={{ marginBottom: '0.5rem' }}>Telefone:</label>
                            <InputMask id="telefone" value={proprietario.telefone} onChange={(e) => setProprietario({ ...proprietario, telefone: e.target.value })} mask="(99) 9 9999-9999" placeholder="(99) 9 9999-9999"
                                style={{ width: '300px' }} className={telefoneInvalido ? "p-invalid" : ""} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='ativo' style={{ marginBottom: '0.5rem' }}>Ativo:</label>
                            <Checkbox id="ativo" onChange={(e) => setProprietario({ ...proprietario, ativo: e.checked })} checked={proprietario.ativo}
                                className={statusInvalido ? "p-invalid" : ""} style={{ marginLeft: "5px" }} />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Proprietário" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='id' style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={proprietario.id} onChange={(e) => setProprietario({ ...proprietario, id: e.target.value })} style={{ width: '300px' }} />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteProprietarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteProprietarioDialogFooter} onHide={hideDeleteProprietarioDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {proprietario && (
                            <span>
                                Deseja realmente excluir o registro?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Rodape />
            </div>
        </div>
    )
}