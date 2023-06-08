    import React, { useEffect } from 'react';
import AC from 'agora-chat';



const AgoraChat = () => {
    let conn

    useEffect(() => {

        const appKey = "61970633#1133347";

        // Initializes the Web client.
        conn = new AC.connection({
            appKey: appKey,
        });

        // Replaces <Your app key> with your app key.
        // Adds the event handler.
        conn.addEventHandler("connection&message", {
            // Occurs when the app is connected to Agora Chat.
            onConnected: () => {
                console.log("Connect success !");
            },
            // Occurs when the app is disconnected from Agora Chat.
            onDisconnected: () => {
                console.log("Logout success !");
            },
            // Occurs when a text message is received.
            onTextMessage: (message) => {
                console.log(message);
            },
            // Occurs when the token is about to expire.
            onTokenWillExpire: (params) => {
                console.log("Token is about to expire");
            },
            // Occurs when the token has expired.
            onTokenExpired: (params) => {
                console.log("The token has expired");
            },
            onError: (error) => {
                console.log("on error", error);
            },
        });

        // Cleanup function
        return () => {
            // Close the connection
            conn.close();
        };
    }, []);

    // Defines the functions of the buttons.
    const handleLogin = () => {
        console.log("Logging in...");
        const userId = document.getElementById("userID").value.toString();
        const token = document.getElementById("token").value.toString();
        conn.open({
            user: userId,
            agoraToken: token,
        });
    };

    const handleLogout = () => {
        conn.close();
        console.log("logout");
    };

    const handleSendPeerMessage = () => {
        let peerId = document.getElementById("peerId").value.toString();
        let peerMessage = document.getElementById("peerMessage").value.toString();
        let option = {
            chatType: "singleChat", // Sets the chat type as single chat.
            type: "txt", // Sets the message type.
            to: peerId, // Sets the recipient of the message with user ID.
            msg: peerMessage, // Sets the message content.
        };
        let msg = AC.message.create(option);
        conn
            .send(msg)
            .then((res) => {
                console.log("send private text success");
                const logDiv = document.getElementById("log");
                const messageSentDiv = document.createElement("div");
                messageSentDiv.innerText = `Message send to: ${peerId} Message: ${peerMessage}`;
                logDiv.appendChild(messageSentDiv);
            })
            .catch(() => {
                console.log("send private text fail");
            });
    };

    return (
        <div>
            <h2>Agora Chat Examples</h2>
            <form id="loginForm">
                <div className="input-field">
                    <label>User ID</label>
                    <input type="text" placeholder="User ID" id="userID" />
                </div>
                <div className="input-field">
                    <label>Token</label>
                    <input type="text" placeholder="Token" id="token" />
                </div>
                <div>
                    <button type="button" onClick={handleLogin}>Login</button>
                    <button type="button" onClick={handleLogout}>Logout</button>
                </div>
                <div className="input-field">
                    <label>Peer user ID</label>
                    <input type="text" placeholder="Peer user ID" id="peerId" />
                </div>
                <div className="input-field">
                    <label>Peer Message</label>
                    <input type="text" placeholder="Peer message" id="peerMessage" />
                    <button type="button" onClick={handleSendPeerMessage}>send</button>
                </div>
            </form>
            <hr />
            <div id="log"></div>
        </div>
    );
};

export default AgoraChat;
