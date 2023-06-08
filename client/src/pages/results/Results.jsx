import {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import cl from './Results.module.css'
import RecommendationButtons from "../../components/RecommendationButtons/RecommendationButtons.jsx";
import {GridLoader} from "react-spinners";
import {useNavigate, useParams} from "react-router-dom";
import Button from "../../components/UI/button/Button.jsx";

function Results() {
    const navigate = useNavigate()
    const params = useParams()
    const [currentScan, setCurrentScan] = useState(null)
    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        getScanData().catch(err => console.error(err))
    }, [])
    useEffect(() => {
        console.log(currentScan)
    }, [currentScan])

    async function getScanData(){
        const id = params.id

        const response = await fetch(`http://localhost:8080/api/scan/${id}`, {
            method: "GET",
            headers: {
                'Authorization': "Bearer" + " " +  userInfo.token.accessToken,
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
                "Access-Control-Allow-Headers": "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
                'Access-Control-Allow-Credentials': "true",
                "Content-Type": "application/json"
            },
        }).catch(err => console.error(err))
        console.log(response)
        const data = await response.json()
        setCurrentScan(data)
    }

    if(!currentScan){
        return (
            <div>
                <div className="overlay"></div>
                <GridLoader
                    color="green"
                    cssOverride={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                    }}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        )

    }
    else {
        if(params.id!=="undefined"){
            const isAcne = Number(currentScan?.acne.substring(0, 2))>50
            return (
                <div className={cl.results}>
                    <div className={cl.container}>
                        {currentScan === {}
                            ? <img className={cl.mainImage} src={girl} alt={"Scanned face"}/>
                            : <img width={216} height={239} className={cl.mainImage + " " + "animate__animated animate__fadeIn"}
                                   src={"data:image/jpeg;base64," + currentScan.image} alt={"Scanned face result"}/>
                        }
                        {!isAcne ? <div className={cl.descOk}>
                            <h2 className="animate__animated animate__fadeInLeft">Показатель обнаружения акне: <span className="animate__animated animate__fadeIn animate__delay-1s">{Number(currentScan?.acne.substring(0, 2))}%</span></h2>
                            <p>Вероятность того, что у вас акне довольно мала!
                            </p>
                            <p>Тем не менее, если вы чувствуете что у вас проблемы с кожей лица обратитесь к специалисту.</p>
                        </div> : (
                            <div>
                                <div className={cl.desc}>
                                    <h1>Описание</h1>
                                    <h2>Акне <span className={cl.accuracy}>{currentScan.acne?.substring(0, 2)}%</span></h2>
                                    <p>
                                        {currentScan.diseases && currentScan.diseases[0].description}
                                    </p>
                                </div>
                                <div className={cl.causes}>
                                    <h2>Причины</h2>
                                    <ul>
                                        {/*{currentScan.diseases && currentScan.diseases[0].reasons}*/}
                                        <li>Генетика. Предрасположенность к угревой болезни, можно унаследовать от близких и не очень близких родственников. Именно поэтому некоторые люди не следят за кожей, а угри их не атакуют.</li>
                                        <li>Неполадки в эндокринной системе. Железы вырабатывают больше сала, усиливается ороговение кожи, а это, в свою очередь, способствует закупориванию пор и появлению угрей.</li>
                                        <li>Инфекция. Propionibacterium acnes (P. acnes) обитает на поверхности кожи в норме. Именно она способствует воспалению закупоренных сальных желез.</li>
                                    </ul>
                                </div>
                                <div className={cl.procedures}>
                                    <h2>Рекомендуемые процедуры</h2>
                                    <ul>
                                        <li>Мезотерапия</li>
                                        <li>Пиллинги</li>
                                        <li>Микродермабразия</li>
                                        <li>Фотолечение</li>
                                        <li>Чистка лица</li>
                                        {/*<li>{currentScan.products && currentScan.products[0].name}*/}
                                        {/*    <div>{currentScan.products && currentScan.products[0].description}</div>*/}
                                        {/*</li>*/}
                                    </ul>
                                </div>
                                <div className={cl.warning}>
                                    <h2>ВАЖНО!</h2>
                                    <p>Все эти процедуры строго согласовать с вашим лечащим специалистом!</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <RecommendationButtons  page={"Results"} id={params.id}/>
                </div>
            );
        }
        else{
            return <div className={cl.error}>
                <h1>Ошибка сканирования. Попробуйте еще раз</h1>
                <Button onClick={() => navigate("/scanning")}>Назад</Button>
            </div>
        }

    }
}

export default Results;
