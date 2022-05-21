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
                    <UserUpdate data={data} setData={setData} close={onClose}/>
                );
            }
        });
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
                                {dataUser && dataUser?.id === data.id && (
                                    <button onClick={handleUpdate} className='btn bg-gradient-warning mt-3 mb-0'>Edit</button>
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
                                                    disabled={true}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Name:</th>
                                            <td>
                                                <input 
                                                    className='form-control' 
                                                    value={data.name} 
                                                    disabled={true}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Email:</th>
                                            <td>
                                                <input 
                                                    className='form-control' 
                                                    value={data.email} 
                                                    disabled={true}/>
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