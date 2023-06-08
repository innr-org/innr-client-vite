import {Store} from "react-notifications-component";

export function useNotification(type, title, message) {
    Store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeInRight"],
        animationOut: ["animate__animated", "animate__backOutRight  "],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
}
