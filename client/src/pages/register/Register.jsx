import {useEffect, useRef, useState} from 'react';
import styles from './register.module.css'
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../../hooks/useNotification.js";
import {userRegister} from "../../features/auth/authActions.js";
import {ReactNotifications} from "react-notifications-component";

function Register() {
    const { loading, success, userInfo, error } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isAccepted, setIsAccepted] = useState(false)
    const fullNameRef = useRef(null)
    const phoneRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordConfirmRef = useRef(null)

    useEffect(() => {

        if(userInfo!==null){
            navigate("/mainscan")
        }
    }, [userInfo])

    useEffect(() => {
        if(success && !loading && userInfo){
            console.log(success)
            useNotification("success", "Авторизация", "Успешная регистрация!")
            navigate("/mainscan")
        }
        else if(!success && error && !loading){
            if(error === "Request failed with status code 401"){
                console.log(error)
                useNotification("danger", "Авторизация", "Неверные данные!")
            }
            else{
                useNotification("danger", "Авторизация", "Ошибка авторизации!")
            }
        }

    }, [success, error, loading])

    async function register(e){
        e.preventDefault()
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            useNotification("danger", "Авторизация", "Пароли не совпадают!")
            return
        }

        const details = {
            fullName: fullNameRef.current.value,
            phone: phoneRef.current.value,
            password: passwordRef.current.value
        }
        try{
            dispatch(userRegister(details))
                .then(status => {
                    if(status===200){
                        console.log(status)
                        navigate('/mainscan')
                    }
                })
                .catch(err => console.log(err))
        }
        catch (error) {
            console.log(error)
        }

    }

    return (
        <div className={styles.container}>
            <ReactNotifications />
            <div className={styles.innr__text}>
                <h1 className={styles.innr__h1}>Преобразуйте <br /> кожу c Innr </h1>
                <p className={styles.innr__p}>Создайте аккаунт чтобы начать</p>
            </div>
            <form className={styles.register__form} onSubmit={(e) => register(e)}>
                <input type="text"
                       className={styles.form__name}
                       placeholder='ФИО'
                       ref={fullNameRef}/>
                <input type="text"
                       className={styles.form__email}
                       id='email'
                       placeholder='Ваш номер телефона'
                       ref={phoneRef}/>
                <input type="password"
                       className={styles.form__password}
                       id='password'
                       placeholder='Пароль'
                       required
                       ref={passwordRef}/>
                <input type="password"
                       className={styles.form__password}
                       id='passwordConfirm'
                       placeholder='Повторите пароль'
                       required
                       ref={passwordConfirmRef}
                />
                <div className={styles.agreement}>
                    {/* <input className={styles.checkbox} type="checkbox" id="checkbox" name="checkbox" value="" /> */}

                    <label className={styles.accept}>
                        <input checked={isAccepted} onChange={() => setIsAccepted(prevState => !prevState)} className={styles.checkbox} type="checkbox" name="accept" />
                        <p className={styles.agreement__text}>
                            Я принимаю правила <a href='#' className={styles.underline}>пользовательского соглашения</a> и условия <a href='#' className={styles.underline}>политики конфиденциальности</a>
                        </p>
                    </label>
                </div>
                <input disabled={!isAccepted} type="submit" className={styles.create__account__btn + " " + (isAccepted ? styles.active : "")} name="submit" id="submit" value="Создать аккаунт"/>
            </form>
            <p className={styles.create__account}>
                У вас уже есть аккаунт? <a href="#" className={styles.login} onClick={() => navigate("/login")}>Войти</a>
            </p>
        </div>
    );
}

export default Register;
