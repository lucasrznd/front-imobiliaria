import MenuApp from "../components/Menu";
import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Toolbar } from 'primereact/toolbar';
import { InputMask } from 'primereact/inputmask';
import Rodape from "../components/Rodape";
import { LocatarioModel } from "../models/LocatarioModel";

export default function CadastroLocatario() {
    const [locatario, setLocatario] = useState(new LocatarioModel());
    const [locatarios, setLocatarios] = useState([
        { id: 1, nome: "Exemplo", telefone: "(43) 9 9999-9999", email: "exemplo@gmail.com" },
    ]);

    const [nomeInvalido, setNomeInvalido] = useState(false);
    const [telefoneInvalido, setTelefoneInvalido] = useState(false);
    const [emailInvalido, setEmailInvalido] = useState(false);
    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteLocatarioDialog, setDeleteLocatarioDialog] = useState(false);
    const toast = useRef();

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoLocatarioAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaLocatarioAction} />
        </React.Fragment>
    );

    function novoLocatarioAction() {
        setLocatario(new LocatarioModel());
        setDetalhesVisible(true);
    }

    function buscaLocatarioAction() {
        setLocatario(new LocatarioModel());
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesLocatario(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteLocatario(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesLocatario = (locatario) => {
        setLocatario({ ...locatario });
        setDetalhesVisible(true);
    };

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarLocatario = () => {
        const novaLista = locatarios.filter(l => l.nome !== locatario.nome);
        setLocatarios(novaLista);
        setDeleteLocatarioDialog(false);
        msgAviso('Locatário removido com sucesso.')
    }

    const confirmDeleteLocatario = (locatario) => {
        setLocatario({ ...locatario });
        setDeleteLocatarioDialog(true);
    };

    const hideDeleteLocatarioDialog = () => {
        setDeleteLocatarioDialog(false);
    };

    const deleteLocatarioDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteLocatarioDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarLocatario} />
        </React.Fragment>
    );

    const salvarLocatarioAction = () => {
        if (validarNome() && validarTelefone() && validarEmail()) {
            setDetalhesVisible(false);
            locatarios.push(locatario);
            msgSucesso('Locatário cadastrado.')
        }
    }

    const buscarLocatarioAction = () => {
        console.log('Buscando locatário. ' + locatario.nome);
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
        if (locatario.nome === undefined || locatario.nome === '') {
            msgErro('Nome é obrigatório.');
            setNomeInvalido(true);
            return false;
        } else {
            setNomeInvalido(false);
            return true;
        }
    }

    const validarTelefone = () => {
        if (locatario.telefone === undefined || locatario.telefone === '') {
            msgErro('Telefone é obrigatório.');
            setTelefoneInvalido(true);
            return false;
        } else {
            setTelefoneInvalido(false);
            return true;
        }
    }

    const validarEmail = () => {
        if (locatario.email === undefined || locatario.email === '') {
            msgErro('Email é obrigatório.');
            setEmailInvalido(true);
            return false;
        } else {
            setEmailInvalido(false);
            return true;
        }
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" onClick={salvarLocatarioAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarLocatarioAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    )

    return (
        <div>
            <MenuApp />

            <div>
                <Toast ref={toast} />
                <Panel>
                    <Toolbar style={{ marginBottom: "10px" }} start={conteudoInicial} />

                    <div className="card">
                        <DataTable value={locatarios} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Locatários" rows={5} emptyMessage="Nenhum locatário encontrado."
                            key="id">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="nome" header="Nome" align="center" alignHeader="center"></Column>
                            <Column field="telefone" header="Telefone" align="center" alignHeader="center"></Column>
                            <Column field="email" header="Email" align="center" alignHeader="center"></Column>
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Locatário" visible={detalhesVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <InputText id="nome" value={locatario.nome} onChange={(e) => setLocatario({ ...locatario, nome: e.target.value })} style={{ width: '300px' }}
                                required className={nomeInvalido ? "p-invalid" : ""} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='telefone' style={{ marginBottom: '0.5rem' }}>Telefone:</label>
                            <InputMask id="telefone" value={locatario.telefone} onChange={(e) => setLocatario({ ...locatario, telefone: e.target.value })} mask="(99) 9 9999-9999" placeholder="(99) 9 9999-9999"
                                style={{ width: '300px' }} className={telefoneInvalido ? "p-invalid" : ""} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='email' style={{ marginBottom: '0.5rem' }}>Email:</label>
                            <InputText id="email" value={locatario.email} onChange={(e) => setLocatario({ ...locatario, email: e.target.value })}
                                style={{ width: '300px' }} className={emailInvalido ? "p-invalid" : ""} />
                        </div>

                    </div>
                </Dialog>

                <Dialog header="Buscar Locatário" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <InputText id="nome" value={locatario.nome} onChange={(e) => setLocatario({ ...locatario, nome: e.target.value })} style={{ width: '300px' }} />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteLocatarioDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteLocatarioDialogFooter} onHide={hideDeleteLocatarioDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {locatario && (
                            <span>
                                Deseja realmente excluir o registro?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div>

            <Rodape />
        </div>
    )
}