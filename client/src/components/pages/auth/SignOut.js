import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import api from '../../axios'
import { UserContext } from '../../contexts/UserContext'
import ImageBG from '../../resources/images/curved14.jpg'

const SignOut = () => {
    document.title = 'SignOut'
    const navigate = useNavigate()
    const { dataUser, setDataUser } = useContext(UserContext)

    const handleLogout = () => {
        api.post('api/Auth/signout', {
            id: dataUser.id,
            refreshToken: localStorage.getItem('refreshToken')
        })
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        setDataUser(null)
        navigate('/', {replace: true})
    }
    useEffect(()=> {
        if (!localStorage.getItem('token') || !localStorage.getItem('refreshToken'))
            navigate('/', {replace: true})
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
                                    <h1 className='text-white mb-2 mt-5'>Goodbye!</h1>
                                    <p className='text-lead text-white'>See you later</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container'>
                        <div className='row mt-lg-n10 mt-md-n11 mt-n10'>
                            <div className='col-xl-4 col-lg-5 col-md-7 mx-auto'>
                                <div className='card z-index-0'>
                                    <div className='card-header text-center pt-4'>
                                        <h5>Sign Out</h5>
                                    </div>
                                    <div className='card-body'>
                                        <div className='text-center text-dark mb-4'>Do you want to logout!</div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <button
                                                onClick={() => navigate(-1)}
                                                className='mx-2 btn btn-secondary'
                                            >Cancel</button>
                                            <button
                                                onClick={handleLogout}
                                                className='mx-2 btn btn-success'
                                            >Logout</button>
                                        </div>
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

export default SignOut;