import React, {useEffect, useRef, useState} from "react";

import {
    AgoraVideoPlayer,
    createClient,
    createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

import cl from './Agora.module.css'

const appId = "ff93f0b6cbca4e779a00fff694b2cf68";
const token = "007eJxTYBBSjP/nuU+uWz75zY+NWrPeKvI4nytfeXbCucWbLHM7nzooMKSlWRqnGSSZJSclJ5qkmptbJhoYpKWlmVmaJBklp5lZiDYXpjQEMjJwekoyMTJAIIjPwpCZl1fEwAAAcGgfSA=="


const config = {
    mode: 'rtc',
    codec: 'vp8',
}

const useClient = createClient(config);

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoRoom = () => {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("innr");

    return (
        <div>
            <div className={cl.background}></div>
            <h1 className={cl.heading}>Сессия со специалистом</h1>
            {inCall ? (
                <VideoCall setInCall={setInCall} channelName={channelName} />
            ) : (
                <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
            )}
        </div>
    );
};

const VideoCall = (props) => {
    const { setInCall, channelName } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    useEffect(() => {
        // function to initialise the SDK
        let init = async (name) => {
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                console.log("subscribe success");
                if (mediaType === "video") {
                    setUsers((prevUsers) => [...prevUsers, user]);
                }
                if (mediaType === "audio") {
                    user.audioTrack?.play();
                }
            });

            client.on("user-unpublished", (user, type) => {
                console.log("unpublished", user, type);
                if (type === "audio") {
                    user.audioTrack?.stop();
                }
                if (type === "video") {
                    setUsers((prevUsers) =>
                        prevUsers.filter((User) => User.uid !== user.uid)
                    );
                }
            });

            client.on("user-left", (user) => {
                console.log("leaving", user);
                setUsers((prevUsers) =>
                    prevUsers.filter((User) => User.uid !== user.uid)
                );
            });

            await client.join(appId, name, token, null);
            if (tracks) await client.publish([tracks[0], tracks[1]]);
            setStart(true);
        };

        if (ready && tracks) {
            console.log("init ready");
            init(channelName);
        }
    }, [channelName, client, ready, tracks]);

    return (
        <div className={cl.videoRoom}>
            {ready && tracks && (
                <div>
                    <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
                </div>
            )}
            {start && tracks && <Videos users={users} tracks={tracks} />}
        </div>
    );
};


const Videos = (props) => {
    const { users, tracks } = props;

    return (
        <div>
            <div id={cl["videos"]}>
                <AgoraVideoPlayer className={cl.vid} videoTrack={tracks[1]} />
                {users.length > 0 &&
                    users.map((user) => {
                        if (user.videoTrack) {
                            return (
                                <AgoraVideoPlayer className={cl.vid} videoTrack={user.videoTrack} key={user.uid} />
                            );
                        } else return null;
                    })}
            </div>
        </div>
    );
};

export const Controls = (props) => {
    const client = useClient();
    const { tracks, setStart, setInCall } = props;
    const [trackState, setTrackState] = useState({ video: true, audio: true });

    const mute = async (type) => {
        if (type === "audio") {
            await tracks[0].setEnabled(!trackState.audio);
            await client.localTracks[1].setEnabled(!trackState.audio);
            setTrackState((ps) => {
                return { ...ps, audio: !ps.audio };
            });
        } else if (type === "video") {
            await tracks[1].setEnabled(!trackState.video);
            await client.localTracks[0].setEnabled(!trackState.video);
            setTrackState((ps) => {
                return { ...ps, video: !ps.video };
            });
        }
    };

    const leaveChannel = async () => {
        await client.leave();
        client.removeAllListeners();
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        setInCall(false);
    };

    return (
        <div className={cl.controls}>
            <p className={trackState.audio ? cl.on : ""}
               onClick={() => mute("audio")}>
                {trackState.audio ? "MuteAudio" : "UnmuteAudio"}
            </p>
            <p className={trackState.video ? cl.on : ""}
               onClick={() => mute("video")}>
                {trackState.video ? "MuteVideo" : "UnmuteVideo"}
            </p>
            {<p onClick={() => leaveChannel()}>Leave</p>}
        </div>
    );
};


const ChannelForm = (props) => {
    const { setInCall, setChannelName } = props;

    return (
        <form className={cl.join}>
            {appId === '' && <p style={{color: 'red'}}>Please enter your Agora App ID in App.tsx and refresh the page</p>}
            <button onClick={(e) => {
                e.preventDefault();
                setChannelName("innr")
                setInCall(true);
            }}>
                Join
            </button>
        </form>
    );
};

export const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        const signalingClient = AgoraSignaling.createClient();
        const appId = '<YOUR_APP_ID>';
        const userId = '<YOUR_USER_ID>';
        const token = '<YOUR_TOKEN>';

        signalingClient.initialize(appId);

        signalingClient.login({ uid: userId, token }).then(() => {
            signalingClient.onMessageChannelReceive = (channel, uid, msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            };
        });

        return () => {
            signalingClient.logout();
        };
    }, []);

    const handleSendMessage = () => {
        const signalingClient = AgoraSignaling.getInstance();
        const channel = '<YOUR_CHANNEL_NAME>';
        const message = inputText;

        signalingClient.messageChannelSend(channel, message);
        setInputText('');
    };

    return (
        <div>
            <h1>Real-Time Messaging App</h1>
            <div>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
            </div>
            <div>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default VideoRoom

