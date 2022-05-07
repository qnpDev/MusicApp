import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';
import ImageBG from '../../resources/images/curved6.jpg'
import api from '../../axios'

const SignIn = () => {
    document.title = 'Sign In'
    const navigate = useNavigate()
    const [btnSubmit, setBtnSubmit] = useState(false)
    const { setDataUser } = useContext(UserContext)

    const handleSubmit = e => {
        e.preventDefault()
        const username = e.target.username.value
        const password = e.target.password.value
        if (username.trim() === '') {
            toast.error('Please enter Username!')
            e.target.username.focus()
        } else if (username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?+?*$]{6,}.*)$') === null) {
            toast.error('Username must two characters at least and have no special characters!')
            e.target.username.focus()
        } else if (password.trim() === '') {
            toast.error('Please enter Password!')
            e.target.password.focus()
        } else if (password.length <= 2) {
            toast.error('Password must four characters at least!')
            e.target.password.focus()
        } else {
            const load = toast.loading('wait...')
            setBtnSubmit(true)
            api.post('api/Auth/signin', {
                    username,
                    password
                }).then(res => {
                    toast.dismiss(load)
                    if (res.data.success) {
                        const { token, refreshToken, userId, userAvatar, userRole, userLocalAvatar } = res.data
                        localStorage.setItem('token', token)
                        localStorage.setItem('refreshToken', refreshToken)
                        setDataUser({
                            id: userId,
                            avatar: userAvatar,
                            role: userRole,
                            localAvatar: userLocalAvatar,
                        })
                        navigate('/')
                        toast.success('Login success!')
                    } else {
                        setBtnSubmit(false)
                        toast.error(res.data.message)
                    }
                })
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token') || localStorage.getItem('refreshToken')) {
            // api.get('/user/id').then(res=> {
            //     if(res.data.success)
            navigate('/')
            // })
        }
    }, [navigate])

    return (
        <>
            <main className='main-content mt-0'>
                <section>
                    <div className='page-header min-vh-75'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto'>
                                    <div className='card card-plain mt-8'>
                                        <div className='card-header pb-0 text-left bg-transparent'>
                                            <h3 className='font-weight-bolder text-info text-gradient'>Welcome back</h3>
                                            <p className='mb-0'>Enter your email and password to sign in</p>
                                        </div>
                                        <div className='card-body'>
                                            <form onSubmit={handleSubmit}>
                                                <label>Username</label>
                                                <div className='mb-3'>
                                                    <input
                                                        name='username'
                                                        type='text'
                                                        className='form-control'
                                                        placeholder='Username'
                                                        aria-label='Username'
                                                        aria-describedby='username-addon' />
                                                </div>
                                                <label>Password</label>
                                                <div className='mb-3'>
                                                    <input
                                                        name='password'
                                                        type='password'
                                                        className='form-control'
                                                        placeholder='Password'
                                                        aria-label='Password'
                                                        aria-describedby='password-addon' />
                                                </div>
                                                {/* <div className='form-check form-switch'>
                                                    <input className='form-check-input' type='checkbox' id='rememberMe' />
                                                    <label className='form-check-label' htmlFor='rememberMe'>Remember me</label>
                                                </div> */}
                                                <div className='text-center'>
                                                    <button
                                                        type='submit'
                                                        className='btn bg-gradient-info w-100 mt-4 mb-0'
                                                        disabled={btnSubmit}
                                                    >Sign in</button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className='card-footer text-center pt-0 px-lg-2 px-1'>
                                            <p className='mb-4 text-sm mx-auto'>
                                                Don't have an account?
                                                <Link to='/signup' className='text-info text-gradient font-weight-bold'>Sign up</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='oblique position-absolute top-0 h-100 d-md-block d-none me-n8'>
                                        <div
                                            className='oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6'
                                            style={{
                                                backgroundImage: `url(${ImageBG})`
                                            }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default SignIn;