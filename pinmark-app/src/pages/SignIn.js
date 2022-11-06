import React from 'react';
import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon, MDBModal, MDBModalContent, MDBModalDialog, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBSpinner } from 'mdb-react-ui-kit';
import { checkUser, signInWithGoogle, signUserOut, signInWithEmail, getUser, fetchSharedTrips, signInWithFacebook } from '../util/Firebase';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setProfilePicture, setUserName, setEmail, setPhone, setUid, setAuthType, resetUserState } from '../redux/userSlice';
import { setLocations, setPinmarks, setSharedWithUser, setTripLists } from '../redux/pinmarkSlice';
import { setShared } from '../redux/sharedSlice';
import Lottie from 'lottie-react';
import traveller from '../assets/traveller.json';
import maps from '../assets/map.json';
function SignIn() {
    // instantiate variables from supporting functions    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmailInput] = React.useState('');
    const [password, setPasswordInput] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [secondModal, setSecondModal] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [register, setRegister] = React.useState(false);
    const [passwordInputModal, setPasswordInputModal] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [confirm, setConfirm] = React.useState(false);
    const [googleAuth, setGoogleAuth] = React.useState(false);

    // Firebase supporting functions
    const handleSignIn = async (authType) => {
        setSecondModal(true);
        setMessage('');
        if (authType === 'google') {
            signInWithGoogle().then((user) => {    
                console.log(user);
                setLoading(true);
                setMessage('Getting everything set up.')    
    
                dispatch(setUserName(user.displayName));
                dispatch(setEmail(user.email));
                dispatch(setPhone(user.phoneNumber));
                dispatch(setProfilePicture(user.photoURL));
                dispatch(setUid(user.uid));
                dispatch(setAuthType('google'));
                
                getUserData(user.uid);

            }).catch(error => errorHandling(error.code));
        } else if (authType === 'facebook') {
            signInWithFacebook().then((user) => {    
                console.log(user);
                setLoading(true);
                setMessage('Getting everything set up.')    
    
                dispatch(setUserName(user.displayName));
                dispatch(setEmail(user.email));
                dispatch(setPhone(user.phoneNumber));
                dispatch(setProfilePicture(user.photoURL));
                dispatch(setUid(user.uid));
                dispatch(setAuthType('facebook'));
                
                getUserData(user.uid);
            
            }).catch(error => {
                console.log(error.code);
                errorHandling(error.code)
            });
        } else {
            errorHandling('error getting authenticated');
        }
       
    }        

    // const handleSignUserOut = () => {
    //     signUserOut().then(result => {
    //         console.log(result);
    //         dispatch(resetUserState());
    //     }).catch(error => console.log(error))
    // }

    // const handleEmailRegister = () => {   
    //     if (password === confirmPassword) {
    //         if (register) {                   
    //             setSecondModal(true);
    //             signInWithEmail(true, email, password)
    //             .then(response => {       
    //                 typeof response === "string" ? errorHandling(response) : handleCheckUser('password')     
    //             }).catch(error => console.log(error)) 
    //         } else {
    //             setMessage('');
    //             setRegister(true);
    //         }   
    //     } else {
    //         setSecondModal(true);
    //         errorHandling('auth/password-mismatch');
    //     }                   
    // }

    const handleEmailSignIn = () => {
        setMessage('');
        setRegister(false);
        setSecondModal(true);
        signInWithEmail(false, email, password)
        .then(response => {       
            typeof response === "string" ? errorHandling(response) : handleCheckUser('password')         
        }).catch(error => console.log(error))     
    }

    const handleConfirm = () => {
        // if (!googleAuth) {
        //     setMessage('');
        //     setSecondModal(false);
        //     setRegister(true);
        //     setConfirm(false);
        // } else {
        //     handleSignInWithGoogle();
        //     setLoading(false);
        //     setConfirm(false);
        // }
    
    }
    const handleCheckUser = async (authType) => {
        setLoading(true);
        setMessage('Getting everything set up.')    
        // setPasswordInputModal(false);    
        // setRegister(false); 
        checkUser().then(result => {   
            if (result === 'not signed in') {
                navigate("/UserHome");
                return;
            } else {
                console.log(result);                         
                dispatch(setUserName(result.displayName));
                dispatch(setEmail(result.email));
                dispatch(setPhone(result.phoneNumber));
                dispatch(setProfilePicture(result.photoURL));
                dispatch(setUid(result.uid));    
                dispatch(setAuthType(authType));
                getUserData(result.uid);
            }
            
            
    
        }).catch(error => errorHandling(error));
    }    

    const getUserData = async (userId) => {
        getUser(userId).then((result) => {
            console.log(result)
            if (result === 'new user') {
                navigate("/UserHome");
                return;
            } else {
                dispatch(setLocations(result.pinmark.locations));
                dispatch(setPinmarks(result.pinmark.pinmarks));
                dispatch(setTripLists(result.pinmark.tripLists));
                fetchSharedTrips().then((result) => {
                    console.log(result);
                    dispatch(setShared(result))
                    setTimeout(() => {
                        navigate("/UserHome");    
                    }, 2000);
                    
                })
               
            }
        }).catch((error) => console.log(error));
       
    }

    // form input functions
    const handleEmail = (e)  => {                        
        setEmailInput(e.target.value);    
    }

    const handlePassword = (e) => {        
        setPasswordInput(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    // error handling for API calls   
    const errorHandling = (response) => {
        setLoading(false);
        switch (response) {
            case 'auth/password-mismatch':
                setMessage(`Your confirmation password doesn't match, please try again.`);
                break;
            case 'auth/email-already-in-use':
                console.log('email exists');
                setMessage(`You tried to make a new account but it looks like you've been here before, enter your password below to sign in.`)
                setPasswordInputModal(true);                
                break;
            case 'auth/invalid-email':
                console.log('put in an email address');   
                setMessage('Please enter an email address');
                break;
            case 'auth/wrong-password':
                console.log('incorrect password');
                setMessage(`Looks like the password you entered isn't correct, try again.`)
                setPasswordInputModal(true);
                break;
            case 'auth/weak-password':
                console.log('password is too weak');
                setMessage(`The password you entered is too weak, enter a stronger one.`)
                break;            
            case 'auth/user-not-found':
                console.log('user not found, create an account?');
                setMessage(`Looks like you're new here, do you want to create an account?`)
                setConfirm(true);
                break;
            case 'auth/sign-in-with-google':
                console.log('Looks like you signed in with google before, would you like to sign in using that method?');
                setMessage('Looks like you signed in with google before, would you like to sign in using that method?');
                setConfirm(true);
                setGoogleAuth(true);
                break;
            case 'auth/account-exists-with-different-credential':
                setMessage('Looks like you logged in previously using another method. Try logging in again.')
                break;
            default:
                console.log('something went wrong');
                setMessage('Terribly sorry, something went wrong on our end, please try again later.')
                break;
        }
    }


    return (
        <div 
            className='min-vh-100 d-flex flex-wrap align-items-center justify-content-center'
            style={{
                padding: 20,
                background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
            }}          
            >                    
            <MDBRow className='d-flex justify-content-center align-items-center'>
                <MDBCol size={12}>
                    <h1 style={{fontFamily: 'Pacifico', fontSize: 60, color: 'white', width: '100%'}}>Pinmark</h1>  
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <Lottie animationData={maps} style={{width: '80%'}}/>
                    </div>
                    
                </MDBCol>   
                <MDBCol size={12}>
                    <h3 style={{padding: 50, fontSize: 25, color: 'white', width: '100%'}}>Save and share your favorite locations and trips</h3>
                </MDBCol>
                <MDBCol lg={4} sm={6}>
                <MDBBtn 
                    tag='a'
                    color='none' 
                    className='m-1' 
                    style={{
                        width: '100%', 
                        backgroundColor: '#dd4b39', 
                        color: 'white', 
                        padding: 10,
                        margin: 10, 
                        borderRadius: 20, 
                        boxShadow: '0px 3px 5px 0px rgba(0, 0, 0, 0.3)'}}
                    onClick={() => handleSignIn('google')}>
                    <MDBIcon className='me-2' fab icon ='google'/>
                    Sign In with Google
                </MDBBtn> 
                <MDBBtn 
                    tag='a' 
                    color='none' 
                    className='m-1' 
                    style={{
                        width: '100%', 
                        backgroundColor: '#3b5998', 
                        color: 'white', 
                        padding: 10, 
                        margin: 10,
                        borderRadius: 20, 
                        boxShadow: '0px 3px 5px 0px rgba(0, 0, 0, 0.3)'
                        }}
                    onClick={() => handleSignIn('facebook')}>
                    <MDBIcon className='me-2' fab icon ='facebook'/>
                    Sign In with Facebook
                </MDBBtn> 
                </MDBCol>
            </MDBRow>     
           
            
           
            
            
            {/* <MDBModal staticBackdrop show={secondModal}>
                <MDBModalDialog size='lg' centered>
                    <MDBModalContent>
                        <MDBModalHeader className='d-flex justify-content-center flex-wrap'>
                        
                            Welcome to Pinmark
                        </MDBModalHeader>                        
                        <MDBModalBody className='d-grid gap-3'>                                                    
                            <MDBInput required label='Email' id='typeEmail' type='email' size='lg' onChange={handleEmail}/>                            
                            <MDBInput required label='Password' id='typePassword' type='password' size='lg' onChange={handlePassword}/>                                                       
                            {
                                register && (<MDBInput required label='Confirm Password' id='confirmPassword' type='password' size='lg' onChange={handleConfirmPassword}/>)
                            }
                        </MDBModalBody>  
                          
                        <MDBModalFooter>
                            <MDBBtn style={{margin: 5}} floating size='lg' tag='a' onClick={handleSignInWithGoogle}><MDBIcon fab icon ='google'/></MDBBtn>  
                            <MDBBtn style={{margin: 5}} floating size='lg' tag='a' onClick={handleSignInWithGoogle}><MDBIcon fab icon ='facebook-f'/></MDBBtn>                             
                            <MDBBtn color={register ? '' : 'link'} onClick={handleEmailRegister}>Register</MDBBtn>
                            {
                                !register && (<MDBBtn onClick={handleEmailSignIn}>Sign In</MDBBtn>)
                            }  
                            {
                                register && (<MDBBtn color='link' onClick={() => setRegister(false)}>Cancel</MDBBtn>)
                            }                                                                                                           
                        </MDBModalFooter>                                                            
                    </MDBModalContent>
                </MDBModalDialog>        
            </MDBModal>    */}

            <MDBModal show={secondModal} staticBackdrop={register} setShow={setSecondModal}>
                <MDBModalDialog size='sm' centered>
                    <MDBModalContent className='d-flex justify-content-center align-items-center'>
                        <MDBModalHeader>
                            <Lottie animationData={traveller} />
                            <MDBBtn
                                style={{position: 'absolute', top: 10, right: 10}}
                                className='btn-close'
                                color='none'
                                onClick={() => setSecondModal(!secondModal)}
                            >

                            </MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody className='d-grid gap-3 justify-content-center align-items-center' style={{width: '100%'}}>
                            {message}
                            {passwordInputModal && (<MDBInput required label='Password' id='typePassword' type='password' size='lg' onChange={handlePassword}/>)}  
                            {passwordInputModal && (<MDBBtn onClick={handleEmailSignIn}>Sign In</MDBBtn>)}
                            {passwordInputModal && (<MDBBtn color='link'>Forgot your password?</MDBBtn>)}
                            {confirm && (<MDBBtn onClick={handleConfirm}>Yes</MDBBtn>)}
                            {/* {loading && (<MDBSpinner role='status'></MDBSpinner>)}                             */}
                                           
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>   
            </MDBModal>                                                    
        </div>
    )
}

export default SignIn;