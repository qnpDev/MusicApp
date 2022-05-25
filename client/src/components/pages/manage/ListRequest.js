import React, { useContext, useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'
import { UserContext } from '../../contexts/UserContext';
import Loading from '../loading';
import UpdateSong from './UpdateSong';

function convertDateTime(str) {
    var date = new Date(Date.parse(str)),
        mnth = ('0' + (date.getMonth() + 1)).slice(-2),
        day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('-');
}

const ListRequest = () => {
    const navigate = useNavigate()
    const [dataRequest, setDataRequest] = useState()
    const { dataUser } = useContext(UserContext)
    const [curPageRequest, setCurPageRequest] = useState(1)
    const limit = 6
    const [dataDraft, setDataDraft] = useState()
    const [curPageDraft, setCurPageDraft] = useState(1)
    const [allAlbum, setAllAlbum] = useState()
    const [listCategory, setListCategory] = useState()

    const handleRequest = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to send request this song?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-success mx-1'
                                    onClick={() => apiSendRequest(e, onClose)}
                                >
                                    Yes, Send it!
                                </button>
                            </div>

                        </div>

                    </div>
                );
            }
        });
    }
    const handleMoveDraft = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to move this request to draft?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-info mx-1'
                                    onClick={() => apiMoveDraft(e, onClose)}
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
    const handleDeleteDraft = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to delete this draft?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-danger mx-1'
                                    onClick={() => apiDeleteDraft(e, onClose)}
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
    const handleUpdateDraft = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <UpdateSong data={e} setData={setDataDraft} listAlbum={allAlbum} listCategory={listCategory} close={onClose} />
                );
            }
        });
    }

    const apiSendRequest = (e, close) => {
        const load = toast.loading('Wait...')
            api.put('api/Manage/song/sendrequest?id=' + e.song.id).then(res => {
                toast.dismiss(load)
                if (res.data.success) {
                    setDataDraft(prev => ({
                        draftLength: prev.draftLength - 1,
                        draft: prev.draft.filter(ele => ele.song.id !== e.song.id)
                    }))
                    e.song.status = 1
                    setDataRequest(prev => ({
                        request: [
                            ...prev?.request,
                            e
                        ],
                        requestLength: prev?.requestLength + 1,
                    }))
                    close()
                    toast.success('success!')
                } else {
                    toast.error('fail!')
                }
            })
    }

    const apiMoveDraft = (e, close) => {
        const load = toast.loading('Wait...')
        api.put('api/Manage/song/movedraft?id=' + e.song.id).then(res => {
            toast.dismiss(load)
            if (res.data.success) {
                setDataRequest(prev => ({
                    requesttLength: prev.requestLength - 1,
                    request: prev.request.filter(ele => ele.song.id !== e.song.id)
                }))
                setDataDraft(prev => ({
                    draft: [
                        ...prev?.draft,
                        e
                    ],
                    draftLength: prev?.draftLength + 1,
                }))
                close()
                toast.success('success!')
            } else {
                toast.error('fail!')
            }
        })
    }

    const apiDeleteDraft = (e, close) => {
        const load = toast.loading('Wait...')
        api.delete('api/Manage/song/deletedraft?id=' + e.song.id).then(res => {
            if (res.data.success) {

                setDataDraft(prev => ({
                    draftLength: prev.draftLength - 1,
                    draft: prev.draft.filter(ele => ele.song.id !== e.song.id)
                }))
                toast.success('Delete success!')
                close()
            } else {
                toast.error('Delete fail!')
            }
            toast.dismiss(load)
        })
    }

    useEffect(() => {
        if (dataUser)
            api.get('api/Manage/song/getrequest', {
                params: {
                    id: dataUser.id,
                    page: curPageRequest,
                    limit: limit,
                }
            }).then(res => {
                setDataRequest(res.data)
            })
    }, [dataUser, curPageRequest])
    useEffect(() => {
        if (dataUser)
            api.get('api/Manage/song/getdraft', {
                params: {
                    id: dataUser.id,
                    page: curPageDraft,
                    limit: limit,
                }
            }).then(res => {
                setDataDraft(res.data)
            })
    }, [dataUser, curPageDraft])
    useEffect(() => {
        if (dataUser)
            api.get('api/Album/user', {
                params: {
                    id: dataUser.id
                }
            }).then(res => {
                setAllAlbum(res.data?.data)
            })
    }, [dataUser])
    useEffect(() => {
        api.get('api/Category').then(res => {
            setListCategory(res.data?.data)
        })
    }, [])
    if (!dataRequest || !dataDraft || !allAlbum || !listCategory)
        return (<Loading />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Request Songs</h6>
                        </div>
                        <div
                            onClick={() => navigate('/manage/upload-song')}
                            className='btn btn-warning btn-sm'>Create request song</div>
                    </div>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0'>
                            <thead>
                                <tr>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Album</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Category</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Status</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Upload at</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRequest.request.map((e, i) => (
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
                                                    <h6 className='mb-0 text-sm'>{e.song.name}</h6>
                                                    <p className='text-xs text-secondary mb-0'>{e.song.artist}</p>
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
                                                        {allAlbum.map(ele => ele.id === e.song.album
                                                            ? (
                                                                <span key={ele.id}>
                                                                    <p className='text-xs font-weight-bold mb-0 warptext'>{ele.name}</p>
                                                                    <p className='text-xs text-secondary mb-0 warptext'>{ele.artist}</p>
                                                                </span>
                                                            )
                                                            : null
                                                        )}

                                                    </>

                                                )}
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{listCategory.map(ele => ele.id === e.song.category ? ele.name : null)}</span>
                                        </td>
                                        <td className='align-middle text-center text-sm cursor-default'>
                                            {e.song.status === 2
                                                ? (<span className='badge badge-sm bg-gradient-danger'>Refuse</span>)
                                                : (<span className='badge badge-sm bg-gradient-info'>Requested</span>)
                                            }
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.song.createdAt)}</span>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                                <div onClick={() => handleMoveDraft(e)} className='btn btn-sm btn-outline-secondary m-0 mx-1 px-2'>Move draft</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {dataRequest.requestLength > limit && (
                    <div className='card-footer d-flex justify-content-end'>
                        <Pagination
                            activePage={curPageRequest}
                            itemsCountPerPage={limit}
                            totalItemsCount={dataRequest.requestLength}
                            pageRangeDisplayed={2}
                            onChange={e => setCurPageRequest(e)}
                            itemClass='page-item cursor-pointer'
                            linkClass='page-link cursor-default'
                            innerClass='pagination pagination-warning'
                            disabledClass='page-item disabled'
                            hideDisabled={true}
                        />
                    </div>
                )}
            </div>

            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Draft Songs</h6>
                        </div>
                        <div
                            onClick={() => navigate('/manage/upload-song')}
                            className='btn btn-secondary btn-sm'>Create draft song</div>
                    </div>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0'>
                            <thead>
                                <tr>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Album</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Category</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Upload at</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataDraft.draft.map((e, i) => (
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
                                                    <h6 className='mb-0 text-sm'>{e.song.name}</h6>
                                                    <p className='text-xs text-secondary mb-0'>{e.song.artist}</p>
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
                                                        {allAlbum.map(ele => ele.id === e.song.album
                                                            ? (
                                                                <span key={ele.id}>
                                                                    <p className='text-xs font-weight-bold mb-0 warptext'>{ele.name}</p>
                                                                    <p className='text-xs text-secondary mb-0 warptext'>{ele.artist}</p>
                                                                </span>
                                                            )
                                                            : null
                                                        )}
                                                    </>

                                                )}
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{listCategory.map(ele => ele.id === e.song.category ? ele.name : null)}</span>
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.song.createdAt)}</span>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                                <div onClick={() => handleUpdateDraft(e.song)} className='btn btn-sm btn-outline-info m-0 mx-1 px-2'>Edit</div>
                                                <div onClick={() => handleRequest(e)} className='btn btn-sm btn-outline-success m-0 mx-1 px-2'>Request</div>
                                                <div onClick={() => handleDeleteDraft(e)} className='btn btn-sm btn-outline-danger m-0 mx-1 px-2'>Delete</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {dataDraft.draftLength > limit && (
                    <div className='card-footer d-flex justify-content-end'>
                        <Pagination
                            activePage={curPageDraft}
                            itemsCountPerPage={limit}
                            totalItemsCount={dataDraft.draftLength}
                            pageRangeDisplayed={2}
                            onChange={e => setCurPageDraft(e)}
                            itemClass='page-item cursor-pointer'
                            linkClass='page-link cursor-default'
                            innerClass='pagination pagination-secondary'
                            disabledClass='page-item disabled'
                            hideDisabled={true}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default ListRequest;