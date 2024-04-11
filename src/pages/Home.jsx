import MenuApp from "../components/Menu";
import { useEffect, useRef, useState } from "react";
import Rodape from "../components/Rodape";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ContratoService } from "../services/ContratoService";
import { Toast } from "primereact/toast";
import { formatarData, formatarValorRealDatatable } from "../functions/funcoesFormatacao";
import { ImovelService } from "../services/ImovelService";
import { ProprietarioService } from "../services/ProprietarioService";

export default function Home() {
    const [contratos, setContratos] = useState([]);
    const contratoService = new ContratoService();

    const [imoveis, setImoveis] = useState([]);
    const imovelService = new ImovelService();

    const [proprietarios, setProprietarios] = useState([]);
    const proprietarioService = new ProprietarioService();

    const toast = useRef();

    function msgSucesso(msg) {
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: msg, life: 3000 });
    }

    function msgAviso(msg) {
        toast.current.show({ severity: 'warn', summary: 'Aviso', detail: msg, life: 3000 });
    }

    function msgErro(msg) {
        toast.current.show({ severity: 'error', summary: 'Erro', detail: msg, life: 3000 });
    }

    const listarContratos = async () => {
        try {
            const response = await contratoService.listarTodos();
            setContratos(response.data);
        } catch (error) {
            msgErro('Erro ao carregar contratos');
        }
    }

    const listarImoveis = async () => {
        try {
            const response = await imovelService.listarTodos();
            setImoveis(response.data);
        } catch (error) {
            msgErro('Erro ao carregar imóveis.')
        }
    }

    const listarProprietarios = async () => {
        try {
            const response = await proprietarioService.listarTodos();
            setProprietarios(response.data);
        } catch (error) {
            msgErro('Erro ao carregar proprietários.')
        }
    }

    useEffect(() => {
        listarContratos();
        listarImoveis();
        listarProprietarios();
    }, [])

    return (
        <div>
            <MenuApp />

            <Toast ref={toast} />
            <div className="grid mt-1">
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Contratos Ativos</span>
                                <div className="text-900 font-medium text-xl">{contratos.length}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <a href="/contrato"><i className="pi pi-file text-blue-500 text-xl"></i></a>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{contratos.length} novos </span>
                        <span className="text-500">desde a última visita</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Imóveis</span>
                                <div className="text-900 font-medium text-xl">{imoveis.length}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <a href="/imovel"><i className="pi pi-building text-cyan-500 text-xl"></i></a>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{imoveis.length}  </span>
                        <span className="text-500">novos registrados</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Proprietários Ativos</span>
                                <div className="text-900 font-medium text-xl">{proprietarios.length}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <a href="/proprietario"><i className="pi pi-user text-purple-500 text-xl"></i></a>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{proprietarios.length} </span>
                        <span className="text-500">novos ativos</span>
                    </div>
                </div>
            </div>

            <div className="grid mt-2">
                <div className="col-12 md:col-6">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between">
                            <div>
                                <span className="block text-primary font-medium mb-3">Últimos Contratos</span>
                            </div>
                        </div>
                        <DataTable value={contratos} paginator rows={5} emptyMessage="Nenhum contrato encontrado."
                            key="id">
                            <Column field="imovel.titulo" header="Imóvel" align="center" alignHeader="center"></Column>
                            <Column field="locatario.nome" header="Locatário" align="center" alignHeader="center"></Column>
                            <Column field="dataInicio" header="Data de Início" body={(rowData) => formatarData(rowData, "dataInicio")} align="center" alignHeader="center"></Column>
                            <Column field="dataTermino" header="Data de Término" body={(rowData) => formatarData(rowData, "dataTermino")} align="center" alignHeader="center"></Column>
                            <Column field="valorMensal" body={(rowData) => formatarValorRealDatatable(rowData, "valorMensal")} header="Valor Mensal" align="center" alignHeader="center"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>

            <Rodape />
        </div>
    )
}
