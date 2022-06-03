import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import NotFound from '../notfound';
import api from '../../axios'
import Loading from '../loading';
import './style.css'
import UserListSong from './ListSong';
import UserListAlbum from './ListAlbum';
import { confirmAlert } from 'react-confirm-alert';
import UserUpdate from './Update';
import { toast } from 'react-toastify';

const User = () => {
    const { id } = useParams()
    const { dataUser } = useContext(UserContext)
    const uId = id || dataUser?.id || -1
    const [data, setData] = useState()
    const [notFound, setNotFound] = useState(false)

    const handleUpdate = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <UserUpdate data={data} setData={setData} close={onClose} />
                );
            }
        });
    }
    const handleban = () => {
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
                                    onClick={() => apiBan(onClose)}
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

    const apiBan = close => {
        const load = toast.loading('wait...')
        api.put('api/admin/user/ban?id=' + data.id).then(res => {
            toast.dismiss(load)
            if (res.data.success) {
                setData(prev => (
                    {
                        ...prev,
                        ban: res.data.data.ban
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
        if (uId !== -1)
            api.get('api/user', {
                params: {
                    id: uId,
                }
            }).then(res => {

                if (res.data.success)
                    setData(res.data.data)
                else
                    setNotFound(true)
            })
    }, [uId])

    document.title = data ? data.name : 'User'

    if (uId === -1 || notFound)
        return (<NotFound />)
    return (
        <>
            <div className='user-container'>
                {!data ? (<Loading />) : (
                    <div className='user-info row'>
                        <div className='col-12 col-md-6'>
                            <div className='card mb-3 d-flex justify-content-center align-items-center p-4'>
                                <div className='user-avatar'>
                                    <img className={dataUser && (dataUser?.id === data.id ? 'user-edit-active' : '')} src={data?.localAvatar === 1 ? process.env.REACT_APP_API_SRC_USER_IMG + data.avatar : data.avatar} alt={data?.name} />
                                </div>
                                {dataUser && dataUser?.id === data.id && dataUser?.role < 10 && (
                                    <button onClick={handleUpdate} className='btn bg-gradient-warning mt-3 mb-0'>Edit</button>
                                )}
                                {dataUser && dataUser?.role >= 10 && (
                                    <div>
                                        <button onClick={handleUpdate} className='btn bg-gradient-warning mt-3 mb-0 mx-1'>Edit</button>
                                        {dataUser?.id !== data.id && (
                                            <>
                                                {data.ban === 1 ? (
                                                    <button onClick={handleban} className='btn bg-gradient-success mt-3 mb-0 mx-1'>Unban</button>
                                                ) : (
                                                    <button onClick={handleban} className='btn bg-gradient-danger mt-3 mb-0 mx-1'>Ban</button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='col-12 col-md-6'>
                            <div className='card mb-3'>
                                <table className='table m-3'>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Id:</th>
                                            <td>
                                                <input
                                                    className='form-control'
                                                    value={data.id}
                                                    disabled={true} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Name:</th>
                                            <td>
                                                <input
                                                    className='form-control'
                                                    value={data.name}
                                                    disabled={true} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email:</th>
                                            <td>
                                                <input
                                                    className='form-control'
                                                    value={data.email}
                                                    disabled={true} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Role:</th>
                                            <td>
                                                {data.roles === 10 ? (
                                                    <div className='btn bg-gradient-danger m-0 cursor-default'>Administrator</div>
                                                ) : (
                                                    <div className='btn bg-gradient-primary m-0 cursor-default'>Member</div>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Songs:</th>
                                            <td>
                                                <div className='btn bg-gradient-info m-0 cursor-default'>{data.songCount}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Album:</th>
                                            <td>
                                                <div className='btn bg-gradient-warning m-0 cursor-default'>{data.albumCount}</div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                <UserListSong uId={uId} />
                <UserListAlbum uId={uId} />
            </div>
        </>
    );
};

export default User;