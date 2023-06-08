import React, {useEffect, useState} from 'react';
import cl from './Specialist.module.css'
import personPng from '../../assets/recommendations/personBigger.png'
import Button from "../../components/UI/button/Button.jsx";
import classes from "../../components/RecommendedSpecialistPerson/RecommendedSpecialistPerson.module.css";
import Rating from "react-rating";
import {useNavigate} from "react-router-dom";

function Specialist() {
    const navigate = useNavigate()
    const [specialist, setSpecialist] = useState({})
    const [tags, setTags] = useState([])


    useEffect(() => {
        if(localStorage.getItem("specialist")){
            setSpecialist(JSON.parse(localStorage.getItem("specialist")))
        }
        else{
            setSpecialist({error: "Specialist not found"})
        }
    }, [])

    useEffect(() => {
        if(Object.keys(specialist).length!==0){
            setTags(specialist.tags)
        }
    }, [specialist])

    const tagsItems = tags.map(tag => {
        return <span className={cl.tag}>{tag}</span>
    })

    return (
        <div className={cl.specialist}>
            <div className={cl.container}>
                <header className={cl.header}>
                    <div className={cl.headerContainer}>
                        <img src={personPng} alt=""/>
                        <Rating
                            emptySymbol="fa fa-star-o fa-2x"
                            fullSymbol="fa fa-star fa-2x"
                            fractions={2}
                            initialRating={specialist.rating}
                            readonly={true}
                            className={classes.rating}
                        />
                    </div>
                    <hgroup>
                        <h1>{specialist.name}</h1>
                        <h2>Врач дерматолог</h2>
                        <Button className={cl.price}><b>5000</b>тг за час</Button>

                    </hgroup>
                </header>

                <section className={cl.info}>
                    <div className={cl.infoItem}><h2>Город:</h2><p>Астана</p></div>
                    <div className={cl.infoItem}><h2>Образование:</h2><p>Медицинский университет Астана</p></div>
                    <div className={cl.infoItem}><h2>Опыт работы:</h2><p>7 лет</p></div>
                    <div className={cl.infoItem}><h2>Посещения</h2><p>{specialist.visited} человек</p></div>
                    <div className={cl.infoItem}><h2>Сертификаты:</h2><p>Международный кожный институт (IDI) <br/>Американская Академия Дерматологии (ADA)</p></div>
                </section>
                <section>
                    <h2>Теги</h2>
                    <div className={cl.tags}>
                        {tagsItems}
                    </div>
                </section>
                <Button className={cl.enroll} onClick={() => navigate("/booking/" + specialist.id)}>Записаться на консультацию</Button>
            </div>
        </div>
    );
}

export default Specialist;
