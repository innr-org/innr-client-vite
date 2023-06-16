import {useEffect} from 'react'
import {GridLoader} from "react-spinners";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux";
import {useGetUserDetailsQuery} from "./app/services/auth/authService.js";
import {setCredentials} from "./features/auth/authSlice.js";

import Register from "./pages/register/Register.jsx";
import Login from "./pages/login/Login.jsx";

import './App.css'
import NotAuth from "./components/notAuth/NotAuth.jsx";
import Mainscan from "./pages/mainscan/Mainscan.jsx";
import Scan from "./pages/scan/Scan.jsx";
import Scanning from "./pages/scanning/Scanning.jsx";
import Results from "./pages/results/Results.jsx";
import Recommendations from "./pages/recommendations/Recommendations.jsx";
import Lobby from "./pages/lobby/Lobby.jsx";
import NotFound from "./components/notFound/NotFound.jsx";
import Specialist from "./pages/specialist/Specialist.jsx";
import Booking from "./pages/booking/Booking.jsx";
import 'react-calendar/dist/Calendar.css';
import Enrolls from "./pages/enroll/Enrolls.jsx";
import DraggableMenuItem from "./components/UI/draggableMenu/DraggableMenu";


function App() {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.auth)
    const { userInfo } = useSelector((state) => state.auth)

    const { data, isFetching } = useGetUserDetailsQuery('userDetails', {
        pollingInterval: 900000,
    })

    useEffect(() => {
        if (data) dispatch(setCredentials(data))
    }, [data, dispatch])

  return (
    <BrowserRouter>
        <DraggableMenuItem/>
      <Routes>
          <Route path={"/login"} element={<Login/>}/>
          <Route path={"/register"} element={<Register/>}/>
          <Route path={"/mainscan"} element={userInfo===null ? <NotAuth/> : <Mainscan/>}/>
          <Route path={"/scan"} element={userInfo===null ? <NotAuth/> : <Scan/>}/>
          <Route path={"/scanning"} element={userInfo===null ? <NotAuth/> : <Scanning/>}/>
          <Route path={"/results/:id"} element={userInfo===null ? <NotAuth/> : <Results/>}/>
          <Route path={"/results"} element={userInfo===null ? <NotAuth/> : <Results/>}/>
          <Route path={"/recommendations/:id"} element={userInfo===null ? <NotAuth/> : <Recommendations/>}/>
          <Route path={"/recommendations"} element={userInfo===null ? <NotAuth/> : <Recommendations/>}/>
          <Route path={"/specialists/:id"} element={userInfo===null ? <NotAuth/> : <Specialist/>}/>
          <Route path={"/booking/:id"} element={userInfo===null ? <NotAuth/> : <Booking/>}/>
          <Route path={"/enrolls"} element={<Enrolls/>}/>
          <Route path={"/lobby"} element={<Lobby/>}/>
          <Route path={"*"} element={<NotFound/>}/>
      </Routes>
      <GridLoader
          color="green"
          loading={loading || isFetching}
          cssOverride={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
          }}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
      />
        {(loading || isFetching) &&  <div className="overlay"></div>}
    </BrowserRouter>
  )
}

export default App
