import React from 'react';
import { Link } from 'react-router-dom';

const NotPermission = () => {
    return (
        <div className='notfound'>
            <div className='card p-3 m-5'>
                <div className='card-body text-center'>
                    <h1 className='text-danger'>401</h1>
                    <br />
                    <div className=''>
                        You have no permission to go there!
                    </div>
                    <br />
                    <Link to='/'><button className='btn btn-info'>Back to home</button></Link>
                </div>
            </div>
        </div>
    );
};

export default NotPermission;