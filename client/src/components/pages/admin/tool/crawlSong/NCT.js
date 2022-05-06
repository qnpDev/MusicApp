import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import NotPermission from '../../../notpermission';
import api from '../../../../axios'
import { toast } from 'react-toastify';
import Loading from '../../../loading';
import './style.css'
import AdminCrawlResult from './Result';
import AdminCrawlResultList from './ResultList';

const CrawlSongNCT = () => {
    document.title = 'Nhaccuatui Song Tool | Admin'
    const { dataUser } = useContext(UserContext)
    const [data, setData] = useState()
    const [dataPlaylist, setDataPlaylist] = useState()
    const [btnLoading, setBtnLoading] = useState(false)
    const [btnLoadingPlaylist, setBtnLoadingPlaylist] = useState(false)
    const [link, setLink] = useState('')
    const [linkPLaylist, setLinkPLaylist] = useState('')
    const [listCategory, setListCategory] = useState()
    const [listAlbum, setListAlbum] = useState()

    const handleGet = () => {
        setData()
        setBtnLoading(true)
        api.get('api/admin/tool/nhaccuatui', {
            params: {
                uri: link
            }
        }).then(res => {
            if (res.data?.success === false) {
                toast.error(res.data.message)
            } else {
                setData(res.data)
                toast.success('Successful!')
            }
            setBtnLoading(false)
        })
    }

    const handleGetPlaylist = () => {
        setDataPlaylist()
        setBtnLoadingPlaylist(true)
        api.get('api/admin/tool/list-nhaccuatui', {
            params: {
                uri: linkPLaylist
            }
        }).then(res => {
            if (res.data?.success === false) {
                toast.error(res.data.message)
            } else {
                setDataPlaylist(res.data)
                toast.success('Successful!')
            }
            setBtnLoadingPlaylist(false)
        })
    }

    useEffect(() => {
        api.get('api/admin/home/allalbum').then(res => {
            setListAlbum(res.data)
        })
        api.get('api/admin/home/allcategory').then(res => {
            setListCategory(res.data)
        })
    }, [])

    if (!dataUser || dataUser.role < 10)
        return (<NotPermission />)
    if(!listAlbum || !listCategory)
        return (<Loading/>)
    return (
        <>
            <div className='card'>
                <div className='card-header pb-0'>
                    <h3>Crawl Nhaccuatui song</h3>
                </div>
                <div className='card-body'>
                    <div className='d-flex justify-content-center'>
                        <input
                            className='form-control'
                            placeholder='Input nhaccuatui link'
                            type='text'
                            value={link}
                            onChange={e => setLink(e.target.value)}
                        />
                    </div>
                    <div className='text-end text-sm mt-1'>
                        <b>Example: </b>https://www.nhaccuatui.com/bai-hat/da-vu-tang-duy-tan.8Q8yLCcES92H.html
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <button
                            disabled={btnLoading}
                            onClick={handleGet}
                            className='btn btn-info'>Get song</button>
                    </div>
                    {btnLoading && (
                        <Loading />
                    )}
                    {data && (
                        <AdminCrawlResult data={data} setLink={setLink} setData={setData} listAlbum={listAlbum} listCategory={listCategory} />
                    )}
                </div>
            </div>
            <div className='card mt-4'>
                <div className='card-header pb-0'>
                    <h3>Crawl Nhaccuatui playlist</h3>
                </div>
                <div className='card-body'>
                    <div className='d-flex justify-content-center'>
                        <input
                            className='form-control'
                            placeholder='Input nhaccuatui link'
                            type='text'
                            value={linkPLaylist}
                            onChange={e => setLinkPLaylist(e.target.value)}
                        />
                    </div>
                    <div className='text-end text-sm mt-1'>
                        <b>Example: </b>https://www.nhaccuatui.com/playlist/duyen-het-roi-phan-ai-so-kiep-choi-voi-va.yOKkv9wNDsL7.html
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <button
                            disabled={btnLoadingPlaylist}
                            onClick={handleGetPlaylist}
                            className='btn btn-info'>Get list</button>
                    </div>
                    {btnLoadingPlaylist && (
                        <Loading />
                    )}
                    {dataPlaylist && (
                        <>
                            <AdminCrawlResultList data={dataPlaylist} setLink={setLinkPLaylist} setData={setDataPlaylist} listAlbum={listAlbum} listCategory={listCategory} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CrawlSongNCT;