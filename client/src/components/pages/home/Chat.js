import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Loading from '../loading';
import api from '../../axios'
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

const Chat = () => {
    const { dataUser } = useContext(UserContext)
    const [data, setData] = useState()
    const [msg, setMsg] = useState('')
    const [btnSend, setBtnSend] = useState(false)
    const ulRef = useRef()

    const handleChat = e => {
        e.preventDefault()
        if (msg.trim().length === 0) {
            toast.error('Enter message!')
        } else {
            setBtnSend(true)
            api.post('api/chat', {
                msg,
            }).then(res => {
                setBtnSend(false)
                if (!res.data.success)
                    toast.error(res.data.message)
            })
        }
    }
    const handleClear = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='card'>
                        <div className='card-header text-center'>
                            <h1>Are you sure?</h1>
                        </div>
                        <div className='card-body'>
                            <p>You want to clear chat?</p>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-secondary mx-1' onClick={onClose}>No</button>
                                <button
                                    className='btn btn-danger mx-1'
                                    onClick={() => apiClear(onClose)}
                                >
                                    Yes!
                                </button>
                            </div>

                        </div>

                    </div>
                );
            }
        });
    }
    const apiClear = close => {
        close()
        api.delete('api/chat/clear')
    }
    useEffect(() => {
        if (dataUser && dataUser.socket) {
            dataUser.socket.on('chatAdd', res => {
                setData(prev => ([
                    ...prev,
                    res
                ]))
                setMsg('')
                ulRef.current.scrollTop = ulRef.current.scrollHeight
            })
            dataUser.socket.on('chatClear', () => {
                setData([])
                ulRef.current.scrollTop = ulRef.current.scrollHeight
            })
            return () => {
                dataUser.socket.off('chatAdd')
                dataUser.socket.off('chatClear')
            }
        }
    }, [dataUser])
    useEffect(() => {
        api.get('api/chat').then(res => {
            setData(res.data)
        })
    }, [])
    useEffect(() => {
        if (data && ulRef.current)
            ulRef.current.scrollTop = ulRef.current.scrollHeight
    }, [data, ulRef])
    if (!data)
        return (<Loading />)
    return (
        <>
            <div className='home-list-top card p-3 mb-4'>
                <div className='chat-container'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='text-dark font-weight-bolder mb-4 pt-2'>Chat</div>
                        <div>
                            {dataUser && dataUser.role >= 10 && (
                                <button onClick={handleClear} className='btn btn-sm bg-gradient-danger'>Clear</button>
                            )}

                        </div>
                    </div>
                    <div className='chat-list'>
                        {data && data.length > 0 ? (
                            <ul ref={ulRef}>
                                {data.map((e, i) => (
                                    <div key={e.id}>
                                        {e.uid === dataUser.id ? (
                                            <li
                                                className='text-right'
                                                key={e.id}>
                                                <div className='d-flex justify-content-end align-items-center'>
                                                    <div className='chat-msg'>
                                                        <div className='chat-msg-name'>
                                                            {e.name}
                                                        </div>
                                                        <div className='chat-msg-content'>
                                                            {e.msg}
                                                        </div>
                                                    </div>
                                                    <div className='chat-avatar'>
                                                        <img className='avatar avatar-sm' src={e?.localAvatar === 1 ? process.env.REACT_APP_API_SRC_USER_IMG + e.avatar : e.avatar} alt={e?.name} />
                                                    </div>
                                                </div></li>
                                        ) : (
                                            <li
                                                className='text-left'
                                                key={e.id}>
                                                <div className='d-flex justify-content-start align-items-center'>
                                                    <div className='chat-avatar'>
                                                        <img className='avatar avatar-sm' src={e?.localAvatar === 1 ? process.env.REACT_APP_API_SRC_USER_IMG + e.avatar : e.avatar} alt={e?.name} />
                                                    </div>
                                                    <div className='chat-msg'>
                                                        <div className='chat-msg-name'>
                                                            {e.name}
                                                        </div>
                                                        <div className='chat-msg-content'>
                                                            {e.msg}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <div className='text-center mb-2'>No one chat here!</div>
                        )}

                    </div>
                    <form onSubmit={handleChat}>
                        <div className='chat-create'>

                            <input
                                onChange={e => setMsg(e.target.value)}
                                placeholder='Enter message!'
                                value={msg}
                                className='form-control' />
                            <button
                                disabled={btnSend}
                                className='btn bg-gradient-info m-0'>
                                <i className='fa fa-paper-plane'></i>
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chat;