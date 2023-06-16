import {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import cl from './Results.module.css'
import RecommendationButtons from "../../components/RecommendationButtons/RecommendationButtons.jsx";
import {GridLoader} from "react-spinners";
import {useNavigate, useParams} from "react-router-dom";
import Button from "../../components/UI/button/Button.jsx";
import UserService from "../../API/UserService.js";

function Results() {
    const navigate = useNavigate()
    const params = useParams()
    const [currentScan, setCurrentScan] = useState(null)
    const [readyDiseases, setReadyDiseases] = useState(null)
    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        getScanData().catch(err => console.error(err))
    }, [])

    useEffect(() => {
        console.log(currentScan)
    }, [currentScan])

    useEffect(() => {
        if(currentScan){
            if(currentScan.diseases!==null){
                async function getDiseases(){
                    try{
                        const diseasePromises = currentScan.diseases.map(async (diseaseId) => {
                            const response = await UserService.getInfoById(userInfo.accessToken, diseaseId, "disease");
                            return response.data;
                        });
                        const resolvedDiseases = await Promise.all(diseasePromises);
                        setReadyDiseases(resolvedDiseases);
                    }
                    catch (err){
                        console.error(err)
                    }
                }

                getDiseases();
            }
        }
    }, [currentScan])

    async function getScanData(){
        const id = params.id

        const response = await UserService.getInfoById(userInfo.accessToken, id, "scan")
        console.log(response)
        const data = await response.data
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
        if(params.id!=="undefined" && readyDiseases){
            // const data = JSON.parse(localStorage.getItem("result"))
            const acne = Math.round(currentScan.percent*100)
            const isAcne = acne<50

            const causes = readyDiseases[0].causes.map(cause => {
                return <li>{cause}</li>
            })
            const procedures = readyDiseases[0].procedures.map(procedure => {
                return <li>{procedure}</li>
            })
            return (
                <div className={cl.results}>
                    <div className={cl.container}>
                        {currentScan === {}
                            ? <img className={cl.mainImage} src={girl} alt={"Scanned face"}/>
                            :
                             <img width={216} height={239} className={cl.mainImage + " " + "animate__animated animate__fadeIn"}
                                   src={"data:image/jpeg;base64," + currentScan.image} alt={"Scanned face result"}/>
                        }
                        {!isAcne ? <div className={cl.descOk}>
                            <h2 className="animate__animated animate__fadeInLeft">Показатель обнаружения акне: <span className="animate__animated animate__fadeIn animate__delay-1s">{Number(acne)}%</span></h2>
                            <p>Вероятность того, что у вас акне довольно мала!
                            </p>
                            <p>Тем не менее, если вы чувствуете что у вас проблемы с кожей лица обратитесь к специалисту.</p>
                        </div> : (
                            <div>
                                <div className={cl.desc}>
                                    <h1>Описание</h1>
                                    <h2>{readyDiseases[0].name} <span className={cl.accuracy}>{acne}%</span></h2>
                                    <p>
                                        {readyDiseases[0].description}
                                    </p>
                                </div>
                                <div className={cl.causes}>
                                    <h2>Причины</h2>
                                    <ul>
                                        {causes}
                                    </ul>
                                </div>
                                <div className={cl.procedures}>
                                    <h2>Рекомендуемые процедуры</h2>
                                    <ul>
                                        {procedures}
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
