import React, {useEffect, useMemo, useState} from 'react';
import Button from "../../components/UI/button/Button.jsx";
import cl from './Scanning.module.css'
import Modal from "../../components/UI/modal/Modal.jsx";
import Video from "../../components/Video/Video.jsx";
import camera from '../../assets/scanIcons/camera.png'

function Scanning(props) {
    const [isClicked, setIsClicked] = useState(false)
    const [typeModalActive, setTypeModalActive] = useState(true)
    const [alertModalActive, setAlertModalActive] = useState(false)
    const [selectedType, setSelectedType] = useState({value: '', text: ''})

    useEffect(() => {
        if(selectedType.text !== '' && selectedType.value !== ''){
            setTypeModalActive(false)
            setAlertModalActive(true)
        }
    }, [selectedType])


    const analysisTypes = [
        {value: 'whole', text: 'Все лицо'},
        {value: 'nose', text: 'Нос'},
        {value: 'forehead', text: 'Лоб'},
        {value: 'leftСheek', text: 'Левая щека'},
        {value: 'rightСheek', text: 'Правая щека'},
        {value: 'chin', text: 'Подбородок'},
    ]
    const analysisTypesBtns = analysisTypes.map(type => {
        return (
            <Button style={{padding: '15px 25px'}}
                    onClick={() => setSelectedType({value: type.value, text: type.text})}>
                {type.text}
            </Button>
        )
    })

    return (
        <>
            <Modal style={{textAlign: 'center'}} visible={alertModalActive} setVisible={setAlertModalActive}>
                <h2>Внимание!</h2>
                <br/>
                <h2>Пожалуйста снимите все аксессуары и одежду с головы!</h2>
                <br/>
                <h2>Важно: "{selectedType.text}" должен/должна находится внутри отмеченной зоны (овала)</h2>
                <Button style={{padding: '10px 50px', color: 'darkred', marginTop: '40px'}}
                        onClick={() => setAlertModalActive(false)}
                >
                    Закрыть X
                </Button>
            </Modal>
            <section className={cl.scanning}>
                <div className={cl.container}>
                    <Video isClicked={isClicked} setIsClicked={setIsClicked} scanType={selectedType.value}/>
                </div>
                <div className={cl.scanningShot}>
                    <div className={cl.scanningAction}></div>
                    <div onClick={() => setIsClicked(true)} className={cl.scanningCameraShot}>
                        <img src={camera} alt="camera" />
                    </div>
                    <div className={cl.scanningAction}></div>
                </div>
            </section>
        </>

    );
}

export default Scanning;
