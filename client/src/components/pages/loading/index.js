import React from 'react';
import ReactLoading from 'react-loading'
import './style.css'
const Loading = () => {
    return (
        <div className='loading'>
            <div className='centervh'>
                <div className='centervh-content'>
                    <ReactLoading type='spinningBubbles' color='red' className='centervh-item' />
                </div>
            </div>
        </div>
    );
};

export default Loading;