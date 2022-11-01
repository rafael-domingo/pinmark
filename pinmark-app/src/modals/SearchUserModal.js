import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardTitle, 
    MDBInputGroup, 
    MDBModalBody, 
    MDBModalFooter, 
    MDBModalHeader,
    MDBRow,
    MDBCol,
    MDBCardImage,
    MDBCardText,
    MDBIcon,
    MDBBtn
} from 'mdb-react-ui-kit';
import React from 'react';
import { useSelector } from 'react-redux';

function SearchUserModal({tripObject, handleAddSharedUser, handleRemoveSharedUser, handleCloseModal, firebaseUsers}) {
const [filteredUsers, setFilteredUsers] = React.useState([]);
const [value, setValue] = React.useState('');
const [addUsersState, setAddUsersState] = React.useState([]);
const tripListState = useSelector((state) => state.pinmark.tripLists);

const handleInput = (e) => {
    setValue(e.target.value); 
    console.log(e.target.value);
    filterUsers();
}

const filterUsers = () => {    
    var searchUsers = [];
    firebaseUsers.map((user) => {
        if (user.email.toLowerCase().includes(value.toLowerCase())) {
            searchUsers.push(user);
        } else if (value === '') {
            searchUsers.push(user);
        }
    })
    console.log(searchUsers);
    setFilteredUsers(searchUsers);
}

React.useEffect(() => {
    console.log('check list of shared users')
    var userArray = [];
    var sharedWith = [];
    tripListState?.map((trip) => {
        if (trip?.tripId === tripObject?.trip?.tripId) {
            sharedWith = trip?.sharedWith;
        }
    })
   sharedWith.map((user) => {
        userArray.push(user);
    })
    console.log(userArray);
    setAddUsersState(userArray);
}, [tripListState])

    return (
        <>
            <MDBModalHeader>
                <MDBInputGroup className='mb-3' noBorder textBefore={<MDBIcon fas icon='search' />}>
                    <input className='search form-control' type='text' placeholder='Search Users' onChange={handleInput} value={value} style={{border: 'none', boxShadow: 'none'}}/>
                </MDBInputGroup> 
            </MDBModalHeader>
            <MDBModalBody>
                <MDBRow>
                    {
                        filteredUsers.map((user) => {
                            console.log(user?.profilePicture)
                            return (
                                <MDBCol size={12}>
                                    <MDBCard>
                                        <MDBCardBody>
                                        <div className='d-flex align-items-center'>
                                            {
                                                user?.profilePicture && (
                                                <MDBCardImage
                                                    src={user?.profilePicture}
                                                    alt=''
                                                    style={{ width: '45px', height: '45px' }}
                                                    className='rounded-circle'
                                                />
                                                )
                                            }
                                            {
                                                !user?.profilePicture && (
                                                <MDBIcon
                                                    icon='user'                                                                                                        
                                                    size='2x'
                                                    color='light'                                                    
                                                    style={{background: 'gray', width: '50px', height: '50px'}}                                    
                                                    className='ms-1 rounded-circle d-flex justify-content-center align-items-center'
                                                />
                                                )
                                            }
                                            
                                            <div style={{paddingLeft: 20}} className='d-flex justify-content-start align-items-center flex-wrap'>                                                
                                                <MDBCardTitle className='w-100 d-flex justify-content-start'>{user.userName}</MDBCardTitle>
                                                <MDBCardText className='w-100 d-flex justify-content-start text-muted'>{user.email}</MDBCardText>                                                                                                
                                            </div>
                                        </div>     
                                        {
                                            (addUsersState.includes(user.uid)) && (
                                                <MDBBtn onClick={() => handleRemoveSharedUser(user)}>Remove User</MDBBtn>                                            
                                            )
                                        }     
                                        {
                                            (!addUsersState.includes(user.uid)) && (
                                                <MDBBtn onClick={() => handleAddSharedUser(user)}>Add User</MDBBtn>                                            
                                            )
                                        }
                                        
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            )
                        })
                    }
                </MDBRow>
            </MDBModalBody>
                <MDBBtn onClick={() => handleCloseModal()} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                    <MDBIcon fas icon='times'/>
                </MDBBtn>  
            <MDBModalFooter>
                
            </MDBModalFooter>

        </>
    )
}

export default SearchUserModal;