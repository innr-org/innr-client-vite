import React from 'react'
import Img from '../UI/img/Img';
import classes from './RecommendedSpecialistPerson.module.css'

interface RecommendedSpecialistPerson
{
    src: string;
    name: string;
    city: string;
    specialty: string;
    experience: string;
    props?: any;
}

function RecommendedSpecialistPerson({src, name, city, specialty, experience, ...props}:RecommendedSpecialistPerson) {
    return (
        <div className={classes.person}>
            <Img size={71} borderRadius={0}>{src}</Img>
            <div className={classes.personInfo}>
                <div className={classes.wrapper}>
                    <p className={classes.name}>{name}</p>
                    <p className={classes.city}>{city}</p>
                </div>
                <p className={classes.specialty}>{specialty}</p>
                <p className={classes.experience}>Опыт работы: {experience}</p>
                <div className={classes.progressBar}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
}

export default RecommendedSpecialistPerson;