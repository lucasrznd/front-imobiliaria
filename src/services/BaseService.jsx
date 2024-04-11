import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:4000"
});

export class BaseService {

    url = ''

    constructor(url) {
        this.url = url;
    }

    listarTodos() {
        return axiosInstance.get(this.url);
    }

    buscarPorId(id) {
        return axiosInstance.get(this.url + '/' + id);
    }

    salvar(objeto) {
        return axiosInstance.post(this.url, objeto);
    }

    editar(objeto) {
        return axiosInstance.put(this.url + "/" + objeto.id, objeto)
    }

    excluir(id) {
        return axiosInstance.delete(this.url + "/" + id);
    }

}