import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import NotPermission from '../../../notpermission';
import api from '../../../../axios'
import { toast } from 'react-toastify';
import Loading from '../../../loading';
import './style.css'
import AdminCrawlResult from './Result';

const CrawlSongNhacVn = () => {
    document.title = 'NhacVn Song Tool | Admin'
    const { dataUser } = useContext(UserContext)
    const [data, setData] = useState()
    const [btnLoading, setBtnLoading] = useState(false)
    const [link, setLink] = useState('')
    const [listCategory, setListCategory] = useState()
    const [listAlbum, setListAlbum] = useState()

    const handleGet = () => {
        setData()
        setBtnLoading(true)
        api.get('api/admin/tool/nhacvn', {
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
        return ( <Loading />)
    return (
        <>
            <div className='card'>
                <div className='card-header pb-0'>
                    <h3>Crawl Nhac.Vn song</h3>
                </div>
                <div className='card-body'>
                    <div className='d-flex justify-content-center'>
                        <input
                            className='form-control'
                            placeholder='Input Nhac.VN link'
                            type='text'
                            value={link}
                            onChange={e => setLink(e.target.value)}
                        />
                    </div>
                    <div className='text-end text-sm mt-1'>
                        <b>Example: </b>https://nhac.vn/bai-hat/nhat-sobJPrd
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
        </>
    );
};

export default CrawlSongNhacVn;