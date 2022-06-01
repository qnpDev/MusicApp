import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../axios'
import { UserContext } from '../../../contexts/UserContext';
import Loading from '../../loading';
import NotFound from '../../notfound';

const EditASong = () => {
    const { tagSong } = useParams()
    const navigate = useNavigate()
    const {dataUser} = useContext(UserContext)

    const [data, setData] = useState()
    const [name, setName] = useState()
    const [artist, setArtist] = useState()
    const [category, setCategory] = useState()
    const [album, setAlbum] = useState(-1)
    const [show, setShow] = useState()
    const [tag, setTag] = useState()
    const [image, setImage] = useState(null)
    const [song, setSong] = useState(null)
    const [changeImage, setChangeImage] = useState(false)
    const [changeSong, setChangeSong] = useState(false)
    const [btnUplaod, setBtnUpload] = useState(true)
    const [localImg, setLocalImg] = useState(0)
    const [linkImg, setLinkImg] = useState()
    const [localSrc, setLocalSrc] = useState(0)
    const [linkSrc, setLinkSrc] = useState()
    const [verify, setVerify] = useState(true)
    const [listAlbum, setListAlbum] = useState()
    const [listCategory, setListCategory] = useState()

    const handleImage = e => setImage(e.target.files[0])
    const handleName = e => setName(e.target.value)
    const handleArtist = e => setArtist(e.target.value)
    const handleTag = e => setTag(e.target.value)
    const handleCategory = e => setCategory(e.target.value)
    const handleAlbum = e => setAlbum(e.target.value)
    const handleShow = e => setShow(e.target.value)
    const handleSong = e => setSong(e.target.files[0])

    console.log(album)
    const handleUpload = () => {
        if (name.trim().length === 0)
            toast.error('Enter song name!')
        else if (artist.trim().length === 0)
            toast.error('Enter song artist!')
        else if (category === -1)
            toast.error('Choose song category!')
        else if (tag.trim().length === 0)
            toast.error('enter tag!')
        else if (!image && changeImage && localImg === 1)
            toast.error('Upload song image!')
        else if (linkImg.trim().length === 0 && localImg === 0)
            toast.error('Enter link song image!')
        else if (!song && changeSong && localSrc === 1)
            toast.error('Upload song!')
        else if (linkSrc.trim().length === 0 && localSrc === 0)
            toast.error('Enter link song!')
        else {
            let formData = new FormData()
            if (changeImage) {
                if (localImg === 1)
                    formData.append('file', image, image.name)
                else
                    formData.append('img', linkImg)
            }
            if (changeSong) {
                if (localSrc === 1)
                    formData.append('file', song, song.name)
                else
                    formData.append('src', linkSrc)
            }

            formData.append('localimg', localImg)
            formData.append('localsrc', localSrc)
            formData.append('id', data.id)
            formData.append('changeImage', changeImage)
            formData.append('changeSong', changeSong)
            formData.append('name', name)
            formData.append('artist', artist)
            formData.append('category', category)
            formData.append('album', album)
            formData.append('tag', tag)
            formData.append('show', show)
            setBtnUpload(false)
            const loading = toast.loading('Wait...')
            api.put('api/admin/song/update', formData).then(res => {
                if (res.data.success) {
                    toast.dismiss(loading)
                    setBtnUpload(true)
                    toast.success(res.data.message)
                    navigate('/song/'+ tag)
                } else {
                    toast.dismiss(loading)
                    setBtnUpload(true)
                    toast.error(res.data.message)
                }
            })

        }
    }

    useEffect(() => {
        if(dataUser && dataUser.role >= 10){
            api.get('api/admin/song/info', {
                params: {
                    tag: tagSong
                }
            }).then(res => {
                if(res.data.success){
                    setVerify(true)
                    setData(res.data.song)
                    setName(res.data.song.name)
                    setArtist(res.data.song.artist)
                    setCategory(res.data.song.category)
                    setAlbum(res.data.song.album ? res.data.song.album : -1)
                    setShow(res.data.song.show)
                    setTag(res.data.song.tag)
                    setLinkImg(res.data.song.img)
                    setLinkSrc(res.data.song.src)
                    setLocalImg(res.data.song.localImg)
                    setLocalSrc(res.data.song.localSrc)
                }else{
                    setVerify(false)
                }
            })
        }else{
            setVerify(false)
        }
        
    }, [dataUser, tagSong])

    useEffect(() => {
        api.get('api/admin/home/allalbum').then(res => {
                setListAlbum(res.data)
        })
        api.get('api/admin/home/allcategory').then(res => {
                setListCategory(res.data)
        })
    } ,[])

    if(!dataUser || !tagSong || dataUser.role < 10){
        return ( <NotFound/>)
    }
    if(!data || !listCategory || !listAlbum){
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
                            <h6>Edit Song</h6>
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
                            <label htmlFor='category'>Category: </label>
                            <select
                                onChange={handleCategory}
                                className='form-control'
                                defaultValue={category}
                                id='category'
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
                                    <label htmlFor='album'>Album: </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <div
                                        onClick={() => navigate('/manage/create-album')}
                                        className='btn btn-sm btn-outline-success'>Create new album</div>
                                </div>
                            </div>

                            <select
                                onChange={handleAlbum}
                                className='form-control'
                                defaultValue={album}
                                id='album'
                            >
                                <option value={-1}>Không có album</option>
                                {listAlbum?.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className='form-group'>
                            <label className='form-check-label' htmlFor='show'>
                                The song out now?
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
                                                ? process.env.REACT_APP_API_SRC_AUDIO_IMG + data.img
                                                : data.img}
                                            className='avatar me-3 img-song-edit'
                                            alt={data.name}
                                        />
                                    )}
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='d-flex justify-content-between align-items-end'>
                                <div>
                                    <label htmlFor='album'>File song:  </label>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    {changeSong
                                        ? (
                                            <>
                                                <div
                                                    onClick={() => localSrc === 1 ? setLocalSrc(0) : setLocalSrc(1)}
                                                    className='btn btn-sm btn-outline-success mx-1'>{localSrc === 1 ? 'Use link' : 'Upload file'}</div>
                                                <div
                                                    onClick={() => setChangeSong(prev => !prev)}
                                                    className='btn btn-sm btn-outline-primary'
                                                >Cancel change</div>
                                            </>

                                        )
                                        : (
                                            <div
                                                onClick={() => setChangeSong(prev => !prev)}
                                                className='btn btn-sm btn-outline-primary'>Change</div>
                                        )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center'>
                                {changeSong
                                    ? (
                                        <>
                                            {localSrc === 1
                                                ? (
                                                    <input
                                                        id='song'
                                                        className='form-control'
                                                        type='file'
                                                        accept='audio/mp3,audio/*;capture=microphone'
                                                        onChange={handleSong}
                                                    />
                                                )
                                                : (
                                                    <input
                                                        id='song'
                                                        type='text'
                                                        className='form-control'
                                                        onChange={e => setLinkSrc(e.target.value)}
                                                        value={linkSrc}
                                                        placeholder='Input link mp3'
                                                    />
                                                )}


                                        </>
                                    )
                                    : (
                                        <audio controls>
                                            <source
                                                src={data.localSrc === 1
                                                    ? process.env.REACT_APP_API_SRC_AUDIO + data.src
                                                    : data.src}
                                                type='audio/ogg' />
                                            <source
                                                src={data.localSrc === 1
                                                    ? process.env.REACT_APP_API_SRC_AUDIO + data.src
                                                    : data.src}
                                                type='audio/mpeg' />
                                            Your browser does not support the audio element.
                                        </audio>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card-footer'>
                    <div className='d-flex justify-content-end'>
                        <button
                            onClick={handleUpload}
                            disabled={!btnUplaod}
                            className='btn btn-info'>Edit</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditASong;