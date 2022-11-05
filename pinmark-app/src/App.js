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
import ProtectedRoute from '../src/pages/ProtectedRoute';
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);

  // React.useEffect(() => {
  //   checkUser().then(result => {   
  //     if (result !== 'not signed in') {
  //       console.log(result);                         
  //       dispatch(setUserName(result.displayName));
  //       dispatch(setEmail(result.email));
  //       dispatch(setPhone(result.phoneNumber));
  //       dispatch(setProfilePicture(result.photoURL));
  //       dispatch(setUid(result.uid));    
  //       // dispatch(setAuthType(authType));
  //       getUser(result.uid).then((result) => {
  //         console.log(result)
  //         if (result === 'new user') {              
  //             return;
  //         } else {
  //             dispatch(setLocations(result.pinmark.locations));
  //             dispatch(setPinmarks(result.pinmark.pinmarks));
  //             dispatch(setTripLists(result.pinmark.tripLists));
  //             navigate('/UserHome');
  //         }
  //     }).catch((error) => console.log(error));   
  //     } else {
  //       return;
  //     }
        
  //   }).catch(error => console.log(error));
  // }, [])

  
  // React.useEffect(() => {
  //   if (userState.uid === '') {
  //     return <Navigate to="/" replace />;
  //   }
  // })
  return (
    <div className="App"> 
    {/* <div style={{padding: 50}}> */}
      <Routes>
        <Route path="/" element={<SignIn />}/>
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
