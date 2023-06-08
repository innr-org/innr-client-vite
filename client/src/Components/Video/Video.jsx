import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import cl from './Video.module.css';
import Modal from "../../components/UI/modal/Modal.jsx";
import Button from "../../components/UI/button/Button.jsx";
import {useNavigate} from "react-router-dom";
import {drawMesh} from "./utilities.js";

function Video({styles, isClicked, setIsClicked, scanType}) {
    const { userInfo } = useSelector((state) => state.auth)
    //router init
    let navigate= useNavigate()

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const canvasScanRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isReady, setIsReady] = useState(false)

    // running detection function
    // useEffect(() => {
    //     if(scanType){
    //         runFacemesh()
    //     }
    // }, [scanType]);

    useEffect(() => {
        if(isClicked){
            runFacemeshScan()
        }
    }, [isClicked])

    // load facemesh
    useEffect(() => {
        const runFacemesh = async () => {
            const net = await facemesh.load({
                inputResolution: { width: 640, height: 480 },
                scale: 0.8,
            });

            setInterval(() => {
                detect(net);
            }, 50);
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
    }, [scanType]);


    async function runFacemeshScan(){
        try{
            setIsLoading(true)
            const net = await facemesh.load();
            detectScan(net).catch(err => console.error("Landmark Detection Error: " + err))

        }catch (err){
            console.error(err)
        }
        finally{
            setIsLoading(false)
            setIsReady(true)
        }
    }

    async function detectScan(net) {
        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // get video properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // set video width and height
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // make detections
            const prediction = await net.estimateFaces(video);

            //drawing image
            const ctx = canvasScanRef.current.getContext("2d")

            // ctx.drawImage(webcamRef.current.video, 0, 0, videoWidth, videoHeight)

            //To-Do: Optimize the code
            // cropping screenshot
            let meshSettings = {
                x0: 143,
                y0: 10,
                dxInit: 372,
                dyInit: 143,
            }

            switch (scanType) {
                case 'whole':
                    meshSettings = {
                        x0: 234,
                        y0: 10,
                        dxInit: 454,
                        dyInit: 152,
                    }
                    break
                case 'nose':
                    meshSettings = {
                        x0: 145,
                        y0: 8,
                        dxInit: 374,
                        dyInit: 94,
                    }
                    break
                case 'forehead':
                    meshSettings = {
                        x0: 103,
                        y0: 10,
                        dxInit: 332,
                        dyInit: 9,
                    }
                    break
                case 'leftСheek':
                    meshSettings = {
                        x0: 429,
                        y0: 25,
                        dxInit: 454,
                        dyInit: 152,
                    }
                    break
                case 'rightСheek':
                    meshSettings = {
                        x0: 234,
                        y0: 25,
                        dxInit: 209,
                        dyInit: 152,
                    }
                    break
                case 'chin':
                    meshSettings = {
                        x0: 138,
                        y0: 18,
                        dxInit: 367,
                        dyInit: 152,
                    }
                    break
            }

            let meshX0 = prediction[0].scaledMesh[meshSettings.x0][0]
            let meshY0 =prediction[0].scaledMesh[meshSettings.y0][1]
            let meshDx = prediction[0].scaledMesh[meshSettings.dxInit][0] - prediction[0].scaledMesh[meshSettings.x0][0]
            let meshDy = prediction[0].scaledMesh[meshSettings.dyInit][1] - prediction[0].scaledMesh[meshSettings.y0][1]

            if(scanType==="forehead"){
                meshY0 = meshY0/1.5
                meshDy = prediction[0].scaledMesh[meshSettings.dyInit][1]*1.2 - prediction[0].scaledMesh[meshSettings.y0][1]
            }
            else if(scanType==="chin"){
                meshDy = prediction[0].scaledMesh[meshSettings.dyInit][1]*1.5 - prediction[0].scaledMesh[meshSettings.y0][1]
            }

            canvasScanRef.current.width = meshDx
            canvasScanRef.current.height = meshDy

            //drawing canvas
                ctx.drawImage(webcamRef.current.video,
                    meshX0, meshY0,
                    meshDx,
                    meshDy,
                    0, 0,
                    meshDx,
                    meshDy)


            // ctx.drawImage(webcamRef.current.video,
            //      prediction[0].boundingBox.topLeft[0], prediction[0].boundingBox.topLeft[1],
            //      prediction[0].boundingBox.bottomRight[0]- prediction[0].boundingBox.topLeft[0],
            //      prediction[0].boundingBox.bottomRight[1]- prediction[0].boundingBox.topLeft[1],
            //     0, 0,
            //     prediction[0].boundingBox.bottomRight[0]- prediction[0].boundingBox.topLeft[0],
            //     prediction[0].boundingBox.bottomRight[1]- prediction[0].boundingBox.topLeft[1],
            // )

            //DEV: drawing bounding box (real-time)
            // prediction.forEach(pred => {
            //     ctx.beginPath()
            //     ctx.lineWidth = "4"
            //     ctx.strokeStyle = "blue"
            //     ctx.rect(
            //         pred.scaledMesh[234][0], pred.scaledMesh[149][1],
            //         pred.scaledMesh[234][0] - pred.scaledMesh[4][0],
            //         pred.scaledMesh[149][1] - pred.scaledMesh[144][1]
            //     )
            //     ctx.stroke()
            // })
            console.log(prediction);
            return prediction
        }
    }

    // /*INFINITE FUNCTION*/
    // const detect = async (net) => {
    //     if (
    //         typeof webcamRef.current !== "undefined" &&
    //         webcamRef.current !== null &&
    //         webcamRef.current.video.readyState === 4
    //     ) {
    //         // Get Video Properties
    //         const video = webcamRef.current.video;
    //         const videoWidth = webcamRef.current.video.videoWidth;
    //         const videoHeight = webcamRef.current.video.videoHeight;
    //
    //         // Set video width
    //         webcamRef.current.video.width = videoWidth;
    //         webcamRef.current.video.height = videoHeight;
    //
    //         // Set canvas width
    //         canvasRef.current.width = videoWidth;
    //         canvasRef.current.height = videoHeight;
    //
    //         // Make Detections
    //         const face = await net.estimateFaces(video);
    //
    //         // Get canvas context
    //         const ctx = canvasRef.current.getContext("2d");
    //         drawMesh(face, ctx, scanType)
    //     }
    // };

    function closeResultsModal(){
        setIsClicked(false)
        setIsReady(false)
    }

    async function saveResult(img){
        console.log(img)
        const response = await fetch("http://localhost:8080/api/scan", {
            method: "POST",
            headers: {
                'Authorization': "Bearer" + " " +  userInfo.token.accessToken,
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
                "Access-Control-Allow-Headers": "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
                'Access-Control-Allow-Credentials': "true",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({image: img})
        }).catch(err => console.log(err));
        const data = await response.json()
        console.log(data)
        navigate(`/results/${await data.id}`)
    }


    return (
        <>
            {isLoading && <h2 className={cl.scanningText}>Пожалуйста не двигайтесь...</h2>}
        <div style={styles} className={cl.wrapper}>
            <Webcam ref={webcamRef} className={cl.webcam}
                    imageSmoothing={true}/>
            <canvas ref={canvasRef} className={cl.canvas}  />
                <div>
                    {isLoading ? <div className={cl.ovalBorderActive}></div> : <div className={cl.ovalBorder}></div>}
                </div>
        </div>
            <Modal visible={isReady} setVisible={setIsReady}>
                <div className={cl.canvasWrapper}>
                    <canvas ref={canvasRef} className={cl.canvas}/>
                    <h2>Ваше фото готово!</h2>
                    <h3>Осталось еще {5-results.length-1} фото</h3>
                    <p>Проверьте пожалуйста целостность картинки!</p>
                    <div className={cl.resultButtons}>
                        <button className={cl.rejectBtn} onClick={() => setIsReady(false)}>Переснять</button>
                        <button className={cl.confirmBtn} onClick={() => saveResult(canvasRef.current.toDataURL("image/jpg"))}>Подтвердить</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Video;
