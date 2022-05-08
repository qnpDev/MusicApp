import React, { useContext, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'
import { UserContext } from '../../contexts/UserContext';
import Loading from '../loading';

function convertDateTime(str) {
    var date = new Date(Date.parse(str)),
        mnth = ('0' + (date.getMonth() + 1)).slice(-2),
        day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('-');
}


const ListSong = () => {
    const navigate = useNavigate()
    const [data, setData] = useState()
    const { dataUser } = useContext(UserContext)
    const [curPage, setCurPage] = useState(1)
    const limit = 6
    
    const handleChangeShow = (id, index) => {
        api.put('api/Manage/song/show?id='+id).then(res=> {
            if(res.data.success){
                let temp = data.song
                temp[index].song.show = res.data.data.show
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
                            <p>You want to delete this song?</p>
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

    const apiDelete = (e, close) => {
        const load = toast.loading('wait...')
            api.delete('api/Manage/song/delete?id=' + e.song.id).then(res => {
                toast.dismiss(load)
                if (res.data.success) {
                    setData(prev => ({
                        songLength: prev.length - 1,
                        song: prev.song.filter(ele => ele.song.id !== e.song.id)
                    }))
                    close()
                    toast.success('Successful!')
                } else {
                    toast.error('Fail!')
                }
            })

    }
    useEffect(() => {
        if (dataUser)
            api.get('api/Manage/song/getsong', {
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
                            <h6>Songs</h6>
                        </div>
                        <div
                            onClick={() => navigate('/manage/upload-song')}
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
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Status</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Listen</th>
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
                                                    <img src={e.song.localImg === 1 
                                                        ? process.env.REACT_APP_API_SRC_AUDIO_IMG + e.song.img
                                                        : e.song.img
                                                    } className='avatar avatar-sm me-3' alt={e.song.name} />
                                                </div>
                                                <div className='d-flex flex-column justify-content-center'>
                                                    <h6 className='mb-0 text-sm warptext'>{e.song.name}</h6>
                                                    <p className='text-xs text-secondary mb-0 warptext'>{e.song.artist}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {e.album.id === -1
                                                ? (
                                                    <span className='text-secondary text-xs font-weight-bold'>null</span>
                                                )
                                                : (
                                                    <>
                                                        <p className='text-xs font-weight-bold mb-0 warptext'>{e.album.name}</p>
                                                        <p className='text-xs text-secondary mb-0 warptext'>{e.album.artist}</p>
                                                    </>

                                                )}
                                        </td>
                                        <td className='align-middle warptext'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.category.name}</span>
                                        </td>
                                        <td className='align-middle text-center text-sm cursor-default'>
                                            {e.song.show === 0
                                                ? (<span className='badge badge-sm bg-gradient-secondary'>Hide</span>)
                                                : (<span className='badge badge-sm bg-gradient-success'>Show</span>)
                                            }
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.song.listen}</span>
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.song.createdAt)}</span>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                                {e.song.show === 1
                                                    ? (
                                                        <div onClick={() => handleChangeShow(e.song.id, i)} className='btn btn-sm btn-outline-secondary m-0 mx-1 px-3'>Hide</div>
                                                    )
                                                    : (
                                                        <div onClick={() => handleChangeShow(e.song.id, i)} className='btn btn-sm btn-outline-success m-0 mx-1 px-3'>Show</div>
                                                    )}
                                                <div onClick={() => handleDelete(e)} className='btn btn-sm btn-outline-danger m-0 mx-1 px-3'>Delete</div>
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

export default ListSong;