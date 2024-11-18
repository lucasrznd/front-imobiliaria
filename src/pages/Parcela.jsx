import React, { useEffect, useRef, useState } from "react"
import MenuApp from "../components/Menu";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Panel } from "primereact/panel";
import Rodape from "../components/Rodape";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { ParcelaService } from "../services/ParcelaService";
import { formatarData, formatarValorRealDatatable, formatarValorReal, parseDate } from "../functions/funcoesFormatacao";
import { ContratoService } from "../services/ContratoService";
import { AutoComplete } from "primereact/autocomplete";
import { localePtBr } from "../util/locale";
import { Tag } from "primereact/tag";
import { useFormik } from "formik";
import { msgErro, msgSucesso } from "../util/ToastMessages";
import { FilterMatchMode } from "primereact/api";

export default function CadastroParcela() {
    const [parcelas, setParcelas] = useState([]);
    const parcelaService = new ParcelaService();

    const [contratos, setContratos] = useState([]);
    const [contratosFiltrados, setContratosFiltrados] = useState([]);
    const contratoService = new ContratoService();

    const [detalhesVisible, setDetalhesVisible] = useState(false);
    const [buscarVisible, setBuscarVisible] = useState(false);
    const [deleteParcelaDialog, setDeleteParcelaDialog] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'nomeProprietario': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const toast = useRef();

    const formik = useFormik({
        initialValues: {
            id: undefined,
            contrato: {
                id: undefined,
                imovel: {
                    titulo: ''
                },
            },
            valorParcela: undefined,
            dataInicio: undefined,
            dataVencimento: undefined,
            ativa: true
        },
        validate: (dados) => {
            let errors = {};

            if (!dados.contrato.titulo) {
                errors.contrato = "O campo 'Contrato' é obrigatório.";
            }

            if (!dados.valorParcela) {
                errors.valorParcela = "O campo 'Valor Parcela' é obrigatório.";
            }

            if (!dados.dataInicio) {
                errors.dataInicio = "O campo 'Data de Início' é obrigatório.";
            }

            if (!dados.dataVencimento) {
                errors.dataVencimento = "O campo 'Data de Vencimento' é obrigatório.";
            }

            if (!dados.ativa) {
                errors.ativa = "O campo 'Ativa' é obrigatório.";
            }

            return errors;
        },
        onSubmit: async (values) => {
            if (values.id === undefined) {
                await parcelaService.salvar(values);
                await listarParcelas();
                fecharDetalhes();
                msgSucesso(toast, 'Parcela salva com sucesso.');
            } else {
                await parcelaService.editar(values);
                await listarParcelas();
                fecharDetalhes();
                msgSucesso(toast, 'Parcela editada com sucesso.');
            }
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const conteudoInicial = (
        <React.Fragment>
            <Button icon="pi pi-plus-circle" label='Novo' onClick={novaParcelaAction} />
            <span style={{ margin: "10px" }} className="pi pi-ellipsis-v"></span>
            <Button icon="pi pi-search" label="Buscar" onClick={buscaParcelaAction} />
        </React.Fragment>
    );

    function novaParcelaAction() {
        formik.setFieldValue('id', undefined);
        formik.setFieldValue('contrato', {});
        formik.setFieldValue('valorParcela', undefined);
        formik.setFieldValue('dataInicio', undefined);
        formik.setFieldValue('dataVencimento', undefined);
        formik.setFieldValue('ativa', true);
        formik.resetForm();
        setDetalhesVisible(true);
    }

    function buscaParcelaAction() {
        setBuscarVisible(true);
    }

    const acoesDataTable = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded className="mr-2" onClick={() => detalhesParcela(rowData)} />
                <span className="pi pi-ellipsis-v mb-3" />
                <Button icon="pi pi-trash" rounded className="ml-2" severity="danger" onClick={() => confirmDeleteParcela(rowData)} />
            </React.Fragment>
        );
    };

    const detalhesParcela = async (data) => {
        formik.resetForm();
        formik.setFieldValue('id', data.id);
        formik.setFieldValue('contrato', await getContratoById(data));
        formik.setFieldValue('valorParcela', data.valorParcela);
        formik.setFieldValue('dataInicio', parseDate(data.dataInicio));
        formik.setFieldValue('dataVencimento', parseDate(data.dataVencimento));
        formik.setFieldValue('ativa', data.ativa);
        setDetalhesVisible(true);
    }

    const fecharDetalhes = () => {
        setDetalhesVisible(false);
    }

    const fecharBusca = () => {
        setBuscarVisible(false);
    }

    const deletarParcela = async () => {
        await excluirParcela();
        await listarParcelas();
        setDeleteParcelaDialog(false);
    }

    const confirmDeleteParcela = (rowData) => {
        formik.setValues(rowData);
        setDeleteParcelaDialog(true);
    }

    const hideDeleteParcelaDialog = () => {
        setDeleteParcelaDialog(false);
    }

    const deleteParcelaDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDeleteParcelaDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deletarParcela} />
        </React.Fragment>
    );

    const buscarParcelaAction = async () => {
        await buscarParcelaPorId();
        setBuscarVisible(false);
    }

    const rodapeModal = (
        <div>
            <Button label="Salvar" icon="pi pi-check" type="submit" onClick={formik.handleSubmit} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharDetalhes} />
        </div>
    );

    const rodapeModalBuscar = (
        <div>
            <Button label="Buscar" icon="pi pi-check" onClick={buscarParcelaAction} autoFocus />
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={fecharBusca} />
        </div>
    );

    const contratoItemTemplate = (item) => {
        return (
            <>
                <div>Código: {item.id}</div>
                <div>Imóvel: {item.imovel.titulo.toUpperCase()}</div>
                <div>Locatário: {item.locatario.nome.toUpperCase()}</div>
                <div>Valor Mensal: {formatarValorReal(item.valorMensal)}</div>
            </>
        );
    };

    const imovelBodyTemplate = (rowData) => {
        const imovel = rowData.tituloImovel + ' | ' + rowData.enderecoCompleto;
        return <span>{imovel.toUpperCase()}</span>
    }

    const valorParcelaBodyTemplate = (rowData) => {
        return <span className="font-bold">{formatarValorRealDatatable(rowData, 'valorParcela')}</span>
    }

    const ativaBodyTemplate = (rowData) => {
        if (rowData.ativa) {
            return <Tag value="SIM" severity="success" />
        }
        return <Tag value="NÃO" severity="danger" />
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busca rápida" />
            </div>
        );
    };

    const header = renderHeader();

    const getContratoById = async (rowData) => {
        try {
            const response = await contratoService.buscarPorId(rowData.idContrato);
            return response.data;
        } catch (error) {
            msgErro(toast, 'Erro ao encontrar contrado')
        }
    }

    const listarContratos = async () => {
        try {
            const response = await contratoService.listarTodos();
            setContratos(response.data);
        } catch (error) {
            msgErro(toast, 'Erro ao carregar contratos');
        }
    }

    const completeMethodImoveis = (ev) => {
        const sugestoesFiltradas = contratos.filter(c => c.imovel.titulo.toLowerCase().includes(ev.query.toLowerCase()));

        setContratosFiltrados(sugestoesFiltradas);

        return sugestoesFiltradas;
    };

    const listarParcelas = async () => {
        try {
            const response = await parcelaService.listarTodos();
            setParcelas(response.data);
        } catch (error) {
            msgErro(toast, 'Erro ao carregar parcelas');
        }
    }

    const buscarParcelaPorId = async () => {
        try {
            const response = await parcelaService.buscarPorId(formik.values.id);
            setParcelas([response.data]);
        } catch (error) {
            msgErro(toast, 'Erro ao buscar parcela.');
        }
    }

    const excluirParcela = async () => {
        await parcelaService.excluir(formik.values.id);
        msgSucesso(toast, 'Parcela removida com sucesso.');
    }

    useEffect(() => {
        listarParcelas();
        listarContratos();
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
                        <DataTable value={parcelas} tableStyle={{ minWidth: '50rem' }}
                            paginator header={header} rows={5} emptyMessage="Nenhuma parcela encontrada." filters={filters}
                            key="id" filterDisplay="row" globalFilterFields={['idContrato', 'enderecoCompleto', 'nomeProprietario', 'valorParcela', 'locatario.nome', 'dataInicio', 'dataVencimento']}
                            globalFilterMatchMode="startsWith">
                            <Column field="idContrato" header="Cód. Contrato" align="center" alignHeader="center" />
                            <Column field="enderecoCompleto" body={imovelBodyTemplate} header="Imóvel" align="center" alignHeader="center" />
                            <Column field="nomeProprietario" body={(rowData) => rowData.nomeProprietario.toUpperCase()} header="Proprietário" align="center" alignHeader="center" />
                            <Column field="valorParcela" body={valorParcelaBodyTemplate} header="Valor Parcela" align="center" alignHeader="center"></Column>
                            <Column field="dataInicio" header="Data de Início" body={(rowData) => formatarData(rowData, "dataInicio")} align="center" alignHeader="center"></Column>
                            <Column field="dataVencimento" header="Data de Vencimento" body={(rowData) => formatarData(rowData, "dataVencimento")} align="center" alignHeader="center"></Column>
                            <Column field="ativa" body={ativaBodyTemplate} header="Ativa" align="center" alignHeader="center" />
                            <Column body={acoesDataTable} exportable={false} style={{ minWidth: '12rem' }} align="center" header="Ações" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </Panel>

                <Dialog header="Detalhes da Parcela" visible={detalhesVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModal} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor='contrato' style={{ marginBottom: '0.5rem' }}>Contrato:</label>
                            <AutoComplete id="contrato" value={formik.values.contrato} suggestions={contratosFiltrados}
                                field="imovel.titulo" itemTemplate={contratoItemTemplate}
                                completeMethod={completeMethodImoveis}
                                onChange={(e) => formik.setFieldValue('contrato', e.value)}
                                className={isFormFieldValid('contrato') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('contrato')}
                        </div>

                        <div className="field">
                            <label htmlFor='valorParcela' style={{ marginBottom: '0.5rem' }}>Valor Parcela:</label>
                            <InputNumber id="valorParcela" value={formik.values.valorParcela}
                                onValueChange={formik.handleChange}
                                mode="currency" currency="BRL" locale="pt-BR"
                                placeholder="R$ 2.000,00"
                                className={isFormFieldValid('valorParcela') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('valorParcela')}
                        </div>

                        <div className="field">
                            <label htmlFor='dataInicio' style={{ marginBottom: '0.5rem' }}>Data de Início:</label>
                            <Calendar id="dataInicio" value={formik.values.dataInicio}
                                onChange={(e) => formik.setFieldValue('dataInicio', new Date(e.value))}
                                showIcon dateFormat="dd/mm/yy" locale="pt-BR"
                                className={isFormFieldValid('dataInicio') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('dataInicio')}
                        </div>

                        <div className="field">
                            <label htmlFor='dataVencimento' style={{ marginBottom: '0.5rem' }}>Data de Vencimento:</label>
                            <Calendar id="dataVencimento" value={formik.values.dataVencimento}
                                onChange={(e) => formik.setFieldValue('dataVencimento', new Date(e.value))}
                                showIcon dateFormat="dd/mm/yy" locale="pt-BR"
                                className={isFormFieldValid('dataVencimento') ? "p-invalid uppercase" : "uppercase"} />
                            {getFormErrorMessage('dataVencimento')}
                        </div>

                        <div className="field">
                            <div className="flex align-items-center justify-content-center">
                                <label htmlFor='ativa'>Ativa:</label>
                                <Checkbox id="ativa" onChange={formik.handleChange}
                                    className="ml-1"
                                    checked={formik.values.ativa} />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Buscar Parcela" visible={buscarVisible} style={{ width: '30vw', minWidth: "30vw" }} onHide={() => setDetalhesVisible(false)}
                    footer={rodapeModalBuscar} draggable={false}>
                    <div className="card p-fluid">
                        <div className="field">
                            <label htmlFor="id" style={{ marginBottom: '0.5rem' }}>Código:</label>
                            <InputText id="id" value={formik.values.id} onChange={formik.handleChange} />
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={deleteParcelaDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmação" modal footer={deleteParcelaDialogFooter} onHide={hideDeleteParcelaDialog}>
                    <div className="confirmation-content" style={{ display: "flex", alignItems: "center" }}>
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {(
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