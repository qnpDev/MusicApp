import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import Loading from '../../../loading';
import NotPermisstion from '../../../notpermission'
import api from '../../../../axios'
import { toast } from 'react-toastify';
import './style.css'
import { confirmAlert } from 'react-confirm-alert';

const Database = () => {
    document.title = 'Database Backup Tool | Admin'
    const [data, setData] = useState()
    const { dataUser } = useContext(UserContext)

    const handleBackup = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to backup database now?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-info mx-1'
                                    onClick={() => apiBackup(onClose)}
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
    const apiBackup = close => {
        close()
        const load = toast.loading('Wait...')
        api.post('api/admin/database/backup').then(res => {
            toast.dismiss(load)
            if(res.data.success){
                setData(prev => ([
                    res.data.data,
                    ...prev,
                ]))
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
            }
        })
    }

    const handleDelete = id => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to delete this backup?</p>
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
    const apiDelete = (name, close) => {
        close()
        const load = toast.loading('Wait...')
        api.delete('api/admin/database?name='+name).then(res => {
            toast.dismiss(load)
            if(res.data.success){
                setData(prev => prev.filter(e => e !== name))
                toast.success(res.data.message)
            }else{
                toast.error(res.data.message)
            }
        })
    }

    useEffect(() => {
        api.get('api/admin/database').then(res => {
            if(res.data.success)
                setData(res.data.data)
            else{
                toast.error(res.data.message)
            }
        })
    }, [])

    if(!data)
        return (<Loading/>)
    if(!dataUser || dataUser.role < 10)
        return ( <NotPermisstion />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h3>DB Backup | Admin</h3>
                        </div>
                        <div
                            onClick={handleBackup}
                            className='btn btn-info btn-sm'>Create backup</div>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='database-list'>
                        <ul>
                            {data && data.map((e, i) => (
                                <li key={i}>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='db-name'>
                                            {e}
                                        </div>
                                        <div className='db-action'>
                                            <a 
                                                href={process.env.REACT_APP_API_ENDPOINT + 'api/admin/database/file/' + e}
                                                className='btn btn-sm bg-gradient-success mx-1 my-0'>
                                                    download
                                            </a>
                                            <button 
                                                onClick={() => handleDelete(e)}
                                                className='btn btn-sm bg-gradient-danger mx-1 my-0'>
                                                    delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Database;