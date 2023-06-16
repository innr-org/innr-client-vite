import React, {useEffect, useRef, useState} from 'react';
import cl from './Booking.module.css'
import Calendar from "react-calendar";
import TimeSlot from "../../components/TimeSlot/TimeSlot.jsx";
import Button from "../../components/UI/button/Button.jsx";
import {useNavigate, useParams} from "react-router-dom";
import UserService from "../../API/UserService.js";
import {useSelector} from "react-redux";

function Booking() {
    const params = useParams()
    const navigate = useNavigate()
    const { userInfo } = useSelector((state) => state.auth)
    const [date, setDate] = useState(new Date());
    const [timeslots, setTimeslots] = useState([{startTime: "15:00:00", endTime: "17:00:00"}])
    const [selectedSlot, setSelectedSlot] = useState({})
    const descRef = useRef(null)

    async function enroll() {
        console.log(date.toLocaleDateString("RU"))
        console.log(selectedSlot)
        console.log(descRef.current.value)

        const body = {
            startDate: date.toLocaleDateString("RU") + ", " + selectedSlot.startTime,
            endDate: date.toLocaleDateString("RU") + ", " + selectedSlot.endTime,
            userId: userInfo.id,
            specialistId: params.id,
            type: "Онлайн",
            comments: descRef.current.value
        }
        const response = await UserService.addEnroll(userInfo.accessToken, body)
        console.log(response.data)
        if(response.status===201){
            navigate("/enrolls")
        }
        else{
            window.location.reload(false);
        }
    }

    function selectTheSlot(slot){
            setSelectedSlot(slot)
    }

    return (
        <div className={cl.booking}>
            <div className={cl.container}>
                <h2>Выберите дату</h2>
                <Calendar className={cl.calendar} onChange={setDate} value={date}/>
                <h2>Выберите время</h2>
                <div className={cl.timeslots}>
                    {timeslots.map((timeslot) => (
                        <TimeSlot style={selectedSlot === timeslot ? { backgroundColor: '#C8FA60' } : null}
                                  onClick={() => selectTheSlot(timeslot)}
                        >
                            {timeslot.startTime.substring(0, 5) + "-" + timeslot.endTime.substring(0, 5)}
                        </TimeSlot>
                    ))}
                </div>
                <h2>Дополнительно</h2>
                <textarea className={cl.description} placeholder="Описание" ref={descRef}></textarea>
                <Button className={cl.submit} onClick={enroll}>Записаться</Button>
            </div>
        </div>
    );
}

export default Booking;
