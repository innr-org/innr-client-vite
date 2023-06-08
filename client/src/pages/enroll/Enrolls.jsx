import React, {useEffect, useState} from 'react';
import cl from './Enroll.module.css'
import personPng from '../../assets/recommendations/personBigger.png'

function Enrolls() {
    const [enrolls, setEnrolls] = useState(JSON.parse(localStorage.getItem("bookingData")))


    useEffect(() => {
        console.log(enrolls)
    }, [enrolls])

    const enrollsItems = enrolls.map(enroll => {
        return <div className={cl.enrolls}>
            <div className={cl.container}>
                <img src={personPng} alt=""/>
                <div>
                    <h1>{enroll.specialist.name}</h1>
                    <h2>{enroll.date}</h2>
                    <h3>+7 777 606 55 76</h3>
                    <p className={cl.time}>{enroll.time}</p>
                    <p><i>{enroll.desc}</i></p>
                </div>
            </div>
        </div>
    })

    return (
        <>
            <h1>Все записи</h1>
            {enrollsItems}
        </>
    );
}

export default Enrolls;
