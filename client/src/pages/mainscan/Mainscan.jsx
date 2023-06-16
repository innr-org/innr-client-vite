import {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useFetching} from "../../hooks/useFetching.js";
import UserService from "../../API/UserService.js";
import {logout} from "../../features/auth/authSlice.js";
import Button from "../../components/UI/button/Button.jsx";
import classes from "./mainscan.module.css";
import 'swiper/css';
import 'swiper/css/pagination'

import bell from '../../assets/scanIcons/notification-bell.svg'
import scanSvg from '../../assets/scanIcons/scan.svg'
import scanElems from '../../assets/scanImgs/scanFaceElems.png'
import plusSvg from '../../assets/scanIcons/plus.svg'
import {BeatLoader} from "react-spinners";



function Mainscan() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)

    const [imageLoading, setImageLoading] = useState(false)

    const [readyScans, setReadyScans] = useState([])


    useEffect(() => {
        async function fetchReadyScans() {
            try{
                setImageLoading(true)
                const scanPromises = userInfo.scans.map(async (scanId) => {
                    const response = await UserService.getInfoById(userInfo.accessToken, scanId, "scan");
                    return response.data;
                });
                const resolvedScans = await Promise.all(scanPromises);
                setReadyScans(resolvedScans);
            }
            catch (err){
                setImageLoading(false)
                console.error(err)
            }
            finally {
                setImageLoading(false)

            }
        };

        fetchReadyScans();
    }, [userInfo.scans]);

    function customLogout(){
        dispatch(logout())
        navigate("/login")
    }

    const scanHistory = readyScans.map(scan => {
        return <SwiperSlide onClick={() => navigate(`/results/${scan._id}`)}>
            <div className={classes.sliderItem}>
                <img className={classes.scanImg} src={"data:image/jpeg;base64," + scan.image} alt="plus" />
            </div>
        </SwiperSlide>
    })
    return (
        <div>
            <div className={classes.container}>
                <section className={classes.scan}>
                    <div className={classes.scanGradientHeader}></div>
                    <div className={classes.scanHeader}>
                        <h1 className={classes.scanTitle + " " + "animate__animated animate__backInDown"}>{userInfo.phone===null ? "null" : userInfo.phone}</h1>
                        { !userInfo
                            ?
                            <Button className={classes.loginBtn} onClick={() => navigate("/login")}>Login</Button>
                            :
                            <Button suppressHydrationWarning className={classes.loginBtn +  " " + "animate__animated animate__fadeInTopRight"} onClick={customLogout}>Logout</Button>
                        }

                    </div>
                    <div onClick={() => navigate('/scan')} className={classes.scanFace}>
                        <img className={classes.scanElems + " " + "animate__animated animate__zoomIn"} src={scanElems} alt=""/>
                        <div className={classes.scanningFaceIcon}>
                            <img className={"animate__animated animate__rotateIn animate__delay-0.5s"} src={scanSvg} alt="scan" />
                            <p className={"animate__animated animate__zoomIn"}>Сканировать лицо</p>
                        </div>

                        <div className={classes.scanAva}></div>
                    </div>
                </section>
            </div>

            <section className={classes.analysis}>
                <div className={classes.container}>
                    <h2 className={classes.analysisTitle}>Список Анализов</h2>
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={80}
                        className="mySwiper"
                    >
                        {imageLoading ? <SwiperSlide>
                            <div className={classes.sliderItem + classes.loader}>
                                <BeatLoader
                                    color="green"
                                    loading={imageLoading}
                                    cssOverride={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 9999,
                                        marginTop: '50%',
                                        marginLeft: '50%'
                                    }}
                                    size={10}
                                    margin={2}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                        </SwiperSlide> : readyScans.length!==0 && scanHistory.reverse()}
                        <SwiperSlide>
                            <div className={classes.sliderItem} onClick={() => navigate("/scan")}>
                                <img src={plusSvg} alt="plus" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={classes.sliderItem}  onClick={() => navigate("/scan")}>
                                <img src={plusSvg} alt="plus" />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={classes.sliderItem}  onClick={() => navigate("/scan")}>
                                <img src={plusSvg} alt="plus" />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>
            <div className={classes.logo}><p>Innr</p></div>
        </div>
    );
}

export default Mainscan;
