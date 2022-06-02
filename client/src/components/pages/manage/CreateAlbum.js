import React, { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import api from '../../axios'
import { toast } from 'react-toastify';
import NotPermission from '../notpermission';
import { useNavigate } from 'react-router-dom';

const CreateAlbum = () => {
    document.title = 'Upload new album'
    const [name, setName] = useState('')
    const [artist, setArtist] = useState('')
    const [img, setImg] = useState()
    const [show, setShow] = useState(1)
    const [btnCreate, setBtnCreate] = useState(true)
    const { dataUser } = useContext(UserContext)
    const [localImg, setLocalImg] = useState(0)
    const [linkImg, setLinkImg] = useState('')
    const navigate = useNavigate()

    const handleCreate = () => {
        if (name.trim().length === 0)
            toast.error('Enter song name!')
        else if (artist.trim().length === 0)
            toast.error('Enter song artist!')
        else if (!img && localImg === 1)
            toast.error('Upload image!')
        else if (!linkImg.trim().length === 0 && localImg === 0)
            toast.error('enter image link!')
        else {
            let formData = new FormData()
            
            formData.append('name', name)
            formData.append('artist', artist)
            formData.append('show', show)
            formData.append('uid', dataUser.id)
            formData.append('localimg', localImg)
            if(localImg === 0)
                formData.append('img', linkImg)
            else
                formData.append('file', img, img.name)

            const load = toast.loading('Wait...')
                setBtnCreate(false)
                api.post('api/Manage/album/create', formData).then(res => {
                    if (res.data.success) {
                        setBtnCreate(true)
                        toast.success('Upload success!')
                        navigate('/manage')
                    } else {
                        setBtnCreate(true)
                        toast.error(res.data.message)
                    }
                    toast.dismiss(load)
                })
        }
    }
    if (!dataUser || !localStorage.getItem('token') || !localStorage.getItem('refreshToken'))
        return (<NotPermission />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header'>
                    <div className='d-flex align-items-center'>
                        <h6 className='mb-0 fw-bolder'>Create new Album</h6>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='upload-container'>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                onChange={e => setName(e.target.value)}
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name Song"
                                value={name}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="artist">Artist:</label>
                            <input
                                onChange={e => setArtist(e.target.value)}
                                type="text"
                                className="form-control"
                                id="artist"
                                placeholder="Artist"
                                value={artist}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-check-label" htmlFor="show">
                                The album out now?
                            </label>
                            <select
                                onChange={e => setShow(e.target.value)}
                                className="form-control"
                                defaultValue={show}
                                id="show">
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <label htmlFor="image">Image album: </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <div onClick={() => localImg === 1 ? setLocalImg(0) : setLocalImg(1)} 
                                        className='btn btn-sm btn-outline-success'>
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
                                        onChange={e => setImg(e.target.files[0])}
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                    />
                                ) :(
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

                        <div className='confirm'>
                            <button
                                onClick={handleCreate}
                                disabled={!btnCreate}
                                className='btn btn-info'>Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateAlbum;