import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../axios'
import { UserContext } from '../../../contexts/UserContext';
import Loading from '../../loading';
import NotFound from '../../notfound';

const EditAAlbum = () => {
    const { tagAlbum } = useParams()
    const navigate = useNavigate()
    const [verify, setVerify] = useState(true)
    const { dataUser } = useContext(UserContext)
    const [data, setData] = useState()
    const [name, setName] = useState()
    const [artist, setArtist] = useState()
    const [show, setShow] = useState()
    const [tag, setTag] = useState()
    const [image, setImage] = useState(null)
    const [changeImage, setChangeImage] = useState(false)
    const [btnUpdate, setBtnUpdate] = useState(true)
    const [localImg, setLocalImg] = useState()
    const [linkImg, setLinkImg] = useState()

    const handleImage = e => setImage(e.target.files[0])
    const handleName = e => setName(e.target.value)
    const handleArtist = e => setArtist(e.target.value)
    const handleTag = e => setTag(e.target.value)
    const handleShow = e => setShow(e.target.value)
    const handleUpload = () => {
        if (name.trim().length === 0)
            toast.error('Enter album name!')
        else if (artist.trim().length === 0)
            toast.error('Enter song artist!')
        else if (tag.trim().length === 0)
            toast.error('enter tag!')
        else if (!image && changeImage && localImg === 1)
            toast.error('Upload album image!')
        else if(localImg === 0 && linkImg.trim().length === 0)
            toast.error('Enter link album image!')
        else {
            let formData = new FormData()
            if(changeImage){
                if(localImg === 1)
                    formData.append('file', image, image.name)
                else
                    formData.append('img', linkImg)
            }
            formData.append('localimg', localImg)
            formData.append('id', data.id)
            formData.append('changeImage', changeImage)
            formData.append('name', name)
            formData.append('artist', artist)
            formData.append('tag', tag)
            formData.append('show', show)
            setBtnUpdate(false)
            const loading = toast.loading('Wait...')
            api.put('api/admin/album/', formData).then(res => {
                if (res.data.success) {
                    toast.dismiss(loading)
                    setBtnUpdate(true)
                    toast.success(res.data.message)
                    navigate('/album/' + tag)
                } else {
                    toast.dismiss(loading)
                    setBtnUpdate(true)
                    toast.error(res.data.message)
                }
            })

        }
    }
    useEffect(() => {
        if(dataUser && dataUser.role >= 10){
            api.get('api/admin/album/info', {
                params: {
                    tag: tagAlbum
                }
            }).then(res => {
                if(res.data.success){
                    setVerify(true)
                    setData(res.data.data)
                    setName(res.data.data.name)
                    setArtist(res.data.data.artist)
                    setShow(res.data.data.show)
                    setTag(res.data.data.tag)
                    setLinkImg(res.data.data.img)
                    setLocalImg(res.data.data.localImg)
                }else{
                    setVerify(false)
                }
            })
        }else{
            setVerify(false)
        }
        
    }, [dataUser, tagAlbum])

    if(!dataUser || !tagAlbum || dataUser.role < 10){
        return ( <NotFound/>)
    }
    if(!data){
        return ( <Loading/>)
    }
    if(data && !verify){
        return ( <NotFound/>)
    }

    return (
        <>
            <div className='card'>
                <div className='card-header'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Edit album | Admin</h6>
                        </div>
                        
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
                            <label htmlFor='artist'>Artist:</label>
                            <input
                                onChange={handleArtist}
                                type='text'
                                className='form-control'
                                id='artist'
                                placeholder='Artist'
                                value={artist}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='tag'>Tag:</label>
                            <input
                                onChange={handleTag}
                                type='text'
                                className='form-control'
                                id='tag'
                                placeholder='tag'
                                value={tag}
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-check-label' htmlFor='show'>
                                The album out now?
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

                        <div className='form-group'>
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <label htmlFor='album'>Image song:  </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    {changeImage
                                        ? (
                                            <>
                                            <div 
                                                onClick={() => localImg === 1 ? setLocalImg(0) : setLocalImg(1)}
                                                className='btn btn-sm btn-outline-success mx-1'>{localImg === 1 ? 'Use link' : 'Upload file'}</div>
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
                                            src={data.localImg === 1
                                                ? process.env.REACT_APP_API_SRC_ALBUM_IMG + data.img
                                                : data.img}
                                            className='avatar me-3 img-song-edit'
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
                            className='btn btn-info'>Edit</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditAAlbum;