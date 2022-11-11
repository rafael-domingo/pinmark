import './App.css';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import PinmarkList from './pages/PinmarkList';
import UserHome from './pages/UserHome';
import PinmarkDetail from './pages/PinmarkDetail';
import SignIn from './pages/SignIn';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { checkUser, getUser } from './util/Firebase';
import { setLocations, setPinmarks, setTripLists } from './redux/pinmarkSlice';
import { setProfilePicture, setUserName, setEmail, setPhone, setUid, setAuthType } from './redux/userSlice';
import { fetchSharedTrips } from './util/Firebase';
import { setShared } from './redux/sharedSlice';
import ProtectedRoute from '../src/pages/ProtectedRoute';
import { auth } from './util/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Loading from './pages/Loading';
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();  

  React.useEffect(() => {          
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserName(user.displayName));
        dispatch(setEmail(user.email));
        dispatch(setPhone(user.phoneNumber));
        dispatch(setProfilePicture(user.photoURL));
        dispatch(setUid(user.uid));    
        // dispatch(setAuthType(authType));
        getUserData(user.uid);    
      } else {
        navigate('/SignIn');
      }
    })    
    
  }, [0])

  const getUserData = async (userId) => {
    getUser(userId).then((result) => {
      if (result === 'new user') {
        navigate("/UserHome");
        return;
    } else {
        dispatch(setLocations(result.pinmark.locations));
        dispatch(setPinmarks(result.pinmark.pinmarks));
        dispatch(setTripLists(result.pinmark.tripLists));
        fetchSharedTrips().then((result) => {            
            dispatch(setShared(result))
            navigate("/UserHome");                       
        })
       
    }
    })
  }

  return (
    <div className="App"> 
    {/* <div style={{padding: 50}}> */}
      <Routes>
        <Route path="/" element={<Loading />}/>
        <Route path="/SignIn" element={<SignIn />}/>
        <Route path="/UserHome" element={
          <ProtectedRoute>
            <UserHome/>
          </ProtectedRoute>          
        }/>
        <Route path="/PinmarkList/:locationId" element={
          <ProtectedRoute>
            <PinmarkList />
          </ProtectedRoute>          
        }/>
        <Route path="/PinmarkDetail" element={<PinmarkDetail/>}/>
      </Routes>
    {/* </div> */}
     
    </div>
  );
}

export default App;
