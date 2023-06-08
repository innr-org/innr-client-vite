import cl from './NotFound.module.css'
import Button from "../UI/button/Button.jsx";
import {useNavigate} from "react-router-dom";

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className={cl.noAuthWrapper}>
            <h2>404! Страница не найдена</h2>
            <Button onClick={() => navigate("/mainscan")}>Назад</Button>
        </div>
    );
}

export default NotFound;
