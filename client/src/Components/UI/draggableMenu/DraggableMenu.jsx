import React, {useRef, useEffect, useState} from 'react';
import cl from './Draggable.module.css'
import {ChildButton, FloatingMenu, MainButton} from "react-floating-button-menu";
import burger from '../../../../public/assets/menu/burgerMenu.svg'
import {useNavigate} from "react-router-dom";

function DraggableMenuItem() {
    const navigate = useNavigate()
    const draggableRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleTouchStart = (event) => {
        disableScroll();
        const touch = event.touches[0];
        const { left, top } = draggableRef.current.getBoundingClientRect();
        setIsDragging(true);
        setDragOffset({
            x: touch.clientX - left,
            y: touch.clientY - top,
        });
    };

    const handleTouchMove = (event) => {
        if (isDragging) {
            const touch = event.touches[0];

            const { clientWidth, clientHeight } = document.documentElement;
            const { width, height, left, top } = draggableRef.current.getBoundingClientRect();
            const maxX = clientWidth - width;
            const maxY = clientHeight - height;
            const posX = touch.clientX - dragOffset.x;
            const posY = touch.clientY - dragOffset.y;

            setPosition({
                x: touch.clientX - dragOffset.x,
                y: touch.clientY - dragOffset.y,
            });

            setPosition({
                x: Math.max(0, Math.min(posX, maxX)),
                y: Math.max(0, Math.min(posY, maxY)),
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        enableScroll();
    };

    const disableScroll = () => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
    }

    const enableScroll = () => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.style.overscrollBehavior = 'auto';
        document.documentElement.style.overscrollBehavior = 'auto';
    }

    const hideChildElements = isDragging ? 'hide-child-elements' : '';

    const [isOpen, setIsOpen] = useState(false)
    return (
        <div ref={draggableRef}
             style={{
                 position: 'fixed',
                 left: position.x,
                 top: position.y,
                 cursor: 'move',
                 zIndex: 9998,
             }}
             onTouchStart={handleTouchStart}
             onTouchMove={handleTouchMove}
             onTouchEnd={handleTouchEnd}>
            <FloatingMenu className={cl.menu}
                          slideSpeed={500}
                          direction="up"
                          spacing={8}
                          isOpen={isOpen}
            >
                <MainButton
                    style={{ boxShadow: '0px 0px 15px 10px #AED6F7', backgroundColor: "white"}}
                    iconResting={<img width='100%' height='100%' src={burger} alt=""/>}
                    iconActive={<div>X</div>}
                    backgroundcolor="black"
                    onClick={() => setIsOpen(prevState => !prevState)}
                    size={56}
                />
                <ChildButton
                    className={cl.hideChildElements}
                    icon={<div className={cl.menuItem}><i className="fa-solid fa-house"></i></div> }
                    backgroundcolor="white"
                    style={{backgroundColor: 'white'}}
                    size={60}
                    onClick={() => navigate("/mainscan")}
                />
                <ChildButton
                    icon={<div className={cl.menuItem}><i className="fa-solid fa-stethoscope"></i></div>}
                    backgroundcolor="white"
                    size={60}
                    onClick={() =>  navigate("/scanning")}
                />
                <ChildButton
                    icon={<div className={cl.menuItem}><i className="fa-solid fa-calendar-days"></i></div>}
                    backgroundcolor="white"
                    size={60}
                    onClick={() =>  navigate("/enrolls")}
                />
            </FloatingMenu>
        </div>
    )
};

export default DraggableMenuItem;
