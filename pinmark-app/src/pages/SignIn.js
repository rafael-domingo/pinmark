import React from 'react';
import { checkUser, signInWithGoogle, signUserOut } from '../util/Firebase';
import { useNavigate } from 'react-router-dom';
import { Google, XCircle } from 'react-bootstrap-icons';
function SignIn() {
    const navigate = useNavigate();

    const handleSignInWithGoogle = () => {
        signInWithGoogle().then(result => {            
            console.log(result);
            navigate("/UserHome"); // navigate to user home once sign in is successful
        }).catch(error => console.log(error))
    }        

    const handleCheckUser = () => {
        checkUser().then(result => {
            console.log(result);
        }).catch(error => console.log(error))
    }

    const handleSignUserOut = () => {
        signUserOut().then(result => {
            console.log(result);
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