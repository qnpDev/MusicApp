import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from 'react-js-pagination';
import { toast } from 'react-toastify';
import api from '../../../axios'
import convertDateTime from '../../../helper/ConvertDateTime';
import Loading from '../../loading';
import NotPermission from '../../notpermission';
import Create from './Create';
import Update from './Update';

const AdminCategory = () => {
    document.title = 'Category Manager | Admin'
    const [data, setData] = useState()
    const [per, setPer] = useState(true)
    const limit = 10
    const [curPage, setCurPage] = useState(1)

    const handleChangeShow = id => {
        const load = toast.loading('Wait...')
        api.put('api/admin/category/show?id='+id).then(res=> {
            toast.dismiss(load)
            if(res.data.success){
                setData(prev => ({
                    ...prev,
                    data: prev.data.map(ele => ele.id === id ? ({
                        ...ele,
                        show: res.data.data.show,
                    }) : ele)
                }))
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
                            <p>You want to delete this category?<br/>
                            Delete this album also delete all song in this category!</p>
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
                    <Update data={e} setData={setData} close={onClose}/>
                );
            }
        });
    }
    const handleCreate = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Create setData={setData} close={onClose}/>
                );
            }
        });
    }
    const apiDelete = (e, close) => {
        const load = toast.loading('wait...')
            api.delete('api/admin/category?id=' + e.id).then(res => {
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
        api.get('api/admin/category', {
            params : {
                page: curPage,
                limit,
            }
        }).then(res=> {
            if(!res.data){
                setPer(false)
            }else{
                setData(res.data)
            }
        })
    }, [curPage])
    if(!per)
        return ( <NotPermission/> )
    if(!data)
        return ( <Loading/> )
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Category Manager | Admin</h6>
                        </div>
                        <div
                            onClick={handleCreate}
                            className='btn btn-info btn-sm'>Create new category</div>
                    </div>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0'>
                            <thead>
                                <tr>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Category</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Tag</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Status</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Created at</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((e, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className='d-flex px-2 py-1'>
                                                <div>
                                                    <img src={e.localAvatar === 1
                                                        ? process.env.REACT_APP_API_SRC_CATEGORY_IMG + e.avatar
                                                        : e.avatar
                                                        } className='avatar avatar-sm me-3' alt={e.name} />
                                                </div>
                                                <div className='d-flex flex-column justify-content-center'>
                                                    <h6 className='mb-0 text-sm wraptext'>{e.name}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='align-middle'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.tag}</span>
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
                                                <div onClick={() => handleUpdate(e)} className='btn btn-sm btn-outline-info m-0 mx-1 px-2'>Edit</div>
                                                {e.show === 1
                                                    ? (
                                                        <div onClick={() => handleChangeShow(e.id)} className='btn btn-sm btn-outline-secondary m-0 mx-1 px-2'>Hide</div>
                                                    )
                                                    : (
                                                        <div onClick={() => handleChangeShow(e.id)} className='btn btn-sm btn-outline-success m-0 mx-1 px-2'>Show</div>
                                                    )}
                                                <div onClick={() => handleDelete(e)} className='btn btn-sm btn-outline-danger m-0 mx-1 px-2'>Delete</div>
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

export default AdminCategory;