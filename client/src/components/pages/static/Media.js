import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    MdOutlineQueueMusic,
    MdSkipPrevious,
    MdPlayCircleOutline,
    MdPauseCircleOutline,
    MdSkipNext,
    MdOutlineVolumeUp,
    MdOutlineVolumeOff,
    MdOutlineRepeat,
    MdOutlineRepeatOne,
} from 'react-icons/md'
import {
    FaRandom,
} from 'react-icons/fa'
import TimeSlider from "react-input-slider";
import { ListMusicContext } from '../../contexts/ListMusicContext';
import ListMedia from './ListMedia';
import './media.css'

function sToTime(t) {
    return padZero(parseInt((t / (60 * 60)) % 24)) + ":" +
        padZero(parseInt((t / (60)) % 60)) + ":" +
        padZero(parseInt((t) % 60));
}
function padZero(v) {
    return (v < 10) ? "0" + v : v;
}
const Media = () => {
    const { listMusic, audioIndex, setAudioIndex, isPlay, setPlay } = useContext(ListMusicContext)
    // const [isPlay, setPlay] = useState(false)
    // const [audioIndex, setAudioIndex] = useState(0)
    const audioRef = useRef();
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [showListMusic, setShowListMusic] = useState(false)
    const [random, setRandom] = useState(false)
    const [repeatOne, setRepeatOne] = useState(false)
    
    const handleLoadedData = () => {
        setDuration(audioRef.current.duration);
        setVolume(audioRef.current.volume);
        if (isPlay) audioRef.current.play();
    };
    const handlePausePlayClick = () => {
        // if (isPlay) {
        //     audioRef.current.pause();
        // } else {
        //     audioRef.current.play();
        // }
        setPlay(!isPlay);
    };
    const handleTimeSliderChange = ({ x }) => {
        audioRef.current.currentTime = x;
        setCurrentTime(x);

        // if (!isPlay) {
        //     setPlay(true);
        //     audioRef.current.play();
        // }
    }
    const handleChangeVolume = e => {
        setVolume(parseFloat(e.target.value));
    }
    const handleShowListMusic = () => {
        setShowListMusic(!showListMusic)
    }
    const handlePrev = () => {
        if(audioIndex === 0){
            setAudioIndex(listMusic.length - 1)
        }else{
            setAudioIndex(prev => prev - 1)
        }
    }
    const repeat = () => {
        if (repeatOne) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else {
            if (audioIndex === listMusic.length - 1) {
                setAudioIndex(0)
            } else {
                if (random) {
                    let a;
                    do {
                        a = Math.floor(Math.random() * listMusic.length)
                    } while (a === audioIndex)
                    setAudioIndex(a)
                } else {
                    setAudioIndex(prev => (prev + 1))
                }
            }
        }
    }

    useEffect(() => {
        if(audioRef.current)
            audioRef.current.volume = volume;
    }, [volume, audioRef])
    useEffect(() => {
        if(audioRef.current)
            if (isPlay) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
    }, [isPlay, audioRef])
    if(listMusic.length === 0)
        return ( null )
    return (
        <>
            <audio
                ref={audioRef}
                src={listMusic[audioIndex].localSrc === 1
                    ? process.env.REACT_APP_API_SRC_AUDIO + listMusic[audioIndex].src
                    : listMusic[audioIndex].src
                }
                onLoadedData={handleLoadedData}
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
                onEnded={repeat}
            />
            <div className='navbar px-0 mx-2 shadow-none border-radius-xl blur shadow-blur left-auto z-index-sticky media-container'>
                <div className='container-fluid py-1 px-3'>
                    <div className='border-radius-xl media'>
                        <div className='media-left'>
                            <div className='header_img'>
                                <img
                                    className='media-img'
                                    src={listMusic[audioIndex].localImg ? process.env.REACT_APP_API_SRC_AUDIO_IMG + listMusic[audioIndex].img : listMusic[audioIndex].img}
                                    alt='music avatar' />
                            </div>
                            <div className='media-info'>
                                <div className='media-name'>
                                    {listMusic[audioIndex].title}
                                </div>
                                <div className='media-singer'>
                                    <span>{listMusic[audioIndex].artist}</span>
                                </div>
                            </div>
                        </div>

                        <div className='media-center'>
                            <div className='media-control'>
                                <FaRandom
                                    onClick={() => setRandom(!random)}
                                    className={(random) ? 'media-random media-random-active' : 'media-random'}
                                />
                                <MdSkipPrevious
                                    onClick={handlePrev}
                                    className='media-btn' />
                                {isPlay
                                    ? <MdPauseCircleOutline onClick={handlePausePlayClick} className='media-btn media-playpause' />
                                    : <MdPlayCircleOutline onClick={handlePausePlayClick} className='media-btn media-playpause' />
                                }
                                <MdSkipNext
                                    onClick={() => setAudioIndex((audioIndex + 1) % listMusic.length)}
                                    className='media-btn' />
                                {repeatOne
                                    ? <MdOutlineRepeatOne
                                        onClick={() => setRepeatOne(!repeatOne)}
                                        className='media-repeat' />
                                    : <MdOutlineRepeat
                                        onClick={() => setRepeatOne(!repeatOne)}
                                        className='media-repeat' />
                                }
                            </div>
                            <div className='media-slider'>
                                <div className='curenttime'>
                                    {sToTime(currentTime)}
                                </div>
                                <div className='media-content'>
                                    <TimeSlider
                                        axis="x"
                                        xmax={duration}
                                        x={currentTime}
                                        onChange={handleTimeSliderChange}
                                        styles={{
                                            track: {
                                                backgroundColor: "#e3e3e3",
                                                height: "2px",
                                            },
                                            active: {
                                                backgroundColor: "#333",
                                                height: "2px",
                                            },
                                            thumb: {
                                                marginTop: "-3px",
                                                width: "8px",
                                                height: "8px",
                                                backgroundColor: "#8592a3",
                                                borderRadius: '50%',
                                            },
                                        }}
                                    />
                                </div>
                                <div className='endtime'>
                                    {sToTime(duration)}
                                </div>
                            </div>
                        </div>

                        <div className='media-right'>
                            <div className='media-volume'>
                                {(volume === 0)
                                    ? <MdOutlineVolumeOff />
                                    : <MdOutlineVolumeUp />
                                }
                                <div className='media-volume-show'>
                                    <input min={0} max={1} step={0.001} onChange={handleChangeVolume} defaultValue={volume} type="range" orient="vertical" className='media-volume-slider' />
                                </div>
                            </div>
                            <div className='media-btn-list'>
                                <MdOutlineQueueMusic onClick={handleShowListMusic} className='cursor-pointer' />
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <div className={showListMusic ? 'media-list media-list-active' : 'media-list'}>
                <ListMedia audioIndex={audioIndex} setAudioIndex={setAudioIndex} audioRef={audioRef} setPlay={setPlay}/>
            </div>

        </>
    );
};

export default Media;