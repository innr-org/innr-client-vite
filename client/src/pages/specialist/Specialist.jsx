import React, {useEffect, useState} from 'react';
import cl from './Specialist.module.css'
import personPng from '../../assets/recommendations/personBigger.png'
import Button from "../../components/UI/button/Button.jsx";
import classes from "../../components/RecommendedSpecialistPerson/RecommendedSpecialistPerson.module.css";
import Rating from "react-rating";
import {useNavigate, useParams} from "react-router-dom";
import UserService from "../../API/UserService.js";
import {useSelector} from "react-redux";

function Specialist() {
    const id = useParams().id
    const navigate = useNavigate()
    const [specialist, setSpecialist] = useState({})
    const [tags, setTags] = useState([])
    const { userInfo } = useSelector((state) => state.auth)


    useEffect(() => {
        if(id){
            async function getSpecialists(){
                try{

                    const response = await UserService.getInfoById(userInfo.accessToken, id, "specialist");
                    setSpecialist(response.data);
                }
                catch (err){
                    console.error(err)
                }
            }

            getSpecialists();
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
                        <img src={specialist.image} alt=""/>
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
                        <h1>{specialist.fullName}</h1>
                        <h2>{specialist.speciality}</h2>
                        <Button className={cl.price}><b>{specialist.price}</b>тг за час</Button>

                    </hgroup>
                </header>

                <section className={cl.info}>
                    <div className={cl.infoItem}><h2>Город:</h2><p>{specialist.city}</p></div>
                    <div className={cl.infoItem}><h2>Образование:</h2><p>Медицинский университет Астана</p></div>
                    <div className={cl.infoItem}><h2>Опыт работы:</h2><p>{specialist.experience} лет</p></div>
                    <div className={cl.infoItem}><h2>Посещения</h2><p>{specialist.enrolls && specialist.enrolls.length} человек</p></div>
                    <div className={cl.infoItem}><h2>Сертификаты:</h2><p>Международный кожный институт (IDI) <br/>Американская Академия Дерматологии (ADA)</p></div>
                </section>
                <section>
                    <h2>Теги</h2>
                    <div className={cl.tags}>
                        {tagsItems}
                    </div>
                </section>
                <Button className={cl.enroll} onClick={() => navigate("/booking/" + specialist._id)}>Записаться на консультацию</Button>
            </div>
        </div>
    );
}

export default Specialist;
