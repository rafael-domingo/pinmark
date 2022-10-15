import React from 'react';
import { MDBInput, MDBBtn, MDBIcon, MDBModal, MDBModalContent, MDBModalDialog, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBSpinner } from 'mdb-react-ui-kit';
import { checkUser, signInWithGoogle, signUserOut, signInWithEmail } from '../util/Firebase';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setProfilePicture, setUserName, setEmail, setPhone, setUid, setAuthType, resetUserState } from '../redux/userSlice';

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
    const [createNewAccount, setCreateNewAccount] = React.useState(false);
    // Firebase supporting functions
    const handleSignInWithGoogle = () => {
        setSecondModal(true);
        signInWithGoogle().then(result => {    
            handleCheckUser('google'); // run check user function to assign user data to redux state       
            // navigate to user home once sign in is successful
             
        }).catch(error => errorHandling(error));
    }        

    const handleSignUserOut = () => {
        signUserOut().then(result => {
            console.log(result);
            dispatch(resetUserState());
        }).catch(error => console.log(error))
    }

    const handleEmailRegister = () => {   
        if (password === confirmPassword) {
            if (register) {                   
                setSecondModal(true);
                signInWithEmail(true, email, password)
                .then(response => {       
                    typeof response === "string" ? errorHandling(response) : handleCheckUser('password')     
                }).catch(error => console.log(error)) 
            } else {
                setMessage('');
                setRegister(true);
            }   
        } else {
            setSecondModal(true);
            errorHandling('auth/password-mismatch');
        }                   
    }

    const handleEmailSignIn = () => {
        setMessage('');
        setRegister(false);
        setSecondModal(true);
        signInWithEmail(false, email, password)
        .then(response => {       
            typeof response === "string" ? errorHandling(response) : handleCheckUser('password')         
        }).catch(error => console.log(error))     
    }

    const handleCreate = () => {
        setMessage('');
        setSecondModal(false);
        setRegister(true);
        setCreateNewAccount(false);
    }
    const handleCheckUser = async (authType) => {
        setLoading(true);
        setMessage('Getting everything set up.')    
        setPasswordInputModal(false);    
        setRegister(false); 
        checkUser().then(result => {                            
            dispatch(setUserName(result.displayName));
            dispatch(setEmail(result.email));
            dispatch(setPhone(result.phoneNumber));
            dispatch(setProfilePicture(result.photoURL));
            dispatch(setUid(result.uid));    
            dispatch(setAuthType(authType));
            setTimeout(() => {
                navigate("/UserHome");    
            }, 2000);
            
    
        }).catch(error => errorHandling(error));
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
                setCreateNewAccount(true);
                break;
            default:
                console.log('something went wrong');
                setMessage('Terribly sorry, something went wrong on our end, please try again later.')
                break;
        }
    }


    return (
        <div 
            className='bg-image min-vh-100'
            style={{backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')"}}
            >                       
            <MDBModal staticBackdrop show={!secondModal}>
                <MDBModalDialog size='lg' centered>
                    <MDBModalContent>
                        <MDBModalHeader>
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
            </MDBModal>   

            <MDBModal show={secondModal} staticBackdrop={register} setShow={setSecondModal}>
                <MDBModalDialog size='lg' centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                            Second Modal
                            <MDBBtn
                                className='btn-close'
                                color='none'
                                onClick={() => setSecondModal(!secondModal)}
                            >

                            </MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody className='d-grid gap-3'>
                            {message}
                            {passwordInputModal && (<MDBInput required label='Password' id='typePassword' type='password' size='lg' onChange={handlePassword}/>)}  
                            {passwordInputModal && (<MDBBtn onClick={handleEmailSignIn}>Sign In</MDBBtn>)}
                            {passwordInputModal && (<MDBBtn color='link'>Forgot your password?</MDBBtn>)}
                            {createNewAccount && (<MDBBtn onClick={handleCreate}>Yes</MDBBtn>)}
                            {loading && (<MDBSpinner role='status'></MDBSpinner>)}                            
                                           
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>   
            </MDBModal>                                                    
        </div>
    )
}

export default SignIn;