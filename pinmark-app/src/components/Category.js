
import React from 'react';
import { 
    MDBCard, 
    MDBCardBody, 
    MDBCardText,
    MDBIcon 
} from 'mdb-react-ui-kit';

function Category({category, background}) {
    const categoryIcons = [
        {
            category: 'coffee',
            icon: 'coffee'
        },
        {
            category: 'night-life',
            icon: 'moon'
        },
        {
            category: 'food',
            icon: 'utensils'
        },
        {
            category: 'lodging',
            icon: 'hotel'
        },
        {
            category: 'other',
            icon: 'ellipsis-h'
        },
        {
            category: 'shopping',
            icon: 'shopping-bag'
        },
        {
            category: 'tourist-attraction',
            icon: 'archway'
        }
    ];
    var icon = '';
    categoryIcons.map((cat) => {        
        if (cat.category === category) {
            icon = cat.icon;
        }
    })    

    return (
        <MDBCard className='h-100' background={background}>
            <MDBCardBody>
                <MDBIcon icon={icon}/>
                <MDBCardText>{category}</MDBCardText>
            </MDBCardBody>
        </MDBCard>
    )
}

export default Category;