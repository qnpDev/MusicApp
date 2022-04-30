import React, { useContext, useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'
import { UserContext } from '../../contexts/UserContext';
import Loading from '../loading';
import convertDateTime from '../../helper/ConvertDateTime'
import { confirmAlert } from 'react-confirm-alert';
import UpdateAlbum from './UpdateAlbum';

const ListAlbum = () => {
    const navigate = useNavigate()
    const [data, setData] = useState()
    const { dataUser } = useContext(UserContext)
    const [curPage, setCurPage] = useState(1)
    const limit = 6

    const handleChangeShow = (id, index) => {
        api.put('api/Manage/album/show?id='+id).then(res=> {
            if(res.data.success){
                let temp = data.album
                temp[index].show = res.data.data.show
                setData(prev => ({...prev, temp}))
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
            }
        })
    }
    const handleDelete = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to delete this album?<br/>
                            Delete this album also delete all song in this album!</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-danger mx-1'
                                    onClick={() => apiDelete(e, onClose)}
                                >
                                    Yes
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
                    <UpdateAlbum data={e} setData={setData} close={onClose}/>
                );
            }
        });
    }
    const apiDelete = (e, close) => {
        const load = toast.loading('wait...')
            api.delete('api/Manage/album/delete?id=' + e.id).then(res => {
                toast.dismiss(load)
                if (res.data.success) {
                    setData(prev => ({
                        length: prev.length - 1,
                        album: prev.album.filter(ele => ele.id !== e.id)
                    }))
                    close()
                    toast.success('successful!')
                } else {
                    toast.error('fail!')
                }
            })
    }
    useEffect(() => {
        if (dataUser)
            api.get('api/Manage/album/getalbum', {
                params: {
                    id: dataUser.id,
                    page: curPage,
                    limit: limit,
                }
            }).then(res => {
                setData(res.data)
            })
    }, [dataUser, curPage])
    if (!data)
        return (<Loading />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Albums</h6>
                        </div>
                        <div
                            onClick={() => navigate('/manage/create-album')}
                            className='btn btn-info btn-sm'>Create new album</div>
                    </div>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0'>
                            <thead>
                                <tr>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Album</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Status</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Created at</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.album.map((e, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className='d-flex px-2 py-1'>
                                                <div>
                                                    <img src={e.localImg === 1
                                                        ? process.env.REACT_APP_API_SRC_ALBUM_IMG + e.img
                                                        : e.img
                                                        } className='avatar avatar-sm me-3' alt={e.name} />
                                                </div>
                                                <div className='d-flex flex-column justify-content-center'>
                                                    <h6 className='mb-0 text-sm warptext'>{e.name}</h6>
                                                    <p className='text-xs text-secondary mb-0 warptext'>{e.artist}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='align-middle text-center text-sm cursor-default'>
                                            {e.show === 0
                                                ? (<span className='badge badge-sm bg-gradient-secondary'>Hide</span>)
                                                : (<span className='badge badge-sm bg-gradient-success'>Show</span>)
                                            }
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.createdAt)}</span>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                                <div onClick={() => handleUpdate(e)} className='btn btn-sm btn-outline-info m-0 mx-1'>Edit</div>
                                                {e.show === 1
                                                    ? (
                                                        <div onClick={() => handleChangeShow(e.id, i)} className='btn btn-sm btn-outline-secondary m-0 mx-1'>Hide</div>
                                                    )
                                                    : (
                                                        <div onClick={() => handleChangeShow(e.id, i)} className='btn btn-sm btn-outline-success m-0 mx-1'>Show</div>
                                                    )}
                                                <div onClick={() => handleDelete(e)} className='btn btn-sm btn-outline-danger m-0 mx-1'>Delete</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {data.songLength > 6 && (
                <div className='card-footer d-flex justify-content-end'>
                    <Pagination
                        activePage={curPage}
                        itemsCountPerPage={limit}
                        totalItemsCount={data.length}
                        pageRangeDisplayed={2}
                        onChange={setCurPage}
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

export default ListAlbum;