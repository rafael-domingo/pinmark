import { MDBSpinner } from 'mdb-react-ui-kit';
import React from 'react';

function Loading() {

    return (
        <div
            className='min-vh-100 d-flex justify-content-center align-items-center'
           style={{
            background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
           }} 
        >
            <MDBSpinner/>
        </div>
    )
}

export default Loading;