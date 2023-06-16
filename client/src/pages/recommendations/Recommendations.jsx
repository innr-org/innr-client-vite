import React, {useEffect, useState} from 'react';
import classes from "./Recommendations.module.css";
import RecommendedProducts from "../../components/Products/RecommendedProducts.jsx";
import RecommendedSpecialists from "../../components/Specialists/RecommendedSpecialists.jsx";
import RecommendationButtons from "../../components/RecommendationButtons/RecommendationButtons.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {GridLoader} from "react-spinners";
import cl from "../results/Results.module.css";
import Button from "../../components/UI/button/Button.jsx";
import UserService from "../../API/UserService.js";

function Recommendations() {
    const navigate = useNavigate()
    const params = useParams()
    const [currentScan, setCurrentScan] = useState(null)
    const [readySpecialists, setReadySpecialists] = useState(null)
    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        getScanData().catch(err => console.error(err))
    }, [])

    useEffect(() => {
        console.log(currentScan)
    }, [currentScan])

    useEffect(() => {
        if(currentScan){
            if(currentScan.specialists!==null){
                async function getSpecialists(){
                    try{
                        const specialistPromises = currentScan.specialists.map(async (diseaseId) => {
                            const response = await UserService.getInfoById(userInfo.accessToken, diseaseId, "specialist");
                            return response.data;
                        });
                        const resolvedSpecialists = await Promise.all(specialistPromises);
                        setReadySpecialists(resolvedSpecialists);
                    }
                    catch (err){
                        console.error(err)
                    }
                }

                getSpecialists();
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
    else{
        if(params.id!=="undefined" && readySpecialists){
            return (
                <div className={classes.recommendations}>
                    <div className={classes.container}>
                        <RecommendedProducts />
                        <RecommendedSpecialists specialists={readySpecialists}/>
                    </div>
                    <RecommendationButtons page={"Recommendations"} id={params.id}/>
                    {/*<RecommendationButtons page={"Recommendations"}/>*/}
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

export default Recommendations;
