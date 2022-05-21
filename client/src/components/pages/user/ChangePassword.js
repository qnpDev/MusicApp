import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import api from '../../axios'
import NotFound from '../notfound';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const navigate = useNavigate()
    const { dataUser, setDataUser } = useContext(UserContext)
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [newPassAgain, setNewPassAgain] = useState('')
    const [btnUpdate, setBtnUpdate] = useState(false)

    const handleOldPass = e => setOldPass(e.target.value)
    const handleNewPass = e => setNewPass(e.target.value)
    const handleNewPassAgain = e => setNewPassAgain(e.target.value)

    const handleUpdate = () => {
        setBtnUpdate(true)
        let formData = new FormData()
        formData.append('password', newPass)
        formData.append('oldPassword', oldPass)
        const load = toast.loading('Wait...')
        api.put('api/user/change-password', formData).then(res => {
            toast.dismiss(load)
            if (res.data.success) {
                toast.success(res.data.message)
                api.post('api/Auth/signout', {
                    id: dataUser.id,
                    refreshToken: localStorage.getItem('refreshToken')
                })
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                setDataUser(null)
                navigate('/signin', {replace: true})
            } else {
                setBtnUpdate(false)
                toast.error(res.data.message)
            }
        })
    }

    if (!dataUser)
        return (<NotFound />)
    return (
        <>
            <div className='card'>
                <div className='card-header text-center'>
                    <h1>Change Password</h1>
                </div>
                <div className='card-body'>
                    <div className='text-center mt-2'>
                        <img
                            className='change-password-avatar'
                            src={dataUser.avatar}
                            alt='avatar'
                        />
                    </div>
                    <div className='mt-2'>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                Old Password:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input
                                type='password'
                                className='form-control text bg input-mind'
                                value={oldPass}
                                onChange={handleOldPass}
                                placeholder='Enter old password!'
                            />
                            {oldPass && oldPass.length < 4 && (
                                <label className='text-small text-danger d-flex justify-content-end'>At least 4 characters!</label>
                            )}
                        </div>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                New Password:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input
                                type='password'
                                className='form-control text bg input-mind'
                                value={newPass}
                                onChange={handleNewPass}
                                placeholder='Enter new password!'
                            />
                            {newPass && newPass.length < 4 && (
                                <label className='text-small text-danger d-flex justify-content-end'>At least 4 characters!</label>
                            )}
                        </div>
                        <div className='mb-3'>
                            <label className='fw-bold'>
                                New Password again:
                                <span className='text-danger fw-bold'>
                                    *
                                </span>
                            </label>
                            <input
                                type='password'
                                className='form-control text bg input-mind'
                                value={newPassAgain}
                                onChange={handleNewPassAgain}
                                placeholder='Enter new password again!'
                            />
                            {newPass && newPassAgain && newPass !== newPassAgain && (
                                <label className='text-small text-danger d-flex justify-content-end'>Not match!</label>
                            )}
                        </div>

                        <div className='mt-4 d-flex justify-content-end mx-2'>
                            <button
                                className={oldPass && newPass && newPassAgain && (oldPass.length >= 4) && (newPass.length >= 4) && (newPass === newPassAgain) && !btnUpdate ? 'btn btn-success ' : 'btn btn-secondary '}
                                disabled={oldPass && newPass && newPassAgain && (oldPass.length >= 4) && (newPass.length >= 4) && (newPass === newPassAgain) && !btnUpdate ? false : true}
                                onClick={handleUpdate}
                            >Change Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;