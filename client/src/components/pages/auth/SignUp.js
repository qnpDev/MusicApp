import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import api from '../../axios'
import { toast } from 'react-toastify';
import ImageBG from '../../resources/images/curved14.jpg'

const SignUp = () => {
    document.title = 'SignUp'
	const navigate = useNavigate()
	const [btnSubmit, setBtnSubmit] = useState(false)
	const { setDataUser } = useContext(UserContext)

	const handleSubmit = e => {
		e.preventDefault()
		const name = e.target.name.value
		const username = e.target.username.value
		const pass = e.target.pass.value
		const pass2 = e.target.pass2.value
		const email = e.target.email.value
		if (name.trim() === '') {
			toast.error('Please enter Name!')
			e.target.name.focus()
		} else if (username.trim() === '') {
			toast.error('Please enter Username!')
			e.target.username.focus()
		} else if (username.match('^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9](?<![-?+?*$]{6,}.*)$') === null) {
			toast.error('Username must two characters at least and have no special characters!')
			e.target.username.focus()
		}else if(email.trim() === ''){
			toast.error('Please enter Email!')
			e.target.email.focus()
		} else if (pass === '') {
			toast.error('Please enter Password!')
			e.target.pass.focus()
		} else if (pass2 === '') {
			toast.error('Please enter Password again!')
			e.target.pass2.focus()
		} else if (pass !== pass2) {
			toast.error('Password does not match!')
			e.target.pass2.focus()
		} else if (pass.length < 4) {
			toast.error('Password must four characters at least!')
			e.target.pass.focus()
		} else {
			const load = toast.loading('wait...')
			setBtnSubmit(true)
			api.post('api/auth/signup', {
					username,
					password: pass,
					name,
					email,
				}).then(res => {
					if (res.data.success) {
						toast.dismiss(load)
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
					} else {
						toast.dismiss(load)
						toast.error(res.data.message)
						setBtnSubmit(false)
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
                    <div
                        className='page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg'
                        style={{
                            backgroundImage: `url(${ImageBG})`
                        }}
                    >
                        <span className='mask bg-gradient-dark opacity-6'></span>
                        <div className='container'>
                            <div className='row justify-content-center'>
                                <div className='col-lg-5 text-center mx-auto'>
                                    <h1 className='text-white mb-2 mt-5'>Welcome!</h1>
                                    {/* <p className='text-lead text-white'>Use these awesome forms to login or create new account in your project for free.</p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container'>
                        <div className='row mt-lg-n10 mt-md-n11 mt-n10'>
                            <div className='col-xl-4 col-lg-5 col-md-7 mx-auto'>
                                <div className='card z-index-0'>
                                    <div className='card-header text-center pt-4'>
                                        <h5>Register</h5>
                                    </div>
                                    <div className='card-body'>
                                        <form onSubmit={handleSubmit}>
                                            <div className='mb-3'>
                                                <input type='text' name='name' className='form-control' placeholder='Name' aria-label='Name' aria-describedby='email-addon' />
                                            </div>
                                            <div className='mb-3'>
                                                <input type='text' name='username' className='form-control' placeholder='Username' aria-label='Username' aria-describedby='username-addon' />
                                            </div>
											<div className='mb-3'>
                                                <input type='email' name='email' className='form-control' placeholder='Email' aria-label='Email' aria-describedby='email-addon' />
                                            </div>
                                            <div className='mb-3'>
                                                <input type='password' name='pass' className='form-control' placeholder='Password' aria-label='Password' aria-describedby='password-addon' />
                                            </div>
                                            <div className='mb-3'>
                                                <input type='password' name='pass2' className='form-control' placeholder='Password again' aria-label='Password again' aria-describedby='passwordagain-addon' />
                                            </div>
                                            <div className='text-center'>
                                                <button 
                                                    type='submit' 
                                                    className='btn bg-gradient-dark w-100 my-4 mb-2'
                                                    disabled={btnSubmit}
                                                >Sign up</button>
                                            </div>
                                            <p className='text-sm mt-3 mb-0'>Already have an account? <Link to='/signin' className='text-dark font-weight-bolder'>Sign in</Link></p>
                                        </form>
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

export default SignUp;