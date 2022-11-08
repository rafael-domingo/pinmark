import React from 'react';
import { 
    MDBModalHeader,
    MDBRow,
    MDBCol,
    MDBModalBody, 
    MDBModalTitle,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBIcon,
    MDBCard,
    MDBCardBody   
} from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from '../redux/pinmarkSlice';
import { resetUserState } from '../redux/userSlice';
import { resetSharedState } from '../redux/sharedSlice';
import { Navigate } from 'react-router-dom';
import { signUserOut } from '../util/Firebase';

function AccountModal({handleCloseModal, handleDeleteAccountModal}) {
    const userState = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(resetState());
        dispatch(resetUserState());
        dispatch(resetSharedState());
        signUserOut();
        return <Navigate to='/' replace />
    }

    return (
        <>
        <MDBModalHeader>
            <MDBRow className='w-100'>
                <MDBCol className='d-flex justify-content-between align-items-center'>
                    <MDBModalTitle>Account Settings</MDBModalTitle>
                </MDBCol>
            </MDBRow>
        </MDBModalHeader>
        <MDBModalBody style={{minHeight: '500px'}}>
            <MDBRow>
                <MDBCol size={12}>                
                    <MDBCard>
                    <MDBCardBody>
                        <div className='d-flex align-items-center'>
                            {
                                userState.profilePicture && (
                                    <img
                                        src={userState.profilePicture}
                                        alt=''
                                        style={{ width: '45px', height: '45px' }}
                                        className='rounded-circle'
                                    />
                                )
                            }
                            {
                                !userState.profilePicture && (
                                    <MDBIcon
                                        icon='user-circle'
                                        size='3x'                                   
                                    />
                                )
                            }
                       
                        <div className='ms-3 d-flex justify-content-start flex-wrap'>
                            <p className='fw-bold mb-1 w-100' style={{textAlign: 'left'}}>{userState.userName}</p>
                            <p className='text-muted mb-0 w-100' style={{textAlign: 'left'}}>{userState.email}</p>
                        </div>
                        </div>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
            <MDBRow style={{marginTop: '20px'}}>
                <MDBCol size={12} className='d-flex justify-content-end'>                  
                    <MDBBtn 
                        onClick={() => handleSignOut()} 
                        tag='a' 
                        color='light' 
                        className='text-dark' 
                        style={{padding: 10, margin: 10}}>
                        Sign Out
                        <MDBIcon style={{margin: 10}} color='primary' icon='sign-out-alt'/>
                    </MDBBtn>                                
                    <MDBBtn 
                        onClick={() => handleDeleteAccountModal(true)} 
                        tag='a'
                        color='light' 
                        className='text-dark' 
                        style={{padding: 10, margin: 10}}>
                        Delete Account
                        <MDBIcon style={{margin: 10}} color='danger' icon='user-times'/>
                    </MDBBtn>                       
                </MDBCol>
            </MDBRow>
           
        </MDBModalBody>
        <MDBBtn 
            size='lg' 
            floating 
            tag='a' 
            style={{position:'absolute', bottom: 30, right: 30}}
            onClick={() => handleCloseModal(false)}
        >
            <MDBIcon fas icon='times'/>
        </MDBBtn>

        {/* Delete Account Confirmation Modal */}
        {/* <MDBModal staticBackdrop show={deleteAccountModal} setShow={setDeleteAccountModal}>
            <MDBModalDialog
                centered
                scrollable                
                className='justify-content-center align-item-center'
                >            
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Delete Your Account?</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <p>Are you sure you want to delete your account?</p>
                        <p className='text-muted'>This cannot be undone and all of your data will be deleted.</p>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn onClick={() => setDeleteAccountModal(false)}>Cancel</MDBBtn>
                        <MDBBtn color='danger' onClick={() => handleDeleteAccount()}>Delete My Account</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal> */}
        </>
    )
}

export default AccountModal;
