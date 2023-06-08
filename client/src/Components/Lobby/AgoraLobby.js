import React, {useMemo, useState} from 'react';
import dynamic from "next/dynamic";
const VideoRoom = dynamic(() => import('./VideoRoom'), { ssr: false })
import cl from './Agora.module.css'
import Image from "next/image";
import girlPhone from '../../../public/teamImages/girlPhone.png'
import Button from "@/Components/UI/button/Button";

export default function AgoraLobby(props) {

    const [joined, setJoined] = useState(false)

    return (
        <div className={cl.agoraLobby}>
            <header className={cl.header}>
                <h1>Сессия со специалистом</h1>
            </header>
            <main className={cl.main}>
                <Image className={cl.mainImg} src={girlPhone} alt="girlScanning"/>
            </main>
            {!joined && (
                 <button className={cl.joinBtn} onClick={() => setJoined(true)}>Join Room</button>
                )
            }
            {joined && (
                <VideoRoom/>

            )}
        </div>
    );
}


