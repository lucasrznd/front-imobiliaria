import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import logo from './../assets/images/logo-sgi.png';
import retangulo from './../assets/images/retangulo1.png'
import homem from './../assets/images/homem.png'
import luminaria from './../assets/images/luminaria.png'
import './../css/login.css'

const Login = () => {
    const [value, setValue] = useState('');

    useEffect(() => {
        // Adicionar classe ao body quando o componente é montado
        document.body.classList.add('login-page');

        // Remover a classe do body quando o componente é desmontado
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    return (
        <div className="fundo">
            <div className="blocoum">
                <div>
                    <img className="luminaria" src={luminaria} alt="" />
                    <img className="retangulo" src={retangulo} alt="" />
                    <img className="homem" src={homem} alt="" />
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
                            <Password placeholder="Senha" value={value} onChange={(e) => setValue(e.target.value)} feedback={false} tabIndex={1} />
                        </div>
                    </div>
                    <div>
                        <Button className="botao" label="Entrar" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
