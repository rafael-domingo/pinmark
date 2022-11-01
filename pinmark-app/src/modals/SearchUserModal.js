import e from 'cors';
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
import { fetchUserInfo } from '../util/Firebase';

function SearchUserModal({openModal, tripObject, handleAddSharedUser, handleRemoveSharedUser, handleCloseModal}) {
const [firebaseUsers, setFirebaseUsers] = React.useState([]);
const [filteredUsers, setFilteredUsers] = React.useState([]);
const [value, setValue] = React.useState('');
const [addUsersState, setAddUsersState] = React.useState([]);

const handleInput = (e) => {
    setValue(e.target.value); 
    console.log(e.target.value);
    filterUsers();
}

const fetchUsers = () => {
    fetchUserInfo()
    .then(result => {
        console.log(result)
        setFirebaseUsers(result);   
        setFilteredUsers(result);     
    })
 
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

const handleAddUser = (user) => {
    handleAddSharedUser(user);        
    const newUsersState = addUsersState;
    newUsersState.push(user.uid);
    console.log(newUsersState);
    setAddUsersState(newUsersState);
    
}

const handleRemoveUser = (user) => {
    handleRemoveSharedUser(user);
    var index = addUsersState.indexOf(user.uid);
    const newUsersState = addUsersState;
    if (index !== -1) {
        newUsersState.splice(index, 1);
    }    
    console.log(newUsersState);
    setAddUsersState(newUsersState);
}

const checkUser = () => {
    var checkedUsers = [];
    if (tripObject.trip?.sharedWith) {
        firebaseUsers.map((user) => {
            tripObject.trip.sharedWith.map((uid) => {
                if (uid === user.uid) {
                    checkedUsers.push(uid);
                }
            })
        })
    }
    setAddUsersState(checkedUsers);
}

React.useEffect(() => {
    
    fetchUsers();
    
}, [tripObject])

React.useEffect(() => {
    checkUser();
}, [openModal])
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
                                                <MDBBtn onClick={() => handleRemoveUser(user)}>Remove User</MDBBtn>                                            
                                            )
                                        }     
                                        {
                                            (!addUsersState.includes(user.uid)) && (
                                                <MDBBtn onClick={() => handleAddUser(user)}>Add User</MDBBtn>                                            
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
            <MDBModalFooter>
                
            </MDBModalFooter>

        </>
    )
}

export default SearchUserModal;