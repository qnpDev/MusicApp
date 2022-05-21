import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../axios'

const UserUpdate = ({ data, close, setData }) => {
    const [name, setName] = useState(data.name)
    const [email, setEmail] = useState(data.email || '')
    const [image, setImage] = useState(null)
    const [linkImg, setLinkImg] = useState(data.avatar)
    const [changeImage, setChangeImage] = useState(false)
    const [btnUpdate, setBtnUpdate] = useState(true)
    const [localImg, setLocalImg] = useState(data.localAvatar)

    const handleImage = e => setImage(e.target.files[0])
    const handleName = e => setName(e.target.value)
    const handleUpload = () => {
        if (name.trim().length === 0)
            toast.error('Enter name!')
        else if (email.trim().length === 0)
            toast.error('enter email!')
        else if (!image && changeImage && localImg === 1)
            toast.error('Upload album image!')
        else if (localImg === 0 && linkImg.trim().length === 0)
            toast.error('Enter link album image!')
        else {
            let formData = new FormData()
            if (changeImage) {
                if (localImg === 1)
                    formData.append('file', image, image.name)
                else
                    formData.append('img', linkImg)
            }
            formData.append('email', email)
            formData.append('localimg', localImg)
            formData.append('id', data.id)
            formData.append('changeImage', changeImage)
            formData.append('name', name)
            setBtnUpdate(false)
            const loading = toast.loading('Wait...')
            api.put('api/user', formData).then(res => {
                if (res.data.success) {
                    toast.dismiss(loading)
                    setBtnUpdate(true)
                    toast.success(res.data.message)
                    setData(prev => ({
                        ...prev,
                        name,
                        avatar: linkImg,
                        localAvatar: localImg,
                        email,
                    }))
                    close()
                } else {
                    toast.dismiss(loading)
                    setBtnUpdate(true)
                    toast.error(res.data.message)
                }
            })
        }
    }

    return (
        <>
            <div className='card manage-update-song'>
                <div className='card-header'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h3>Edit</h3>
                        </div>
                        <div
                            onClick={close}
                            className='btn btn-secondary btn-sm'>Close</div>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='upload-container'>
                        <div className='form-group'>
                            <label htmlFor='name'>Name:</label>
                            <input
                                onChange={handleName}
                                type='text'
                                className='form-control'
                                id='name'
                                placeholder='Name'
                                value={name}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='email'>Email:</label>
                            <input
                                onChange={e => setEmail(e.target.value)}
                                type='email'
                                className='form-control'
                                id='email'
                                placeholder='Enter email'
                                value={email}
                            />
                        </div>

                        <div className='form-group'>
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <label htmlFor='image'>Avatar:  </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    {changeImage
                                        ? (
                                            <>
                                                {localImg === 1
                                                    ? (
                                                        <div
                                                            onClick={() => localImg === 1 ? setLocalImg(0) : setLocalImg(1)}
                                                            className='btn btn-sm btn-outline-success mx-1'>Use link</div>
                                                    )
                                                    : (
                                                        <div
                                                            onClick={() => localImg === 1 ? setLocalImg(0) : setLocalImg(1)}
                                                            className='btn btn-sm btn-outline-success mx-1'>Upload file</div>
                                                    )}
                                                <div
                                                    onClick={() => setChangeImage(prev => !prev)}
                                                    className='btn btn-sm btn-outline-primary'>Cancel change</div>
                                            </>
                                        )
                                        : (
                                            <div
                                                onClick={() => setChangeImage(prev => !prev)}
                                                className='btn btn-sm btn-outline-primary'>Change</div>
                                        )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center'>
                                {changeImage
                                    ? (
                                        <>
                                            {localImg === 1
                                                ? (
                                                    <input
                                                        id='image'
                                                        className='form-control'
                                                        onChange={handleImage}
                                                        type='file'
                                                        accept='image/png, image/jpeg, image/jpg'
                                                    />
                                                )
                                                : (
                                                    <input
                                                        id='image'
                                                        type='text'
                                                        className='form-control'
                                                        onChange={e => setLinkImg(e.target.value)}
                                                        value={linkImg}
                                                        placeholder='Input link image'
                                                    />
                                                )}


                                        </>
                                    )
                                    : (
                                        <img
                                            src={data.localAvatar === 1
                                                ? process.env.REACT_APP_API_SRC_USER_IMG + data.avatar
                                                : data.avatar}
                                            className='avatar me-3 img-song'
                                            alt={data.name}
                                        />
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card-footer'>
                    <div className='d-flex justify-content-end'>
                        <button
                            onClick={handleUpload}
                            disabled={!btnUpdate}
                            className='btn btn-info'>Update</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserUpdate;