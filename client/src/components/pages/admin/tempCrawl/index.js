import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from 'react-js-pagination';
import { toast } from 'react-toastify';
import api from '../../../axios'
import convertDateTime from '../../../helper/ConvertDateTime';
import Loading from '../../loading';
import NotPermission from '../../notpermission';
import SaveASongTempCrawl from './SaveASong';

const TempCrawl = () => {
    document.title = 'Temp Crawl Manager | Admin'
    const [data, setData] = useState()
    const [per, setPer] = useState(true)
    const limit = 10
    const [curPage, setCurPage] = useState(1)
    const [listCategory, setListCategory] = useState()
    const [listAlbum, setListAlbum] = useState()

    const handleClear = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to clear this?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-danger mx-1'
                                    onClick={() => apiClear(onClose)}
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
    const handleDelete = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to delete this album?</p>
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
    const handleSave = (e, i) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <SaveASongTempCrawl data={e} index={i} listCategory={listCategory} listAlbum={listAlbum} setData={setData} close={onClose} />
                );
            }
        });
    }
    const apiClear = close => {
        const load = toast.loading('wait...')
        api.delete('api/admin/temp-crawl').then(res => {
            toast.dismiss(load)
            if (res.data.success) {
                setData({
                    size: 0,
                    data: [],
                })
                close()
                toast.success('successful!')
            } else {
                toast.error('fail!')
            }
        })
    }
    const apiDelete = (e, close) => {
        const load = toast.loading('wait...')
        api.delete('api/admin/temp-crawl?id=' + e.id).then(res => {
            toast.dismiss(load)
            if (res.data.success) {
                setData(prev => ({
                    size: prev.size - 1,
                    data: prev.data.filter(ele => ele.id !== e.id)
                }))
                close()
                toast.success('successful!')
            } else {
                toast.error('fail!')
            }
        })
    }

    useEffect(() => {
        api.get('api/admin/temp-crawl', {
            params: {
                page: curPage,
                limit,
            }
        }).then(res => {
            if (!res.data) {
                setPer(false)
            } else {
                setData(res.data)
            }
        })
    }, [curPage])
    useEffect(() => {
        api.get('api/admin/home/allalbum').then(res => {
            setListAlbum(res.data)
        })
        api.get('api/admin/home/allcategory').then(res => {
            setListCategory(res.data)
        })
    }, [])
    if (!per)
        return (<NotPermission />)
    if (!data)
        return (<Loading />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Album Manager | Admin</h6>
                        </div>
                        <div
                            onClick={handleClear}
                            className='btn bg-gradient-danger btn-sm'>Clear</div>
                    </div>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    {data.size === 0 ? (
                        <div className=' my-5 d-flex justify-content-center align-items-center'>There have no song!</div>
                    ) : (
                        <div className='table-responsive p-0'>
                            <table className='table align-items-center mb-0'>
                                <thead>
                                    <tr>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song</th>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Img</th>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Src</th>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>CreatedBy</th>
                                        <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>CreatedAt</th>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((e, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className='d-flex px-2 py-1'>
                                                    <div>
                                                        <img src={e.img} className='avatar avatar-sm me-3' alt={e.name} />
                                                    </div>
                                                    <div className='d-flex flex-column justify-content-center'>
                                                        <h6 className='mb-0 text-sm wraptext'>{e.name}</h6>
                                                        <p className='text-xs text-secondary mb-0 wraptext'>{e.artist}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='align-middle'>
                                                <span className='text-secondary text-xs font-weight-bold wraptext'>{e.img}</span>
                                            </td>
                                            <td className='align-middle'>
                                                <span className='text-secondary text-xs font-weight-bold wraptext'>{e.src}</span>
                                            </td>
                                            <td className='align-middle'>
                                                <span className='text-secondary text-xs font-weight-bold wraptext'>{e.uId}</span>
                                            </td>
                                            <td className='align-middle text-center'>
                                                <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.createdAt)}</span>
                                            </td>
                                            <td className='align-middle'>
                                                <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                                    <div onClick={() => handleSave(e, i)} className='btn btn-sm bg-gradient-success m-0 mx-1 px-2'>Save</div>
                                                    <div onClick={() => handleDelete(e)} className='btn btn-sm bg-gradient-danger m-0 mx-1 px-2'>Delete</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
                {data.size > 6 && (
                    <div className='card-footer d-flex justify-content-end'>
                        <Pagination
                            activePage={curPage}
                            itemsCountPerPage={limit}
                            totalItemsCount={data.size}
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

export default TempCrawl;