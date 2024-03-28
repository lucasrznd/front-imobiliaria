import React, { Fragment } from "react";
import './../css/login.css'; // Importa o arquivo CSS regular
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useState } from "react";
import logo from './../assets/images/logo.png';
import retangulo from './../assets/images/Rectangle 1.png'

export default function Login(){
    const [value, setValue] = useState('');

    return(
        <Fragment>
            <div className="fundo">
                <div className="blocoum">
                    <div>
                        <img className="retangulo" src={retangulo} alt="" />
                    </div>
                </div>
                <div className="blocodois">
                    <div>
                        <img className="imagem" src={logo} alt="" />
                        <div className="senha" >Usuário: </div>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <InputText placeholder="Username" />
                    </div>
                    <div className="senha">Senha: </div>
                    <div>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-lock"></i>
                        </span>
                        <Password  placeholder="Senha" value={value} onChange={(e) => setValue(e.target.value)} feedback={false} tabIndex={1} />
                         
                    </div>
                        
                       
                    </div>
                    <div>
                        <Button label="Entrar" />
                    </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
