import cl from './NotAuth.module.css'
import {useNavigate} from "react-router-dom";
import Button from "../UI/button/Button.jsx";

function NotAuth() {
    const navigate = useNavigate()

    return (
        <div className={cl.noAuthWrapper}>
            <h2>Вы не авторизованы!</h2>
            <Button className={cl.button} onClick={() => navigate("/login")}>Войти в систему</Button>
        </div>
    );
}

export default NotAuth;
