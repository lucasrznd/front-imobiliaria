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
import { AutoComplete } from "primereact/autocomplete";
import { InputNumber } from "primereact/inputnumber";
import { EnderecoModel } from "../models/EnderecoModel";

export default function CadastroImovel() {
    const [imovel, setImovel] = useState(new ImovelModel());
    const [imoveis, setImoveis] = useState([
        {
            id: 1, titulo: 'Casa', descricao: 'Casa grande, dois andares, dois banheiros, 3 quartos.', proprietario: 'Guilherme', endereco: { rua: 'Avenida Aguiar' }, valorTotal: 2000, disponibilidadeTempo: 6, ativo: true
        }
    ]);
    const [endereco, setEndereco] = useState(new EnderecoModel());
    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteImovelDialog, setDeleteImovelDialog] = useState(false);
    const [items, setItems] = useState([]);
    const toast = useRef();

    const buscaAutocomplete = (event) => {
        setItems([...Array(10).keys()].map(item => event.query + '-' + item));
    }

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novoImovelAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaImovelAction} />
        </React.Fragment>
    );

    function novoImovelAction() {
        setImovel(new ImovelModel());
        setEndereco(new EnderecoModel());
        setDetalhesVisible(true);
    }

    function buscaImovelAction() {
        setImovel(new ImovelModel());
        setEndereco(new EnderecoModel());
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesImovel(rowData)} />
                <span style={{ margin: "15px" }} className="pi pi-ellipsis-v"></span>
                <Button icon="pi pi-trash" rounded severity="danger" onClick={() => confirmDeleteImovel(rowData)} />
            </React.Fragment>
        );
    };

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
        const novaLista = imoveis.filter(i => i.titulo !== imovel.titulo);
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
        console.log(imovel);
        imoveis.push(imovel);
        msgSucesso('Imóvel cadastrado com sucesso.');
    }

    const buscarImovelAction = () => {
        console.log('Buscando imóvel: ' + imovel.titulo);
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

    function formatarStatus(rowData) {
        if (rowData && rowData.ativo) {
            if (rowData.ativo === true) {
                return 'Sim';
            }
        }
        return 'Não';
    }

    const changeEnderecoRua = (ev) => {
        setEndereco({ ...endereco, rua: ev.target.value });
        setImovel({ ...imovel, endereco: endereco });
    }

    const changeEnderecoBairro = (ev) => {
        setEndereco({ ...endereco, bairro: ev.target.value });
        setImovel({ ...imovel, endereco: endereco });
    }

    const changeEnderecoNumero = (ev) => {
        setEndereco({ ...endereco, numero: ev.target.value });
        setImovel({ ...imovel, endereco: endereco });
    }

    const changeEnderecoCidade = (ev) => {
        setEndereco({ ...endereco, cidade: ev.target.value });
        setImovel({ ...imovel, endereco: endereco });
    }

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
                            <Column field="endereco.rua" header="Endereço" align="center" alignHeader="center" />
                            <Column field="valorTotal" header="Valor Total" align="center" alignHeader="center" />
                            <Column field="disponibilidadeTempo" header="Disponibilidade (meses)" align="center" alignHeader="center" />
                            <Column field="ativo" header="Ativo" body={formatarStatus} align="center" alignHeader="center" />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center" />
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Imóvel" visible={detalhesVisible} style={{ width: '45vw', minWidth: "40vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 1 }}>
                                <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                                <InputText id="nome" value={imovel.titulo} onChange={(e) => setImovel({ ...imovel, titulo: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='proprietario' style={{ marginBottom: '0.5rem' }}>Proprietário:</label>
                                <AutoComplete value={imovel.proprietario} suggestions={items} completeMethod={buscaAutocomplete} onChange={(e) => setImovel({ ...imovel, proprietario: e.target.value })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem', width: '100%', maxWidth: '28vw' }}>
                            <label htmlFor='descricao' style={{ marginBottom: '0.5rem' }}>Descrição:</label>
                            <InputTextarea id="descricao" value={imovel.descricao} onChange={(e) => setImovel({ ...imovel, descricao: e.target.value })} style={{ width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 2 }}>
                                <label htmlFor='disponibilidadeTempo' style={{ marginBottom: '0.5rem' }}>Disponibilidade (meses):</label>
                                <InputNumber inputId="disponibilidadeTempo" value={imovel.disponibilidadeTempo} onValueChange={(e) => setImovel({ ...imovel, disponibilidadeTempo: e.target.value })} mode="decimal" showButtons min={1} max={12} size={15} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='valorTotal' style={{ marginBottom: '0.5rem' }}>Valor Total:</label>
                                <InputNumber id="valorTotal" value={imovel.valorTotal} onValueChange={(e) => setImovel({ ...imovel, valorTotal: e.target.value })} mode="currency" currency="BRL" locale="pt-BR" style={{ width: "100%" }} placeholder="R$ 2.000,00" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '28vw' }}>
                            <h2 style={{ color: "#069669" }}>Endereço</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '1rem', width: '66%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 1 }}>
                                <label htmlFor='rua' style={{ marginBottom: '0.5rem' }}>Rua:</label>
                                <InputText id="rua" value={endereco.rua} onChange={changeEnderecoRua} style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='bairro' style={{ marginBottom: '0.5rem' }}>Bairro:</label>
                                <InputText id="bairro" value={endereco.bairro} onChange={changeEnderecoBairro} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '66%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 1 }}>
                                <label htmlFor='numero' style={{ marginBottom: '0.5rem' }}>Número:</label>
                                <InputText id="numero" value={endereco.numero} onChange={changeEnderecoNumero} style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='cidade' style={{ marginBottom: '0.5rem' }}>Cidade:</label>
                                <InputText id="cidade" value={endereco.cidade} onChange={changeEnderecoCidade} style={{ width: '100%' }} />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Imóvel" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Nome:</label>
                            <InputText id="nome" value={imovel.titulo} onChange={(e) => setImovel({ ...imovel, titulo: e.target.value })} style={{ width: '300px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <label htmlFor='proprietario' style={{ marginBottom: '0.5rem' }}>Proprietário:</label>
                            <AutoComplete value={imovel.proprietario} suggestions={items} completeMethod={buscaAutocomplete} onChange={(e) => setImovel({ ...imovel, proprietario: e.target.value })} size={23} />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteImovelDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteImovelDialogFooter} onHide={hideDeleteImovelDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {imovel && (
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