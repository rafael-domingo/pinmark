import React from 'react';
import { checkUser, signInWithGoogle, signUserOut } from '../util/Firebase';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Google, XCircle } from 'react-bootstrap-icons';
import { setProfilePicture, setUserName, setEmail, setPhone, setUid, setAuthType, resetUserState } from '../redux/userSlice';

function SignIn() {
    // instantiate variables from supporting functions
    const userState = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // internal supporting functions
    const handleSignInWithGoogle = () => {
        signInWithGoogle().then(result => {            
            // set redux user state based on result
            dispatch(setUserName(result.displayName));
            dispatch(setEmail(result.email));
            dispatch(setPhone(result.phoneNumber));
            dispatch(setProfilePicture(result.photoURL));
            dispatch(setUid(result.uid));    
            dispatch(setAuthType('google'));

            // navigate to user home once sign in is successful
            navigate("/UserHome"); 
        }).catch(error => console.log(error))
    }        

    const handleCheckUser = () => {
        checkUser().then(result => {            
            // set redux user state based on result
            dispatch(setUserName(result.displayName));
            dispatch(setEmail(result.email));
            dispatch(setPhone(result.phoneNumber));
            dispatch(setProfilePicture(result.photoURL));
            dispatch(setUid(result.uid));    
            dispatch(setAuthType('google'));

        }).catch(error => console.log(error))
    }

    const handleSignUserOut = () => {
        signUserOut().then(result => {
            console.log(result);
            dispatch(resetUserState());
        }).catch(error => console.log(error))
    }

    return (
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start'}}>
            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <Google style={{height: 50}} onClick={handleSignInWithGoogle}/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    Sign In With Google
                </div>
            </div>
            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <Google style={{height: 50}} onClick={handleCheckUser}/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    Check User
                </div>
            </div>
            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'}}>
                <XCircle style={{height: 50}} onClick={handleSignUserOut}/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    Sign Out
                </div>    
            </div>
            
        </div>
    )
}

export default SignIn;