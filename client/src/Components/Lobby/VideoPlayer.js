import React, {useEffect, useRef, useState} from 'react';
import cl from './Agora.module.css'

function VideoPlayer({ user }) {
    const videoRef = useRef(null);
    const [active, setActive] = useState(true);

    useEffect(() => {
        if (user.videoTrack && active) {
            user.videoTrack.play(videoRef.current);
        }
    }, [user.videoTrack, active]);

    return (
        <div
            className={cl.video}
            ref={videoRef}
            onClick={() => setActive(!active)}
        ></div>
    );
}

export default VideoPlayer;
