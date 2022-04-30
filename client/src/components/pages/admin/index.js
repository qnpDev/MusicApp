import React, { useEffect, useState } from 'react';
import Loading from '../loading';
import NotPermission from '../notpermission';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    document.title = 'Admin Panel'
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [per, setPer] = useState(true)

    useEffect(() => {
        api.get('api/admin/home').then(res=>{
            if(res.status === 403)
                setPer(false)
            if(res.status === 200){
                setData(res.data)
            }
        })
    }, [])
    if(!per){
        return ( <NotPermission/> )
    }
    if(!data)
        return ( <Loading/> )
    return (
        <>
            <div className='row'>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total user
                        </div>
                        <h1 className='card-body'>
                            {data.user}
                        </h1>
                        <div className='card-footer'>
                            <button className='btn btn-sm bg-gradient-info'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total song
                        </div>
                        <h1 className='card-body'>
                            {data.song}
                        </h1>
                        <div className='card-footer'>
                            <button onClick={() => navigate('/admin/song')} className='btn btn-sm bg-gradient-warning'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total request song
                        </div>
                        <h1 className='card-body'>
                            {data.request}
                        </h1>
                        <div className='card-footer'>
                            <button className='btn btn-sm bg-gradient-success'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total album
                        </div>
                        <h1 className='card-body'>
                            {data.album}
                        </h1>
                        <div className='card-footer'>
                            <button className='btn btn-sm bg-gradient-danger'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total draft song
                        </div>
                        <h1 className='card-body'>
                            {data.draft}
                        </h1>
                        <div className='card-footer'>
                            <button className='btn btn-sm bg-gradient-primary'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total banner
                        </div>
                        <h1 className='card-body'>
                            {data.banner}
                        </h1>
                        <div className='card-footer'>
                            <button className='btn btn-sm bg-gradient-secondary'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total admin
                        </div>
                        <h1 className='card-body'>
                            {data.admin}
                        </h1>
                        <div className='card-footer'>
                            <button className='btn btn-sm bg-gradient-info'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold'>
                            Total category
                        </div>
                        <h1 className='card-body'>
                            {data.category}
                        </h1>
                        <div className='card-footer'>
                            <button className='btn btn-sm bg-gradient-warning'>Manage</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Admin;