import React from 'react'
import classes from './RecommendedProductItem.module.css'
import Img from "../UI/img/Img.jsx";

function RecommendedProductItem({src, text, ...props}) {
    return (
        <div className={classes.product}>
            <Img size={80} borderRadius={0}>{src}</Img>
            <p className={classes.text}>{text}</p>
        </div>
    );
}

export default RecommendedProductItem;
