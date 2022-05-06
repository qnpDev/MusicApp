import React, { useEffect, useState } from 'react';
import Loading from '../loading';
import api from '../../axios'
import { useNavigate } from 'react-router-dom';
import CrawlSongTool from './tool/crawlSong';
const Admin = () => {
    document.title = 'Admin Panel'
    const navigate = useNavigate()
    const [data, setData] = useState()
    useEffect(() => {
        api.get('api/admin/home').then(res=>{
            if(res.status === 200){
                setData(res.data)
            }
        })
    }, [])
    if(!data)
        return ( <Loading/> )
    return (
        <>
            <div className='row'>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total user
                        </div>
                        <h1 className='card-body'>
                            {data.user}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button onClick={() => navigate('/admin/user')} className='btn btn-sm bg-gradient-info'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total song
                        </div>
                        <h1 className='card-body'>
                            {data.song}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button onClick={() => navigate('/admin/song')} className='btn btn-sm bg-gradient-warning'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total request song
                        </div>
                        <h1 className='card-body'>
                            {data.request}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button onClick={() => navigate('/admin/request-song')} className='btn btn-sm bg-gradient-success'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total album
                        </div>
                        <h1 className='card-body'>
                            {data.album}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button onClick={() => navigate('/admin/album')} className='btn btn-sm bg-gradient-danger'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total draft song
                        </div>
                        <h1 className='card-body'>
                            {data.draft}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button disabled={true} className='btn btn-sm bg-gradient-primary'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total banner
                        </div>
                        <h1 className='card-body'>
                            {data.banner}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button onClick={() => navigate('/admin/banner')} className='btn btn-sm bg-gradient-secondary'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total admin
                        </div>
                        <h1 className='card-body'>
                            {data.admin}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button onClick={() => navigate('/admin/user')} className='btn btn-sm bg-gradient-info'>Manage</button>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 col-md-6 col-12'>
                    <div className='card mb-4 d-flex justify-content-center align-items-center'>
                        <div className='card-header fw-bold pb-0'>
                            Total category
                        </div>
                        <h1 className='card-body'>
                            {data.category}
                        </h1>
                        <div className='card-footer pt-0'>
                            <button onClick={() => navigate('/admin/category')} className='btn btn-sm bg-gradient-warning'>Manage</button>
                        </div>
                    </div>
                </div>
            </div>
            <CrawlSongTool />
        </>
    );
};

export default Admin;