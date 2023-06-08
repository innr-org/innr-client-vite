import React from 'react'
import Img from '../UI/img/Img';
import classes from './RecommendedProductItem.module.css'

interface RecommendedProductItem
{
    src: string;
    text: string;
    props?: any;
}

function RecommendedProductItem({src, text, ...props}:RecommendedProductItem) {
    return (
        <div className={classes.product}>
            <Img size={80} borderRadius={0}>{src}</Img>
            <p className={classes.text}>{text}</p>
        </div>
    );
}

export default RecommendedProductItem;