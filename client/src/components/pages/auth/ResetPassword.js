import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'
import { UserContext } from '../../contexts/UserContext';
import Loading from '../loading';
import NotFound from '../notfound';

const ResetPassword = () => {
    const [newPass, setNewPass] = useState('')
    const [newPassAgain, setNewPassAgain] = useState('')
    const [btnSend, setBtnSend] = useState(false)
    const [verify, setVerify] = useState(-1)
    const { token } = useParams()
    const  { dataUser } = useContext(UserContext)
    const navigate = useNavigate()

    const handleSend = () => {
        setBtnSend(true)
        const load = toast.loading('Wait..')
        api.post('api/auth/reset-password/change',{
            token,
            password: newPass,
        }).then(res =>  {
            toast.dismiss(load)
            if(res.data.success){
                toast.success(res.data.message)
                navigate('/signin')
            }else{
                toast.error(res.data.message)
                setBtnSend(false)
            }
        })
    }
    useEffect(() => {
        if (token)
            api.get('api/auth/reset-password/verify', {
                params: {
                    token,
                }
            }).then(res => {
                if (res.data.success) {
                    setVerify(1)
                } else {
                    setVerify(0)
                }
            })
    }, [token])
    if (!token || verify === 0 || dataUser) {
        return (<NotFound />)
    }
    if (verify === -1) {
        return (<Loading />)
    }
    return (
        <>
            <div className='card'>
                <div className='card-header pb-0'>
                    <h2>Reset Password</h2>
                </div>
                <div className='card-body'>
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
                            onChange={e => setNewPass(e.target.value)}
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
                            onChange={e => setNewPassAgain(e.target.value)}
                            placeholder='Enter new password again!'
                        />
                        {newPass && newPassAgain && newPass !== newPassAgain && (
                            <label className='text-small text-danger d-flex justify-content-end'>Not match!</label>
                        )}
                    </div>
                </div>
                <div className='card-footer pt-0'>
                    <div className='text-end'>
                        <button
                            onClick={handleSend}
                            className={newPass && newPassAgain && (newPass.length >= 4) && (newPass === newPassAgain) && !btnSend ? 'btn bg-gradient-success ' : 'btn bg-gradient-secondary '}
                            disabled={newPass && newPassAgain && (newPass.length >= 4) && (newPass === newPassAgain) && !btnSend ? false : true}
                        >Change</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;