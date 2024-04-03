export class ContratoModel {

    constructor(id, imovel, locatario, dataInicio, dataFim, valorMensal, multa, status) {
        this.id = id
        this.imovel = imovel 
        this.locatario = locatario 
        this.dataInicio = dataInicio
        this.dataFim = dataFim
        this.valorMensal = valorMensal
        this.multa = multa 
        this.status = status
    }

}