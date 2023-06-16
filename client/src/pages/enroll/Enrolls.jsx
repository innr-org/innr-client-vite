import React, {useEffect, useState} from 'react';
import cl from './Enroll.module.css'
import personPng from '../../assets/recommendations/personBigger.png'
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import UserService from "../../API/UserService.js";
import {BeatLoader} from "react-spinners";

function Enrolls() {
    const navigate = useNavigate()
    const { userInfo } = useSelector((state) => state.auth)
    const [enrolls, setEnrolls] = useState([])

    useEffect(() => {
        if(userInfo){
            async function getUserEnrolls(){
                for (const enrollId of userInfo.enrolls) {
                    const response = await UserService.getInfoById(userInfo.accessToken, enrollId, "enroll")
                    const specialistRes = await UserService.getInfoById(userInfo.accessToken, response.data.specialistId, "specialist")

                    setEnrolls(prevEnrolls => [...prevEnrolls, {
                        ...response.data,
                        specialistInfo: specialistRes.data
                    }])
                }
            }

            getUserEnrolls()
        }

    }, [userInfo])


    const enrollsItems = enrolls.map(enroll => {
        return <div className={cl.enrolls} onClick={() => navigate("/lobby")}>
            <div className={cl.container}>
                <img src={enroll.specialistInfo.image} alt=""/>
                <div>
                    <h1>{enroll.specialistInfo.fullName}</h1>
                    <h2>{enroll.startDate.substring(0, 10)}</h2>
                    <h3>{enroll.specialistInfo.phone}</h3>
                    <p className={cl.time}>{enroll.startDate.substring(12, 17)}</p>
                    <p><i>{enroll.comments.substring(0, 15)}...</i></p>
                </div>
            </div>
        </div>
    })

    return (
        <div className={cl.enrollsWrapper}>
            <h1>Все записи</h1>
            {enrollsItems.length==0 ?
                <div className={cl.container}>
                    <BeatLoader
                    color="green"
                    cssOverride={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 9999,
                        marginTop: '50%',
                        marginLeft: '50%'
                    }}
                    size={10}
                    margin={2}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    />
                </div>
                    :
                    enrollsItems}
        </div>
    );
}

export default Enrolls;
