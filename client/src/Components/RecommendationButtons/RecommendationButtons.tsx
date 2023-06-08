import React, {useEffect, useRef, useState} from 'react'
import Button from '../UI/button/Button'
import classes from './RecommendationButtons.module.css'
import Link from "next/link";

function RecommendationButtons({page}) {
    console.log(page)
    const activeResult = page === "Results" ? classes.active : ""
    const activeRec = page === "Recommendations" ? classes.active : ""
    return (
        <div className={classes.btns}>
            <div className={classes.pages}>
                <Link href="/results">
                    <button className={classes.btn + " " + activeResult}>
                        1
                    </button>
                </Link>
                <Link href="/recommendations">
                    <button className={classes.btn + " " + activeRec}>
                        2
                    </button>
                </Link>
            </div>
            <button className={classes.pageName}>{page}</button>
        </div>
    );
}

export default RecommendationButtons;