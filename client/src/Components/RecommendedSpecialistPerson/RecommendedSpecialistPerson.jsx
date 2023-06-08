import React, {useEffect} from 'react'
import classes from './RecommendedSpecialistPerson.module.css'
import Img from "../UI/img/Img.jsx";
import Rating from "react-rating";
import {useNavigate} from "react-router-dom";

function RecommendedSpecialistPerson({src, name, city, specialty, experience, tags, rating, visits, specialist,  ...props}) {
    const navigate = useNavigate()

    let tagsSpans
        if(tags.length<2){
            tagsSpans = <span>{tags}</span>
        }
        else{
            tagsSpans = tags.map(tag => {
                return <span>{tag}</span>
            })
        }

        function seeMore(){
            const specialistJSON = JSON.stringify(specialist)
            localStorage.setItem("specialist", specialistJSON);
            navigate("/specialists/" + specialist.id)
        }
    return (
        <div className={classes.person} onClick={seeMore}>
            <Img size={71} borderRadius={0}>{src}</Img>
            <div className={classes.personInfo}>
                <div className={classes.wrapper}>
                    <p className={classes.name}>{name}</p>
                    <p className={classes.city}>{city}</p>
                </div>
                <p className={classes.specialty}>{specialty}</p>
                <p className={classes.experience}>Опыт работы: {experience} <span>Посещения: {visits}</span></p>
                <Rating
                    emptySymbol="fa fa-star-o fa-2x"
                    fullSymbol="fa fa-star fa-2x"
                    fractions={2}
                    initialRating={rating}
                    readonly={true}
                    className={classes.rating}
                />
                <div className={classes.progressBar}>
                    {tagsSpans}
                </div>
            </div>
        </div>
    );
}

export default RecommendedSpecialistPerson;
