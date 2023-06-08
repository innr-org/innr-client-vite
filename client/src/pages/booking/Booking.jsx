import React, {useEffect, useRef, useState} from 'react';
import cl from './Booking.module.css'
import Calendar from "react-calendar";
import TimeSlot from "../../components/TimeSlot/TimeSlot.jsx";
import Button from "../../components/UI/button/Button.jsx";
import {useNavigate, useParams} from "react-router-dom";

function Booking() {
    const params = useParams()
    const navigate = useNavigate()
    const options ={ month: 'long', day: 'numeric', year: 'numeric' };
    const [appointment, setAppointment] = useState(new Date());
    const [timeslots, setTimeslots] = useState(["10:00", "11:00", "15:00"])
    const [selectedSlot, setSelectedSlot] = useState("")
    const [selected, setSelected] = useState(false)
    const descRef = useRef(null)

    function enroll() {
        console.log(appointment.toLocaleDateString("RU", options))
        console.log(selectedSlot)
        console.log(descRef.current.value)

        const prevBookings = JSON.parse(localStorage.getItem("bookingData"));
        console.log(prevBookings)
        prevBookings.push({
            date: appointment.toLocaleDateString("RU", options),
            time: selectedSlot,
            desc: descRef.current.value,
            specialist: JSON.parse(localStorage.getItem("specialist"))
        })
        localStorage.setItem("bookingData", JSON.stringify(prevBookings))

        navigate("/enrolls")
    }

    function selectTheSlot(slot){
            setSelectedSlot(slot)
            setSelected(true)
    }

    function unselectTheSlot(slot){
            setSelectedSlot("")
            setSelected(false)
    }

    return (
        <div className={cl.booking}>
            <div className={cl.container}>
                <h2>Выберите дату</h2>
                <Calendar className={cl.calendar} onChange={setAppointment} value={appointment}/>
                <h2>Выберите время</h2>
                <div className={cl.timeslots}>
                    {timeslots.map((timeslot) => (
                        <TimeSlot style={selectedSlot === timeslot ? { backgroundColor: '#C8FA60' } : null}
                                  onClick={() => selectTheSlot(timeslot)}
                        >
                            {timeslot}
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
