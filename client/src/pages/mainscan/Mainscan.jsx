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
    const [scans, setScans] = useState([])
    const [readyScans, setReadyScans] = useState([])
    const [fetchScans, isScansLoading, scansError] = useFetching(async () => {
        const response = await UserService.getScans(userInfo.token.accessToken)
        setScans(await response.data)
    })

    useEffect(() => {
        fetchScans()
    }, [])

    useEffect(() => {
        const fetchReadyScans = async () => {
            try{
                setImageLoading(true)
                const scanPromises = scans.map(async (scan) => {
                    const response = await UserService.getScanById(userInfo.token.accessToken, scan.id);
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
    }, [scans]);

    useEffect(() => {
        console.log(readyScans)
    }, [readyScans])


    function customLogout(){
        dispatch(logout())
        navigate("/login")
    }

    const scanHistory = readyScans.map(scan => {
        return <SwiperSlide onClick={() => navigate(`/results/${scan.id}`)}>
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
                        <h1 className={classes.scanTitle}>{userInfo.phone===null ? "null" : userInfo.phone}</h1>
                        { !userInfo
                            ?
                            <Button className={classes.loginBtn} onClick={() => navigate("/login")}>Login</Button>
                            :
                            <Button suppressHydrationWarning className={classes.loginBtn} onClick={customLogout}>Logout</Button>
                        }

                    </div>
                    <div onClick={() => navigate('/scan')} className={classes.scanFace}>
                        <img className={classes.scanElems} src={scanElems} alt=""/>
                        <div className={classes.scanningFaceIcon}>
                            <img src={scanSvg} alt="scan" />
                            <p>Сканировать лицо</p>
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
                        </SwiperSlide> : scans.length!==0 && scanHistory.reverse()}
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
            <h1 style={{textAlign: 'center', letterSpacing: '0.8em', backgroundColor: "#C8FA60", position: 'fixed', bottom: 0,
                    padding: '20px 0', width: '100%', margin: 0

            }}>Innr</h1>
        </div>
    );
}

export default Mainscan;
