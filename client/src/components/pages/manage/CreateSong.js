import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';
import NotPermission from '../notpermission'
import './style.css'
import api from '../../axios'
import Loading from '../loading';
import { useNavigate } from 'react-router-dom';

const CreateSong = () => {
    document.title = 'Upload new song'
    const navigate = useNavigate()
    const [listCategory, setListCategory] = useState()
    const [listAlbum, setListAlbum] = useState()
    const { dataUser } = useContext(UserContext)
    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const [artist, setArtist] = useState('')
    const [category, setCategory] = useState(-1)
    const [album, setAlbum] = useState(-1)
    const [show, setShow] = useState(1)
    const [song, setSong] = useState(null)
    const [btnUplaod, setBtnUpload] = useState(true)
    const [localImg, setLocalImg] = useState(0)
    const [linkImg, setLinkImg] = useState('')
    const [localSrc, setLocalSrc] = useState(0)
    const [linkSrc, setLinkSrc] = useState('')

    const handleImage = e => setImage(e.target.files[0])
    const handleName = e => setName(e.target.value)
    const handleArtist = e => setArtist(e.target.value)
    const handleCategory = e => setCategory(e.target.value)
    const handleAlbum = e => setAlbum(e.target.value)
    const handleShow = e => setShow(e.target.value)
    const handleSong = e => setSong(e.target.files[0])
    const handleUpload = status => {
        if (name.trim().length === 0)
            toast.error('Enter song name!')
        else if (artist.trim().length === 0)
            toast.error('Enter song artist!')
        else if (category === -1)
            toast.error('Choose song category!')
        else if (!image && localImg === 1)
            toast.error('Upload song image!')
        else if (linkImg.trim().length === 0 && localImg === 0)
            toast.error('Enter link song image!')
        else if (!song && localSrc === 1)
            toast.error('Upload song!')
        else if (linkSrc.trim().length === 0 && localSrc === 0)
            toast.error('Enter link song!')
        else {
            let formData = new FormData()
            formData.append('localimg', localImg)
            formData.append('localsrc', localSrc)
            if(localImg === 1)
                formData.append('file', image, image.name)
            else
                formData.append('img', linkImg)
            if(localSrc === 1)
                formData.append('file', song, song.name)
            else
                formData.append('src', linkSrc)
            formData.append('name', name)
            formData.append('artist', artist)
            formData.append('category', category)
            formData.append('album', album)
            formData.append('show', show)
            formData.append('uid', dataUser.id)
            formData.append('status', status)

            const load = toast.loading('Wait...')
                setBtnUpload(false)
                api.post('api/manage/song/create', formData).then(res => {
                    if (res.data.success) {
                        setBtnUpload(true)
                        toast.success('Upload success!')
                        navigate('/manage')
                    } else {
                        setBtnUpload(true)
                        toast.error(res.data.message)
                    }
                    toast.dismiss(load)
                })
        }
    }
    useEffect(() => {
        api.get('api/Category').then(res => {
            setListCategory(res.data?.data)
        })
    }, [])
    useEffect(() => {
        if (dataUser)
            api.get('api/Album/user', {
                params: {
                    id: dataUser.id
                }
            }).then(res => {
                setListAlbum(res.data?.data)
            })
    }, [dataUser])
    if (!dataUser || !localStorage.getItem('token') || !localStorage.getItem('refreshToken'))
        return (<NotPermission />)
    if (!listCategory || !listAlbum || !dataUser)
        return (<Loading />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header'>
                    <div className='d-flex align-items-center'>
                        <h6 className='mb-0 fw-bolder'>Upload new  song</h6>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='upload-container'>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                onChange={handleName}
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
                                onChange={handleArtist}
                                type="text"
                                className="form-control"
                                id="artist"
                                placeholder="Artist"
                                value={artist}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="category">Category: </label>
                            <select
                                onChange={handleCategory}
                                className="form-control"
                                defaultValue={category}
                                id="category"
                            >
                                <option value={-1} disabled>Choose Category</option>
                                {listCategory?.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='form-group'>
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <label htmlFor="album">Album: </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <div onClick={() => navigate('/manage/create-album')} className='btn btn-sm btn-outline-success'>Create new album</div>
                                </div>
                            </div>
                            
                            <select
                                onChange={handleAlbum}
                                className="form-control"
                                defaultValue={album}
                                id="album"
                            >
                                <option value={-1}>Không có album</option>
                                {listAlbum?.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-check-label" htmlFor="show">
                                The song out now?
                            </label>
                            <select
                                onChange={handleShow}
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
                                    <label htmlFor="image">Image song: </label>
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
                                        onChange={handleImage}
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

                        <div className="form-group">
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <label htmlFor="song">File song: </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <div onClick={() => localSrc === 1 ? setLocalSrc(0) : setLocalSrc(1)} 
                                        className='btn btn-sm btn-outline-success'>
                                            {localSrc === 1
                                                ? 'Use link'
                                                : 'Upload file'
                                            }
                                        </div>
                                </div>
                            </div>
                            {localSrc === 1 
                                ? (
                                    <input
                                        id="song"
                                        className='form-control'
                                        onChange={handleSong}
                                        type="file"
                                        accept="audio/mp3,audio/*;capture=microphone"
                                    />
                                ) : (
                                    <input
                                        id='song'
                                        className='form-control'
                                        type='text'
                                        value={linkSrc}
                                        onChange={e => setLinkSrc(e.target.value)}
                                        placeholder='Input link mp3'
                                    />
                                )}
                        </div>


                        <div className='confirm'>
                            <div
                                onClick={() => handleUpload(0)}
                                className='btn btn-secondary'>Save draft</div>
                            <button
                                onClick={() => handleUpload(1)}
                                disabled={!btnUplaod}
                                className='btn btn-info'>Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateSong;