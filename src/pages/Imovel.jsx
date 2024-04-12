import React, { useEffect, useRef, useState } from "react"
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
import { ImovelService } from "../services/ImovelService";
import { ProprietarioService } from "../services/ProprietarioService";
import { formatarStatusAtivo } from "../functions/funcoesFormatacao";
import { Checkbox } from "primereact/checkbox";

export default function CadastroImovel() {
    const [imovel, setImovel] = useState(new ImovelModel());
    const [imoveis, setImoveis] = useState([]);
    const imovelService = new ImovelService();
    const [proprietarios, setProprietarios] = useState([]);
    const [items, setItems] = useState([]);
    const proprietarioService = new ProprietarioService();

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

    const deletarImovel = async () => {
        setDeleteImovelDialog(false);
        await excluirImovel();
        await listarImoveis();
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
        salvarImovel();
        setDetalhesVisible(false);
        msgSucesso('Imóvel cadastrado com sucesso.');
    }

    const buscarImovelAction = async () => {
        await buscarImovelPorId();
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

    const listarProprietarios = async () => {
        try {
            const response = await proprietarioService.listarTodos();
            setProprietarios(response.data);
        } catch (error) {
            msgErro('Erro ao carregar proprietários.');
        }
    }

    const completeMethod = (ev) => {
        const sugestoesFiltradas = proprietarios.filter(p => p.nome.toLowerCase().includes(ev.query.toLowerCase()));

        setItems(sugestoesFiltradas);

        return sugestoesFiltradas;
    };

    const listarImoveis = async () => {
        try {
            const response = await imovelService.listarTodos();
            setImoveis(response.data);
        } catch (error) {
            msgErro('Erro ao carregar imóveis.');
        }
    }

    const buscarImovelPorId = async () => {
        try {
            const response = await imovelService.buscarPorId(imovel.id);
            setImoveis([response.data]);
            setImovel(new ImovelModel());
        } catch (error) {
            msgErro('Erro ao buscar imóvel.');
        }
    }

    const salvarImovel = async () => {
        console.log(imovel);
        if (imovel.id === undefined) {
            await imovelService.salvar(imovel);
            await listarImoveis();
            setImovel(new ImovelModel());
        } else {
            await imovelService.editar(imovel);
            await listarImoveis();
            setImovel(new ImovelModel());
        }
    }

    const excluirImovel = async () => {
        await imovelService.excluir(imovel.id);
        msgAviso('Imóvel removido com sucesso.');
    }

    useEffect(() => {
        listarImoveis();
        listarProprietarios();
        // eslint-disable-next-line
    }, []);

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
                            <Column field="proprietario.nome" header="Proprietário" align="center" alignHeader="center" />
                            <Column field="endereco.rua" header="Endereço" align="center" alignHeader="center" />
                            <Column field="valorTotal" header="Valor Total" align="center" alignHeader="center" />
                            <Column field="disponibilidadeTempo" header="Disponibilidade (meses)" align="center" alignHeader="center" />
                            <Column field="status" header="Ativo" body={(rowData) => formatarStatusAtivo(rowData, "status")} align="center" alignHeader="center" />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center" />
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes do Imóvel" visible={detalhesVisible} style={{ width: '45vw', minWidth: "40vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 1 }}>
                                <label htmlFor='nome' style={{ marginBottom: '0.5rem' }}>Título:</label>
                                <InputText id="nome" value={imovel.titulo} onChange={(e) => setImovel({ ...imovel, titulo: e.target.value })} style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='proprietario' style={{ marginBottom: '0.5rem' }}>Proprietário:</label>
                                <AutoComplete value={imovel.proprietario} suggestions={items} field="nome" completeMethod={completeMethod} onChange={(e) => setImovel({ ...imovel, proprietario: e.target.value })} style={{ width: '100%' }} />
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
                                <InputText id="rua" value={imovel.endereco?.rua} onChange={(e) => setImovel({ ...imovel, endereco: { ...imovel.endereco, rua: e.target.value } })} style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='bairro' style={{ marginBottom: '0.5rem' }}>Bairro:</label>
                                <InputText id="bairro" value={imovel.endereco?.bairro} onChange={(e) => setImovel({ ...imovel, endereco: { ...imovel.endereco, bairro: e.target.value } })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '66%', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem', flex: 1 }}>
                                <label htmlFor='numero' style={{ marginBottom: '0.5rem' }}>Número:</label>
                                <InputText id="numero" value={imovel.endereco?.numero} onChange={(e) => setImovel({ ...imovel, endereco: { ...imovel.endereco, numero: e.target.value } })} style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <label htmlFor='cidade' style={{ marginBottom: '0.5rem' }}>Cidade:</label>
                                <InputText id="cidade" value={imovel.endereco?.cidade} onChange={(e) => setImovel({ ...imovel, endereco: { ...imovel.endereco, cidade: e.target.value } })} style={{ width: '100%' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                            <label htmlFor='status' style={{ marginBottom: '0.5rem' }}>Ativo:</label>
                            <Checkbox id="status" onChange={(e) => setImovel({ ...imovel, status: e.checked })} checked={imovel.status} style={{ marginLeft: "5px" }} />
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Imóvel" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <label htmlFor='id' style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={imovel.id} onChange={(e) => setImovel({ ...imovel, id: e.target.value })} style={{ width: '300px' }} />
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