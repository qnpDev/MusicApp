import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../axios'

const AdminCreateCategory = ({ close, setData }) => {
    const [name, setName] = useState('')
    const [show, setShow] = useState(1)
    const [link, setLink] = useState('')
    const [localLink, setLocalLink] = useState(1)
    const [info, setInfo] = useState('')
    const [image, setImage] = useState(null)
    const [colorName, setColorName] = useState('#ffffff')
    const [colorInfo, setColorInfo] = useState('#ffffff')
    const [btnUpdate, setBtnUpdate] = useState(true)
    const [localImg, setLocalImg] = useState(0)
    const [linkImg, setLinkImg] = useState('')


    const handleName = e => setName(e.target.value)
    const handleShow = e => setShow(e.target.value)
    const handleUpload = () => {
        if (name.trim().length === 0)
            toast.error('Enter album name!')
        else if (link.trim().length === 0)
            toast.error('enter link!')
        else if (!image && localImg === 1)
            toast.error('Upload album image!')
        else if (localImg === 0 && linkImg.trim().length === 0)
            toast.error('Enter link album image!')
        else {
            let formData = new FormData()
            if (localImg === 1)
                formData.append('file', image, image.name)
            else
                formData.append('img', linkImg)
            formData.append('locallink', localLink)
            formData.append('link', link)
            formData.append('colortitle', colorName)
            formData.append('colorinfo', colorInfo)
            formData.append('info', info)
            formData.append('localimg', localImg)
            formData.append('name', name)
            formData.append('show', show)
            setBtnUpdate(false)
            const loading = toast.loading('Wait...')
            api.post('api/admin/banner/', formData).then(res => {
                if (res.data.success) {
                    toast.dismiss(loading)
                    setBtnUpdate(true)
                    toast.success(res.data.message)
                    setData(prev => (
                        {
                            ...prev,
                            data: [
                                ...prev.data,
                                res.data.data
                            ]
                        }
                    ))
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
                            <h6>Create new Banner | Admin</h6>
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
                                placeholder='Name Song'
                                value={name}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='namecolor' className='form-control-label'>Name color:</label>
                            <input
                                className='form-control'
                                type='color'
                                value={colorName}
                                id='namecolor'
                                onChange={e => setColorName(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='info'>Info:</label>
                            <textarea
                                onChange={e => setInfo(e.target.value)}
                                type='text'
                                className='form-control'
                                id='info'
                                placeholder='info'
                                value={info}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='infocolor' className='form-control-label'>Info color:</label>
                            <input
                                className='form-control'
                                type='color'
                                value={colorInfo}
                                id='infocolor'
                                onChange={e => setColorInfo(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='link'>Link:</label>
                            <input
                                onChange={e => setLink(e.target.value)}
                                type='text'
                                className='form-control'
                                id='link'
                                placeholder='link'
                                value={link}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='locallink'>
                                This link is:
                            </label>
                            <select
                                onChange={e => setLocalLink(e.target.value)}
                                className='form-control'
                                defaultValue={localLink}
                                id='locallink'>
                                <option value='0'>External link</option>
                                <option value='1'>Internal Link</option>
                            </select>
                        </div>

                        <div className='form-group'>
                            <label htmlFor='show'>
                                The banner out now?
                            </label>
                            <select
                                onChange={handleShow}
                                className='form-control'
                                defaultValue={show}
                                id='show'>
                                <option value='1'>Yes</option>
                                <option value='0'>No</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <label htmlFor="image">Image Banner: </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <div onClick={() => localImg === 1 ? setLocalImg(0) : setLocalImg(1)}
                                        className='btn btn-sm btn-outline-warning px-2'>
                                        {localImg === 1
                                            ? 'Use link'
                                            : 'Upload file'
                                        }
                                    </div>
                                </div>
                            </div>
                            {localImg === 1
                                ? (
                                    <input
                                        id="image"
                                        className='form-control'
                                        onChange={e => setImage(e.target.files[0])}
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                    />
                                ) : (
                                    <input
                                        id='image'
                                        className='form-control'
                                        type='text'
                                        value={linkImg}
                                        onChange={e => setLinkImg(e.target.value)}
                                        placeholder='Input link image'
                                    />
                                )}
                        </div>
                    </div>
                </div>
                <div className='card-footer'>
                    <div className='d-flex justify-content-end'>
                        <button
                            onClick={handleUpload}
                            disabled={!btnUpdate}
                            className='btn btn-info'>Create</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminCreateCategory;