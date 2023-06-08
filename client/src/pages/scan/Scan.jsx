import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import Button from "../../components/UI/button/Button.jsx";
import cl from './Scan.module.css'

import waveGrey from '../../assets/wavesSvgs/waveGray.svg'
import waveGreen from '../../assets/wavesSvgs/waveGreen.svg'
import waveYellow from '../../assets/wavesSvgs/waveYellow.svg'
import borderSvg from '../../assets/scanImgs/border.svg'
import personPng from '../../assets/scanImgs/person.png'

function Scan() {
    const navigate = useNavigate()

    const [hovered, setHovered] = useState(false)

    function activateAnimation(){
        setHovered(true)
    }
    function disableAnimation(){
        setHovered(false)
    }

    return (
        <div>
            <section className={cl.scanning}>
                <div className={cl.container}>
                    <div className={cl.imgWrapper}>
                        <div className={cl.waves}>
                            <img className={hovered ? [cl.wave, cl.waveActive].join(' ') : cl.wave} src={waveGrey} alt="wave-svg-gray"/>
                            <img className={hovered ? [cl.wave, cl.waveActive].join(' ') : cl.wave} src={waveGreen} alt="wave-svg-green"/>
                            <img className={hovered ? [cl.wave, cl.waveActive].join(' ') : cl.wave} src={waveYellow} alt="wave-svg-yellow"/>
                        </div>
                        <img className={cl.border} src={borderSvg} alt="scan-example" />
                        <img className={cl.person} src={personPng} alt=""/>
                        <h3 className={cl.warningText}>Пожалуйста, снимите все аксессуары и головные уборы. А также очистите макияж с лица.</h3>
                    </div>

                    <Button onClick={() => navigate("/scanning")} style={{padding: '19px 137px'}} onMouseEnter={activateAnimation} onMouseLeave={disableAnimation}>Начать</Button>
                </div>
            </section>
        </div>
    );
}

export default Scan;
