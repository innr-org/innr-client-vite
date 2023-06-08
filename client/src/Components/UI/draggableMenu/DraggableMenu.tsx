import React, {useRef, useEffect, useState} from 'react';
import Image from "next/image"
import cl from './Draggable.module.css'
import {ChildButton, FloatingMenu, MainButton} from "react-floating-button-menu";
import burger from '../../../../public/menu/burgerMenu.svg'

function DraggableMenuItem({ref}) {

    const draggableRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleTouchStart = (event) => {
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
            setPosition({
                x: touch.clientX - dragOffset.x,
                y: touch.clientY - dragOffset.y,
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const [isOpen, setIsOpen] = useState(false)
   return (
       <div ref={draggableRef}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                cursor: 'move',
                zIndex: 9998
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
                   style={{ boxShadow: '0px 0px 15px 10px #AED6F7'}}
                   iconResting={<Image width='100%' height='100%' src={burger} alt=""/>}
                   iconActive={<div>X</div>}
                   backgroundcolor="black"
                   onClick={() => setIsOpen(prevState => !prevState)}
                   size={56}
               />
               <ChildButton
                   icon={<div>+</div>}
                   backgroundcolor="white"
                   size={40}
                   onClick={() => console.log('First button clicked')}
               />
               <ChildButton
                   icon={<div>+</div>}
                   backgroundcolor="white"
                   size={40}
               />
               <ChildButton
                   icon={<div>+</div>}
                   backgroundcolor="white"
                   size={40}
               />
           </FloatingMenu>
       </div>
   )
}

export default DraggableMenuItem;
