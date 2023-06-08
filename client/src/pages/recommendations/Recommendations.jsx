import React, {useEffect, useState} from 'react';
import classes from "./Recommendations.module.css";
import RecommendedProducts from "../../components/Products/RecommendedProducts.jsx";
import RecommendedSpecialists from "../../components/Specialists/RecommendedSpecialists.jsx";
import RecommendationButtons from "../../components/RecommendationButtons/RecommendationButtons.jsx";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {GridLoader} from "react-spinners";
import cl from "../results/Results.module.css";
import Button from "../../components/UI/button/Button.jsx";

function Recommendations() {
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
    else{
        if(params.id!=="undefined"){
            return (
                <div className={classes.recommendations}>
                    <div className={classes.container}>
                        <RecommendedProducts />
                        <RecommendedSpecialists specialists={currentScan.specialists}/>
                    </div>
                    <RecommendationButtons page={"Recommendations"} id={params.id}/>
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
