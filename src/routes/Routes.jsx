import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CadastroLocatario from "../pages/Locatario";
import CadastroProprietario from "../pages/Proprietario";
import CadastroImovel from "../pages/Imovel";
import CadastroParcela from "../pages/Parcela";
import Home from "../pages/Home";
import Pagina404 from "../pages/Pagina404";

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/locatario" element={<CadastroLocatario />} />
                <Route path="/proprietario" element={<CadastroProprietario />} />
                <Route path="/imovel" element={<CadastroImovel />} />
                <Route path="/parcela" element={<CadastroParcela />} />
                <Route path="*" element={<Pagina404 />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;