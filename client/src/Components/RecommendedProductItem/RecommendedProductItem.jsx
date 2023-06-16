import React from 'react'
import classes from './RecommendedProductItem.module.css'

function RecommendedProductItem({src, text, ...props}) {
    return (
        <div className={classes.product}>
            <img width={80} height={80} src={src}></img>
            <p className={classes.text}>{text}</p>
        </div>
    );
}

export default RecommendedProductItem;
