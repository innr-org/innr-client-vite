import {useEffect, useRef, useState} from "react";
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import axios from "axios";
import Webcam from "react-webcam";
import Modal from "../UI/modal/Modal.jsx";
import cl from './Video.module.css'
import {drawMesh} from "./utilities.js";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {GridLoader} from "react-spinners";
import UserService from "../../API/UserService.js";

function Video({styles, isClicked, setIsClicked, scanType, setIsScanning, onResultsChange}) {
    const { userInfo } = useSelector((state) => state.auth)
    let navigate= useNavigate()
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasWebcamRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [results, setResults] = useState([])
    // pause a webcam
    const [imageSrc, setImageSrc] = useState(null);
    const [webcamClassname, setWebcamClassname] = useState(cl.webcam)
    let intervalRef = useRef(null);
    let interval
    useEffect(() => {
        const runFacemesh = async () => {
            const net = await facemesh.load({
                inputResolution: { width: 640, height: 480 },
                scale: 0.8,
            });

            interval = setInterval(() => {
                detect(net);
            }, 50);

            intervalRef.current = interval;
        };

        const detect = async (net) => {
            if (
                typeof webcamRef.current !== "undefined" &&
                webcamRef.current !== null &&
                webcamRef.current.video.readyState === 4
            ) {
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;
                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                const face = await net.estimateFaces(video);
                const ctx = canvasRef.current.getContext("2d");

                ctx.clearRect(0, 0, videoWidth, videoHeight);
                ctx.drawImage(
                    video,
                    0,
                    0,
                    videoWidth,
                    videoHeight,
                    0,
                    0,
                    videoWidth,
                    videoHeight
                );

                drawMesh(face, ctx, scanType);
            }
        };

        runFacemesh();

        return clearInterval(intervalRef.current);
    }, [scanType]);

    useEffect(() => {
        if(results.length >= 5){
            sendResults(results)
        }
    }, [results])

    async function sendResults(images){
        console.log(images)

        const response = await UserService.scan(userInfo.accessToken, images).catch(err => console.log(err))
        console.log(response.data)
        navigate("/results/" + response.data.scanId)
    }

    //sending results data at render starts
    useEffect(() => {
        onResultsChange([...results]);
    }, [])

    // running detection function
    useEffect(() => {
        if(isClicked){
            handleCapture()
            runFacemeshScan()
            setIsClicked(false)
        }
    }, [isClicked]);

    useEffect(() => {
        if(!isLoading){
            setIsScanning(false)
            setWebcamClassname(cl.webcam)
        }
        else{
            setWebcamClassname(cl.webcam + " " + cl.activeWebcam)
        }
    }, [isLoading])
    //get scrennshot
    function handleCapture(){
        if (webcamRef.current) {
            // Capture an image
            const dataUrl = webcamRef.current.getScreenshot();
            setImageSrc(dataUrl);
        }
    };

    // load facemesh
    async function runFacemeshScan() {
        try{
            setIsLoading(true)
            const net = await facemesh.load();
            // setInterval(() => detect(net), 100)
            detectScan(net)

        }catch (err){
            console.error(err)
        }
        finally{
            setIsLoading(false)
        }
    }

    // detect function
    async function detectScan(net) {
        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // get video properties
            const video = webcamRef.current.video;

            // make detections
            const prediction = await net.estimateFaces(video);

            //drawing image
            const ctx = canvasWebcamRef.current.getContext("2d")

            // ctx.drawImage(webcamRef.current.video, 0, 0, videoWidth, videoHeight)
            console.log(scanType)

            // set canvas width and height
            canvasWebcamRef.current.width = prediction[0].boundingBox.bottomRight[0] - prediction[0].boundingBox.topLeft[0];
            canvasWebcamRef.current.height = prediction[0].boundingBox.bottomRight[1] - prediction[0].boundingBox.topLeft[1];

            //To-Do: Optimize the code
            //cropping screenshot
            //drawing canvas
            ctx.drawImage(webcamRef.current.video,
                prediction[0].boundingBox.topLeft[0], prediction[0].boundingBox.topLeft[1],
                prediction[0].boundingBox.bottomRight[0] - prediction[0].boundingBox.topLeft[0],
                prediction[0].boundingBox.bottomRight[1] - prediction[0].boundingBox.topLeft[1],
                0, 0,
                prediction[0].boundingBox.bottomRight[0] - prediction[0].boundingBox.topLeft[0],
                prediction[0].boundingBox.bottomRight[1] - prediction[0].boundingBox.topLeft[1],)



            //DEV: drawing bounding box (real-time)
            // prediction.forEach(pred => {
            //     ctx.beginPath()
            //     ctx.lineWidth = "4"
            //     ctx.strokeStyle = "blue"
            //     ctx.rect(
            //         pred.boundingBox.topLeft[0], pred.boundingBox.topLeft[1],
            //         pred.boundingBox.bottomRight[0] - pred.boundingBox.topLeft[0],
            //         pred.boundingBox.bottomRight[1] - pred.boundingBox.topLeft[1]
            //     )
            //     ctx.stroke()
            // })
            console.log(prediction);
            setIsReady(true)
        }
    }

    //saving result in array of base64 images
    function saveResult(image){
        image = image.slice(22)

        if(results.length >= 5){
            console.log("LIMIT!!!")
            setIsReady(false)
            return
        }
        console.log(image)
        setResults([...results, [image]])
        setIsReady(false)

        onResultsChange([...results, [image]]);
    }

    return (
        <> {imageSrc &&
            <div>
                {isLoading && <h2 className={cl.scanningText}>Пожалуйста не двигайтесь...</h2>}
            </div>
        }
            <div style={styles} className={cl.wrapper}>
                <Webcam ref={webcamRef} className={cl.webcam}
                        imageSmoothing={true}/>
                <canvas ref={canvasRef} className={cl.canvas}  />
                <div>
                    {isLoading ? <div className={cl.ovalBorderActive}></div> : <div className={cl.ovalBorder}></div>}
                </div>
            </div>
            <Modal visible={results.length>=5}>
                <div>Загрузка... Подготавливаем результат...</div>
            </Modal>
            <Modal visible={isReady} setVisible={setIsReady}>
                <div className={cl.canvasWrapper}>
                    <canvas ref={canvasWebcamRef} className={cl.canvasScan}/>
                    <h2>Ваше фото готово!</h2>
                    <h3>Осталось еще {5-results.length-1} фото</h3>
                    <p>Проверьте пожалуйста целостность картинки!</p>
                    <div className={cl.resultButtons}>
                        <button className={cl.rejectBtn} onClick={() => setIsReady(false)}>Переснять</button>
                        <button className={cl.confirmBtn} onClick={() => saveResult(canvasWebcamRef.current.toDataURL("image/jpg"))}>Подтвердить</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Video;
