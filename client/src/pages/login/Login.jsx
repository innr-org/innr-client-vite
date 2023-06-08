import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import styles from './login.module.css'
import green from '../../assets/login/green.svg';
import lines from '../../assets/login/lines.svg';
import facebook from '../../assets/login/fb.svg';
import google from '../../assets/login/gg.svg';
import {useDispatch, useSelector} from "react-redux";
import {userLogin} from "../../features/auth/authActions.js";
import {useNotification} from "../../hooks/useNotification.js";
import {ReactNotifications} from "react-notifications-component";

function Login() {
    const { loading, success, userInfo, error } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const phoneNumInput = useRef(null);
    const passwordInput = useRef(null);

    useEffect(() => {
        if(userInfo!==null){
            navigate("/mainscan")
        }
    }, [userInfo])

    useEffect(() => {
        if(success && !loading && userInfo){
            useNotification("success", "Авторизация", "Успешный вход!")
            navigate("/mainscan")
        }
        else if(!success && error && !loading){
            if(error === "Request failed with status code 401"){
                useNotification("danger", "Авторизация", "Неверные данные!")
                clearForm()
            }
            else{
                useNotification("danger", "Авторизация", "Ошибка авторизации!")
            }
        }
    }, [success, error, loading])



    async function login(e){
        e.preventDefault()
        const details = {
            phone: phoneNumInput.current.value,
            password: passwordInput.current.value
        }
        dispatch(userLogin(details))
    }


    function clearForm()
    {
        if (phoneNumInput.current != null && passwordInput.current != null)
        {
            phoneNumInput.current.value=""
            passwordInput.current.value=""
        }
    }

    return (
        <div className={styles.container}>
            <ReactNotifications />
            <img
                className={styles.green}
                src={green}
                alt='green'
            />
            <div className={styles.welcome__text}>
                <img
                    className={styles.lines}
                    src={lines}
                    alt='lines'
                />
                <h1 className={styles.welcome__h1}>Добро пожаловать!</h1>
            </div>
            <form className={styles.login__form} onSubmit={(e) => login(e)}>
                <input
                    ref={phoneNumInput}
                    type="text"
                    className={styles.email}
                    id='email'
                    placeholder='Ваш номер телефона'
                    required
                />
                <input
                    ref={passwordInput}
                    type="password"
                    className={styles.password}
                    id='password'
                    placeholder='Пароль'
                    required
                />
                <div className={styles.forget__password}>
                    <a href='#' className={styles.forget__password__a}>Забыли пароль?</a>
                </div>
                <input onClick={(e) => login(e)} type="submit" className={styles.enter__btn} name="submit" id="submit"  value="Войти в систему"/>
            </form>
            <div className={styles.create__account}>
                <p className={styles.create__account__p}>Еще нет аккаунта?</p>
                <a className={styles.create__account__a} onClick={() => navigate("/register")}>Зарегистрироваться</a>
            </div>
            <div className={styles.login__via}>
                <p className={styles.login__via__a}>или войти через</p>
            </div>
        </div>
    );
}

export default Login;
