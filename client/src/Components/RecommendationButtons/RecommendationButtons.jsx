import React, {useEffect, useRef, useState} from 'react'
import classes from './RecommendationButtons.module.css'
import {Link} from "react-router-dom";


function RecommendationButtons({page, id}) {
    console.log(page)
    const activeResult = page === "Results" ? classes.active : ""
    const activeRec = page === "Recommendations" ? classes.active : ""
    return (
        <div className={classes.btns}>
            <div className={classes.pages}>
                {id ? <Link to={`/results/${id}`}>
                    <button className={classes.btn + " " + activeResult}>
                        1
                    </button>
                </Link>
                    :
                    <Link to="/results">
                        <button className={classes.btn + " " + activeResult}>
                            1
                        </button>
                    </Link>
                }

                {id ? <Link to={`/recommendations/${id}`}>
                    <button className={classes.btn + " " + activeRec}>
                        2
                    </button>
                </Link>
                    :
                    <Link to="/recommendations">
                        <button className={classes.btn + " " + activeRec}>
                            2
                        </button>
                    </Link>
                }

            </div>
            <button className={classes.pageName}>{page}</button>
        </div>
    );
}

export default RecommendationButtons;
