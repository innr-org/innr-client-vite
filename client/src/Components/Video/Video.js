import React, { useEffect, useRef, useState } from 'react';
import {useSelector, useDispatch} from "react-redux";
import {save, remove} from "@/slices/imageSlice";
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import cl from './Video.module.css';
import Modal from "@/Components/UI/modal/Modal";
import Button from "@/Components/UI/button/Button";
import {RootState} from "../../store";
import { useRouter } from 'next/router'
import axios from "axios";

function Video({styles, isClicked, setIsClicked, scanType}) {
    //router init
    let router= useRouter()
    //imageReducer init
    const image = useSelector((state) => state.image.value)
    const dispatch = useDispatch()
    console.log(image)

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isReady, setIsReady] = useState(false)

    // pause a webcam
    const [imageSrc, setImageSrc] = useState(null);

    // running detection function
    useEffect(() => {
        if(isClicked){
            runFacemesh()
        }
    }, [isClicked]);



    // load facemesh
    async function runFacemesh() {
        try{
            setIsLoading(true)
            const net = await facemesh.load();
            //dev
            // setInterval(() => detect(net), 100)
            detect(net).catch(err => console.error("Landmark Detection Error: " + err))

        }catch (err){
            console.error(err)
        }
        finally{
            setIsLoading(false)
            setIsReady(true)
        }
    }

    // detect function
    async function detect(net) {
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
            const ctx = canvasRef.current.getContext("2d")

            // ctx.drawImage(webcamRef.current.video, 0, 0, videoWidth, videoHeight)
            console.log(scanType)

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
                        x0: 162,
                        y0: 10,
                        dxInit: 389,
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
                        x0: 234,
                        y0: 25,
                        dxInit: 209,
                        dyInit: 152,
                    }
                    break
            }

            canvasRef.current.width = prediction[0].boundingBox.bottomRight[0]- prediction[0].boundingBox.topLeft[0]
            canvasRef.current.height = prediction[0].boundingBox.bottomRight[1]- prediction[0].boundingBox.topLeft[1]

            //drawing canvas
            // ctx.drawImage(webcamRef.current.video,
            //     prediction[0].scaledMesh[meshSettings.x0][0], prediction[0].scaledMesh[meshSettings.y0][1],
            //     prediction[0].scaledMesh[meshSettings.dxInit][0] - prediction[0].scaledMesh[meshSettings.x0][0],
            //     prediction[0].scaledMesh[meshSettings.dyInit][1] - prediction[0].scaledMesh[meshSettings.y0][1],
            //     0, 0,
            //     prediction[0].scaledMesh[meshSettings.dxInit][0] - prediction[0].scaledMesh[meshSettings.x0][0],
            //     prediction[0].scaledMesh[meshSettings.dyInit][1] - prediction[0].scaledMesh[meshSettings.y0][1])

            ctx.drawImage(webcamRef.current.video,
                 prediction[0].boundingBox.topLeft[0], prediction[0].boundingBox.topLeft[1],
                 prediction[0].boundingBox.bottomRight[0]- prediction[0].boundingBox.topLeft[0],
                 prediction[0].boundingBox.bottomRight[1]- prediction[0].boundingBox.topLeft[1],
                0, 0,
                prediction[0].boundingBox.bottomRight[0]- prediction[0].boundingBox.topLeft[0],
                prediction[0].boundingBox.bottomRight[1]- prediction[0].boundingBox.topLeft[1],
            )

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

    function closeResultsModal(){
        setIsClicked(false)
        setIsReady(false)
    }

    async function saveResult(img){
        console.log(img)
        const response = await fetch("http://164.92.164.196:8080/api/scan", {
            method: "POST",
            headers: {
                'Authorization': "Bearer" + " " +  localStorage.access,
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE, PUT",
                "Access-Control-Allow-Headers": "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
                'Access-Control-Allow-Credentials': "true",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({image: img})
        }).catch(err => console.log(err));
        const data = await response.json()
        dispatch(save(data))
        router.push('/results')
    }


    return (
        <>
            {isLoading && <h2 className={cl.scanningText}>Пожалуйста не двигайтесь...</h2>}
        <div style={styles} className={cl.wrapper}>
            <Webcam mirrored={true} ref={webcamRef}
                    imageSmoothing={true}/>
                <div>
                    {isLoading ? <div className={cl.ovalBorderActive}></div> : <div className={cl.ovalBorder}></div>}
                </div>
        </div>
            <Modal visible={isReady} setVisible={setIsReady} className={cl.resultModal}>
                <canvas ref={canvasRef} className={cl.canvas}/>
                <div className={cl.resultBtns}>
                    <Button className={cl.retryBtn} onClick={closeResultsModal}>Переснять?</Button>
                    <Button className={cl.submitBtn} onClick={() => saveResult(canvasRef.current.toDataURL("image/jpeg"))}>Подтвердить!</Button>
                </div>
            </Modal>
        </>
    );
}

export default Video;
