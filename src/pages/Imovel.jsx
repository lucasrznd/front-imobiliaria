import React, { useRef, useState } from "react"
import { ImovelModel } from "../models/ImovelModel"
import { Button } from "primereact/button";
import MenuApp from "../components/Menu";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import Rodape from "../components/Rodape";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

export default function CadastroImovel() {
    const [imovel, setImovel] = useState(new ImovelModel());
    const [imoveis, setImoveis] = useState([
        { id: 1, titulo: 'Casa', descricao: 'Casa grande, dois andares, dois banheiros, 3 quartos.', }
    ]);
    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteImovelDialog, setDeleteImovelDialog] = useState(false);
    const toast = useRef();

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoImovelAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaImovelAction} />
        </React.Fragment>
    );

    function novoImovelAction() {
        setImovel(new ImovelModel());
        setDetalhesVisible(true);
    }

    function buscaImovelAction() {
        setImovel(new ImovelModel());
        setBuscarVisible(true);
    }

    const detalhesImovel = (imovel) => {
        setImovel({ ...imovel });
        setDetalhesVisible(true);
    }

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarImovel = () => {
        const novaLista = imoveis.filter(i => i.nome !== imovel.nome);
        setImoveis(novaLista);
        setDeleteImovelDialog(false);
        msgAviso('Imóvel removido com sucesso.');
    }

    const confirmDeleteImovel = (imovel) => {
        setImovel({ ...imovel });
        setDeleteImovelDialog(true);
    }

    const hideDeleteImovelDialog = () => {
        setDeleteImovelDialog(false);
    }

    const deleteImovelDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteImovelDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarImovel} />
        </React.Fragment>
    );

    const salvarImovelAction = () => {
        setDetalhesVisible(false);
        imoveis.push(imovel);
        msgSucesso('Imóvel cadastrado com sucesso.');
    }

    const buscarImovelAction = () => {
        console.log('Buscando imóvel: ' + imovel.nome);
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

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" onClick={salvarImovelAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarImovelAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    return (
        <div>
            <MenuApp />

            <div>
                <Toast ref={toast} />

                <Panel>
                    <Toolbar style={{ marginBottom: "10px" }} start={conteudoInicial} />

                    <div className="card">
                        <DataTable value={imoveis} tableStyle={{ minWidth: '50rem' }}
                            paginator header="Imóvel" rows={5} emptyMessage="Nenhum imóvel encontrado."
                            key="id">
                            <Column field="id" header="Código" align="center" alignHeader="center"></Column>
                            <Column field="titulo" header="Título" align="center" alignHeader="center"></Column>
                            <Column field="descricao" header="Descrição" align="center" alignHeader="center" />
                            <Column field="proprietario" header="Proprietário" align="center" alignHeader="center" />
                            <Column field="endereco" header="Endereço" align="center" alignHeader="center" />
                            <Column field="valorTotal" header="Valor Total" align="center" alignHeader="center" />
                            <Column field="disponibilidadeTempo" header="Disponibilidade Tempo" align="center" alignHeader="center" />
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Imóvel" visible={detalhesVisible} style={{ width: '45vw', minWidth: "40vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem' }}>
                                <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                                <InputText id="nome" value={imovel.titulo} onChange={(e) => setImovel({ ...imovel, titulo: e.target.value })} style={{ width: '300px' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label htmlFor='proprietario' style={{ marginBottom: '0.5rem' }}>Proprietário:</label>
                                <InputText id="proprietario" value={imovel.proprietario} onChange={(e) => setImovel({ ...imovel, proprietario: e.target.value })} style={{ width: '300px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='descricao' style={{ marginBottom: '0.5rem' }}>Descrição:</label>
                            <InputTextarea id="descricao" value={imovel.descricao} onChange={(e) => setImovel({ ...imovel, descricao: e.target.value })} style={{ width: '615px' }} />
                        </div>
                    </div>

                </Dialog>

                <Rodape />
            </div>
        </div>
    )
}