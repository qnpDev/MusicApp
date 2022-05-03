import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../axios'
import convertDateTime from '../../../helper/ConvertDateTime';
import Loading from '../../loading';
import NotPermission from '../../notpermission';
import Update from './Update';

const AdminRequestSong = () => {
    document.title = 'Song Request Manager | Admin'
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [listCategory, setListCategory] = useState()
    const [listAlbum, setListAlbum] = useState()
    const [per, setPer] = useState(true)
    const limit = 10
    const [curPage, setCurPage] = useState(1)

    const handleDelete = id => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to delete this song?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-danger mx-1'
                                    onClick={() => apiDelete(id, onClose)}
                                >
                                    Yes!
                                </button>
                            </div>

                        </div>

                    </div>
                );
            }
        });
    }

    const handleUpdate = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Update data={e} setData={setData} listAlbum={listAlbum} listCategory={listCategory} close={onClose} />
                );
            }
        });
    }

    const handleAccept = id => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to accept this song?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-success mx-1'
                                    onClick={() => apiAccept(id, onClose)}
                                >
                                    Yes!
                                </button>
                            </div>

                        </div>

                    </div>
                );
            }
        });
    }
    const handleRefuse = id => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to refuse this song?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-info mx-1'
                                    onClick={() => apiRefuse(id, onClose)}
                                >
                                    Yes!
                                </button>
                            </div>

                        </div>

                    </div>
                );
            }
        });
    }
    const apiAccept = (id, close) => {
        close()
        const load = toast.loading('Wait...')
        api.post('api/admin/request?id='+id+'&type=accept').then(res => {
            toast.dismiss(load)
            if(res.data.success){
                setData(prev => ({
                    ...prev,
                    song: prev.song.filter(ele => ele.id !== id)
                }))
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
            }
        })
    }
    const apiRefuse = (id, close) => {
        close()
        const load = toast.loading('Wait...')
        api.post('api/admin/request?id='+id+'&type=refuse').then(res => {
            toast.dismiss(load)
            if(res.data.success){
                setData(prev => ({
                    ...prev,
                    song: prev.song.filter(ele => ele.id !== id)
                }))
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
            }
        })
    }

    const apiDelete = (id, close) => {
        close()
        const load = toast.loading('Wait...')
        api.delete('api/admin/request?id='+id).then(res => {
            toast.dismiss(load)
            if(res.status === 200 || res.data.success){
                setData(prev => ({
                    ...prev,
                    song: prev.song.filter(ele => ele.id !== id)
                }))
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
            }
        })
    }

    useEffect(() => {
        api.get('api/admin/request', {
            params : {
                page: curPage,
                limit,
            }
        }).then(res=> {
            if(res.status === 403){
                setPer(false)
            }
            if(res.status === 200){
                setData(res.data)
            }
        })
    }, [curPage])
    useEffect(() => {
        api.get('api/admin/home/allalbum').then(res => {
            if(res.status === 403){
                setPer(false)
            }else{
                setListAlbum(res.data)
            }
        })
        api.get('api/admin/home/allcategory').then(res => {
            if(res.status === 403){
                setPer(false)
            }else{
                setListCategory(res.data)
            }
        })
    } ,[])
    if(!per)
        return ( <NotPermission/> )
    if(!data || !listAlbum || !listCategory)
        return ( <Loading/> )
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Songs</h6>
                        </div>
                        <div
                            onClick={() => navigate('/admin/song/create')}
                            className='btn btn-info btn-sm'>Upload new song</div>
                    </div>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0'>
                            <thead>
                                <tr>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Album</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Category</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Tag</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Upload at</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.song.map((e, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className='d-flex px-2 py-1'>
                                                <div>
                                                    <img src={e.localImg === 1 
                                                        ? process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img
                                                        : e.img
                                                    } className='avatar avatar-sm me-3' alt={e.name} />
                                                </div>
                                                <div className='d-flex flex-column justify-content-center'>
                                                    <h6 className='mb-0 text-sm warptext'>{e.name}</h6>
                                                    <p className='text-xs text-secondary mb-0 warptext'>{e.artist}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {e.album
                                                ? (
                                                    <>
                                                        {listAlbum.map(ele => ele.id === e.album
                                                            ? (
                                                                <span key={ele.id}>
                                                                    <p className='text-xs font-weight-bold mb-0 warptext'>{ele.name}</p>
                                                                    <p className='text-xs text-secondary mb-0 warptext'>{ele.artist}</p>
                                                                </span>
                                                            )
                                                            : null
                                                        )}

                                                    </>
                                                )
                                                : (
                                                    <span className='text-secondary text-xs font-weight-bold'>null</span>

                                                )}
                                        </td>
                                        <td className='align-middle warptext'>
                                            <span className='text-secondary text-xs font-weight-bold'>
                                                {listCategory.map(ele => ele.id === e.category ? ele.name : null)}
                                            </span>
                                        </td>
                                        <td className='align-middle text-sm warptext'>
                                            {e.tag}
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.createdAt)}</span>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                            <div onClick={() => handleAccept(e.id)} className='btn btn-sm bg-gradient-success m-0 mx-1 px-2'>Accept</div>
                                            <div onClick={() => handleRefuse(e.id)} className='btn btn-sm bg-gradient-secondary m-0 mx-1 px-2'>Refuse</div>
                                            <div onClick={() => handleUpdate(e)} className='btn btn-sm bg-gradient-info m-0 mx-1 px-2'>Edit</div>
                                            <div onClick={() => handleDelete(e.id)} className='btn btn-sm bg-gradient-danger m-0 mx-1 px-2'>Delete</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {data.songLength > limit && (
                <div className='card-footer d-flex justify-content-end'>
                    <Pagination
                        activePage={curPage}
                        itemsCountPerPage={limit}
                        totalItemsCount={data.songLength}
                        pageRangeDisplayed={2}
                        onChange={e => setCurPage(e)}
                        itemClass='page-item cursor-pointer'
                        linkClass='page-link cursor-default'
                        innerClass='pagination pagination-info'
                        disabledClass='page-item disabled'
                        hideDisabled={true}
                    />
                </div>
                )}
            </div>
        </>
    );
};

export default AdminRequestSong;