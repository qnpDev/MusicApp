import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'

const NotFound = () => {
    return (
        <div className='notfound'>
            <div className='card p-3 m-5'>
                <div className='card-body text-center'>
                    <h1 className='text-danger'>404</h1>
                    <br />
                    <div className='fw-bolder'>
                        The requested URL was not found on this server. Plese check again!
                    </div>
                    <br />
                    <Link to='/'><button className='btn btn-info'>Back to home</button></Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;