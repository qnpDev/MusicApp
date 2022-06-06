import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import Pagination from 'react-js-pagination';
import { toast } from 'react-toastify';
import api from '../../../axios'
import convertDateTime from '../../../helper/ConvertDateTime';
import Loading from '../../loading';
import NotPermission from '../../notpermission';
import Create from './View';
import Update from './Update';

const AdminUser = () => {
    document.title = 'User Manager | Admin'
    const [data, setData] = useState()
    const [per, setPer] = useState(true)
    const limit = 10
    const [curPage, setCurPage] = useState(1)

    const handleDelete = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to delete this account?</p>
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

    const handleban = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to ban/unban this account?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-danger mx-1'
                                    onClick={() => apiBan(e, onClose)}
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
                    <Update data={e} setData={setData} close={onClose} />
                );
            }
        });
    }
    const handleView = e => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Create data={e} close={onClose} />
                );
            }
        });
    }
    const apiDelete = (e, close) => {
        const load = toast.loading('wait...')
        api.delete('api/admin/user?id=' + e.id).then(res => {
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
    const apiBan = (e, close) => {
        const load = toast.loading('wait...')
        api.put('api/admin/user/ban?id=' + e.id).then(res => {
            toast.dismiss(load)
            if (res.data.success) {
                setData(prev => (
                    {
                        ...prev,
                        data: prev.data.map(ele => (
                            ele.id === e.id
                                ? ({
                                    ...ele,
                                    ban: res.data.data.ban
                                })
                                : (
                                    ele
                                ))
                        )
                    }
                ))
                close()
                toast.success('successful!')
            } else {
                toast.error('fail!')
            }
        })
    }
    useEffect(() => {
        api.get('api/admin/user', {
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
    if (!per)
        return (<NotPermission />)
    if (!data)
        return (<Loading />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <h6>User Manager | Admin</h6>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0'>
                            <thead>
                                <tr>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 '>ID</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>User</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Email</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Role</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Status</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Created at</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((e, i) => (
                                    <tr key={i}>
                                        <td className='text-center align-middle wraptext'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.id}</span>
                                        </td>
                                        <td>
                                            <div className='d-flex px-2 py-1'>
                                                <div>
                                                    <img src={e.localAvatar === 1
                                                        ? process.env.REACT_APP_API_SRC_USER_IMG + e.avatar
                                                        : e.avatar
                                                    } className='avatar avatar-sm me-3' alt={e.name} />
                                                </div>
                                                <div className='d-flex flex-column justify-content-center'>
                                                    <h6 className='mb-0 text-sm wraptext'>{e.name}</h6>
                                                    <p className='text-xs text-secondary mb-0 wraptext'>{e.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='wraptext'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.email}</span>
                                        </td>
                                        <td className='align-middle text-center text-sm cursor-default'>
                                            {e.roles > 0
                                                ? (<span className='badge badge-sm bg-gradient-danger'>Admin</span>)
                                                : (<span className='badge badge-sm bg-gradient-info'>Member</span>)
                                            }
                                        </td>
                                        <td className='align-middle text-center text-sm cursor-default'>
                                            {e.ban === 0
                                                ? (<span className='badge badge-sm bg-gradient-success'>Active</span>)
                                                : (<span className='badge badge-sm bg-gradient-danger'>Banned</span>)
                                            }
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.createdAt)}</span>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                                <div onClick={() => handleView(e)} className='btn btn-sm bg-gradient-success m-0 mx-1 px-2'>View</div>
                                                <div onClick={() => handleUpdate(e)} className='btn btn-sm bg-gradient-info m-0 mx-1 px-2'>Edit</div>
                                                {e.ban === 0 ? (
                                                    <div onClick={() => handleban(e)} className='btn btn-sm bg-gradient-warning m-0 mx-1 px-2'>Ban</div>
                                                ) : (
                                                    <div onClick={() => handleban(e)} className='btn btn-sm bg-gradient-warning m-0 mx-1 px-2'>Unban</div>
                                                )}
                                                <div onClick={() => handleDelete(e)} className='btn btn-sm bg-gradient-danger m-0 mx-1 px-2'>Delete</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {data.size > limit && (
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

export default AdminUser;