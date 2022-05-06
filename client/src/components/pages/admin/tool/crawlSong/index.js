import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChiaSeNhac from '../../../../resources/images/csn.jpg'
import Nhaccuatui from '../../../../resources/images/nct.jpg'
import NhacVn from '../../../../resources/images/nhacvn.jpg'
import Keeng from '../../../../resources/images/keeng.jpg'

const CrawlSongTool = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className='card my-4'>
                <div className='card-header pb-0'>
                    <h3>Crawl song tool</h3>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-3 col-12 mt-2'>
                            <div className='card bg-gradient-success d-flex justify-content-center align-items-center py-4'>
                                <img 
                                    className='avatar avatar-xl mb-2'
                                    src={Nhaccuatui}
                                    alt='Nhaccuatui'
                                />
                                <h5 onClick={() => navigate('/admin/tool/crawl-song/nct')} className='btn btn-info text-white'>Nhaccuatui</h5>
                            </div>
                        </div>
                        <div className='col-md-3 col-12 mt-2'>
                            <div className='card bg-gradient-secondary d-flex justify-content-center align-items-center py-4'>
                                <img 
                                    className='avatar avatar-xl mb-2'
                                    src={NhacVn}
                                    alt='NhaCVn'
                                />
                                <h5 onClick={() => navigate('/admin/tool/crawl-song/nhacvn')} className='btn btn-info text-white'>Nhac.Vn</h5>
                            </div>
                        </div>
                        <div className='col-md-3 col-12 mt-2'>
                            <div className='card bg-gradient-secondary d-flex justify-content-center align-items-center py-4'>
                                <img 
                                    className='avatar avatar-xl mb-2'
                                    src={ChiaSeNhac}
                                    alt='Chiasenhac'
                                />
                                <h5 onClick={() => navigate('/admin/tool/crawl-song/csn')} className='btn btn-info text-white'>ChiaSeNhac</h5>
                            </div>
                        </div>
                        <div className='col-md-3 col-12 mt-2'>
                            <div className='card bg-gradient-secondary d-flex justify-content-center align-items-center py-4'>
                                <img 
                                    className='avatar avatar-xl mb-2'
                                    src={Keeng}
                                    alt='keeng'
                                />
                                <h5 onClick={() => navigate('/admin/tool/crawl-song/keeng')} className='btn btn-info text-white'>Keeng.Vn</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrawlSongTool;