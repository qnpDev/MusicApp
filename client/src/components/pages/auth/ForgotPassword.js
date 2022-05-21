import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../axios'
import { UserContext } from '../../contexts/UserContext';
import NotFound from '../notfound';

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [btnSend, setBtnSend] = useState(false)
    const navigate = useNavigate()
    const { dataUser } = useContext(UserContext)

    const handleSend = () => {
        if(email.trim().length === 0){
            toast.error('Enter your email!')
        }else{
            const load = toast.loading('Wait..')
            setBtnSend(true)
            api.post('api/auth/reset-password', {
                email,
                url: process.env.REACT_APP_API_CLIENT  + 'reset-password'
            }).then(res => {
                toast.dismiss(load)
                if(res.data.success){
                    toast.success('Done! Please check your email!')
                    navigate('/')
                }else{
                    setBtnSend(false)
                    toast.error(res.data.message)
                }
            })
        }
    }
    if(dataUser){
        return (<NotFound/>)
    }
    return (
        <>
            <div className='card'>
                <div className='card-header pb-0'>
                    <h2>Forgot Password</h2>
                </div>
                <div className='card-body'>
                    <div className='mb-3'>
                        <label className='fw-bold'>
                            Email:
                            <span className='text-danger fw-bold'>
                                *
                            </span>
                        </label>
                        <input
                            type='email'
                            className='form-control text bg input-mind'
                            value={email}
                            onChange={e  => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                </div>
                <div className='card-footer pt-0'>
                    <div className='text-end'>
                        <button 
                            onClick={handleSend}
                            disabled={btnSend}
                            className='btn bg-gradient-info'
                        >Send Request</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;