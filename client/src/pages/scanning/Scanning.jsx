import React, {useEffect, useMemo, useRef, useState} from 'react';
import Button from "../../components/UI/button/Button.jsx";
import cl from './Scanning.module.css'
import Modal from "../../components/UI/modal/Modal.jsx";
import Video from "../../components/Video/Video.jsx";
import cameraPng from '../../assets/scanIcons/camera.png'

function Scanning(props) {
    const [isClicked, setIsClicked] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [results, setResults] = useState([])
    const poseImgRef = useRef(null)
    const requirements = ["whole", "leftСheek", "rightСheek", "forehead", "chin"]
    const [scanType, setScanType] = useState("")


    useEffect(() => {
        console.log(results)
        setScanType(requirements[results.length])
    }, [results])

    const handleScroll = () => {
        poseImgRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    function handleResultsChange(updatedResults) {
        // Do something with the updated results
        setResults(updatedResults)
    }

    function activateScanning(){
        setIsClicked(true)
        setIsScanning(true)
    }


    return (
        <>
            <div className={cl.scanning}>
                <div className={cl.container}>
                    <div onClick={handleScroll} className={cl.scroll}></div>
                    <div className={cl.video}>
                        <div className={cl.webcam}>
                            <Video onResultsChange={handleResultsChange} isClicked={isClicked} setIsClicked={setIsClicked} setIsScanning={setIsScanning} scanType={scanType}/>
                        </div>
                    </div>
                </div>
                <div className={cl.content}>
                    <div className={cl.contentContainer}>
                        <h3>Пожалуйста поместите отмеченную зону в круг!</h3>
                        <img ref={poseImgRef} src={requirements[results.length]} alt=""/>
                    </div>
                </div>
                <div className={cl.scanningShot}>
                    <div onClick={activateScanning} className={cl.scanningCameraShot}>
                        <img src={cameraPng} alt=""/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Scanning;
