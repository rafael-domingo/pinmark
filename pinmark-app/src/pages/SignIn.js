import React from 'react';
import { MDBInput, MDBBtn, MDBIcon, MDBModal, MDBModalContent, MDBModalDialog, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdb-react-ui-kit';
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
            handleCheckUser(); // run check user function to assign user data to redux state       

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
        <div 
            className='bg-image min-vh-100'
            style={{backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')"}}
            >                       
            <MDBModal staticBackdrop show={true}>
                <MDBModalDialog size='lg' centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            Welcome to Pinmark
                        </MDBModalHeader>
                        <MDBModalBody className='d-grid gap-3'>
                            <MDBInput label='Email' id='typeEmail' type='email' size='lg'/>
                            <MDBInput label='Password' id='typePassword' type='password' size='lg'/>
                        </MDBModalBody>                
                        <MDBModalFooter>
                            <MDBBtn style={{margin: 5}} floating size='lg' tag='a' onClick={handleSignInWithGoogle}><MDBIcon fab icon ='google'/></MDBBtn>  
                            <MDBBtn style={{margin: 5}} floating size='lg' tag='a' onClick={handleSignInWithGoogle}><MDBIcon fab icon ='facebook-f'/></MDBBtn>                             
                            <MDBBtn outline>Register</MDBBtn>
                            <MDBBtn>Sign In</MDBBtn>                                                                                
                        </MDBModalFooter>                                                            
                    </MDBModalContent>
                </MDBModalDialog>        
            </MDBModal>                                                       
        </div>
    )
}

export default SignIn;