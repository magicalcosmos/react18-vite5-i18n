import styleModule from "./Explorer.module.scss";
import diamond from '@/assets/images/diamond.png';
import iconClose from '@/assets/images/icon-close.png';
import iconNotice from '@/assets/images/icon-notice.png';
import Marquee from "react-fast-marquee";
import { Toast } from 'antd-mobile';

import ConfirmPop from '../ConfirmPop/ConfirmPop';
import PrizesPop from '../PrizesPop/PrizesPop';
import PrizePop from '../PrizePop/PrizePop';
import RulesPop from '../RulesPop/RulesPop';
import { useEffect, useState } from "react";
import { Get, Post } from '@/utils/Ajax';
import { useLocation } from "react-router-dom";
import { useDevice } from '@/hooks/Tools';

const time = 80;
const fixedTime = 1000 * 60 * 60 * 60;

const drawValue = {
    '1': {
        min: 10,
        medium: 100,
        max: 1000
    },
    '2': {
        min: 20,
        medium: 200,
        max: 2000
    }
};

const Explorer = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [tab, setTab] = useState(1);
    const [confirmPopVisible, setConfirmPopVisible] = useState(false);
    const [diamondCount, setDiamondCount] = useState(0);
    const [prizesPopVisible, setPrizesPopVisible] = useState(false);
    const [prizePopVisible, setPrizePopVisible] = useState(false);
    const [rulesPopVisible, setRulesPopVisible] = useState(false);
    const [marqueMessage, setMarqueMessage] = useState('');

    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    const [bubbleIndex, setBubbleIndex] = useState(0);
    const [isStop, setIsStop] = useState(true);
    const [prizesPopData, setPrizesPopData] = useState([]);
    const { getOS } = useDevice();
    const device = getOS();

    const getBubbles = () => {
        return (<>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
                const className = `${bubbleIndex === item ? styleModule['bubble-active'] : 'bubble'}`
                return (<span className={styleModule[`bubble${item}`]} key={item}>
                    <span className={className}></span>
                    <span></span>
                </span>);
            })}
        </>);
    };

    const groupData = (data) => {
        data && data.forEach((item) => {
            item['name'] = item[`giftName${currentLang.capitalizeFirstLetter()}`];
        });
        return data;
    }

    const handleExplorer = (count) => {
        if (!isStop) {
            return;
        }
        setDiamondCount(count);
        isEnoughDiamond(count, () => {
            setConfirmPopVisible(true);
        }); 
    };

    const onConfirm = () => {
        draw();
        setConfirmPopVisible(false);
        setIsStop(false);
        setBubbleIndex(bubbleIndex + 1); 
    };

    const explorerAgain = () => {
        isEnoughDiamond(diamondCount, () => {
            draw();
            setConfirmPopVisible(false);
            setIsStop(false);
            setBubbleIndex(bubbleIndex + 1); 
            setPrizePopVisible(false);
            setPrizesPopVisible(false);
        });
    };

    const handleClose = () => {
        if (device === 'android' || window.AndroidJS) {
            window.AndroidJS.jsBridgeClose();
        } else if(device === 'iOS' || window.webkit && window.webkit.messageHandlers){
            window.webkit.messageHandlers.jsBridgeClose.postMessage({});
        }
    };
    /**
     * 充值
     */
    const handleTopup = () => {
        if (device === 'android' || window.AndroidJS) {
            window.AndroidJS.jsBridgeTopup();
        } else if(device === 'iOS' || window.webkit && window.webkit.messageHandlers){
            window.webkit.messageHandlers.jsBridgeTopup.postMessage({});
        }
    };

    const isEnoughDiamond = (count, callback) => {
        const drawType = count === 10 ? 'min' : count === 100 ? 'medium' : 'max';
        Get(`/bx-api/diamond/${searchParams.get('uid')}?drawType=${drawType}&userType=${tab}`).then((res) => {
            switch (res.code) {
                case 204:
                    handleTopup();
                    break;
                case 200:
                    typeof callback === 'function' && callback();
                    break;
                case 400:
                case 500:
                    Toast.show({
                        icon: 'fail',
                        content: 'Network Error or Server Error',
                    });
                default:
                    break;
            }

        }).catch(() => {});
    };

    const draw = (callback) => {
        const drawType = diamondCount === 10 ? 'min' : diamondCount === 100 ? 'medium' : 'max';
        Post(`/api/draw/${searchParams.get('uid')}`, {
            headers: {
                'Content-Type': 'application/json'
            },
           body: JSON.stringify({
            userType: tab,
            drawType,
            avatar: searchParams.get('avatar'), 
            nickName: searchParams.get('nickName'), 
            roomId: searchParams.get('roomId')
           }),
        }).then((res) => {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                setIsStop(true);
                if (res.code === 200) {
                    // 成功后重新拉取数据
                    getCongratulations();
                    if (res.data && res.data.length > 1) {
                        setPrizesPopVisible(true);
                    } else {
                        setPrizePopVisible(true);
                    }
                    setPrizesPopData(groupData(res.data));
                } else {
                    Toast.show({
                        icon: 'fail',
                        content: 'Network Error or Server Error',
                    });
                }
            }, 3000)
        }).catch(() => {});

    };

    const getCongratulations = () => {
        Get('/api/interstellar-explorer?size=60').then((res) => {
            if (res.code === 200) {
                let message = '';
                res.data.forEach(item => {
                    const gifts = JSON.parse(item['giftName']).join('、');
                    message += t('congratratulations', {
                        name: item.nickName,
                        gifts,
                    });
                });
                setMarqueMessage(message);
            }

            
        }).catch(() => {
        });
    }

    useEffect(() => {
        getCongratulations();
    }, []);

    useEffect(() => {
        let timeoutId = null;
        if (!isStop) {
            timeoutId = setTimeout(() => {
                const index = bubbleIndex + 1;
                setBubbleIndex(index > 10 ? 1 : index);
            }, time);
        } else {
            setBubbleIndex(0);
        }
        return () => timeoutId && clearTimeout(timeoutId);
    }, [bubbleIndex]);

    return (
        <>
            <div className={styleModule['main']}>
                <div className={styleModule[tab === 2 ? 'content-advanced' : 'content']}>
                    {/* head */}
                    <div className={styleModule['head']}>
                        <img className={styleModule['close']} src={iconClose} onClick={() => handleClose()}/>
                        {
                            marqueMessage.length ? <span className={styleModule['notice-message']}>
                                <img className={styleModule['notice']} src={iconNotice} />
                                <span className={`${styleModule['message']}`}><Marquee>{marqueMessage}</Marquee></span>
                            </span> : null
                        }
                        {/* <img 
                        className={`${styleModule['rules']} ${styleModule['rules-' + currentLang]}`} 
                        src={`/images/${currentLang}/icon-rules.png`} 
                        onClick={() => setRulesPopVisible(true)}
                        /> */}
                    </div>

                    {/* title */} 
                    <div className={styleModule['title']}>
                        <img src={`/images/${currentLang}/title.png`} />
                    </div>

                    {/* 星系切换 */}
                    <div className={styleModule[`galaxy-${currentLang}`]}>
                        <span className={styleModule[`galaxy-left-${currentLang}`]}></span>
                        <span className={styleModule[`galaxy-right-${currentLang}`]}></span>
                        <ul>
                            <li className={styleModule[tab === 1 ? 'galaxy-selected' : 'galaxy-plain']} onClick={() => setTab(1)}>{t('galaxy_plain')}</li>
                            <li className={styleModule[tab === 2 ? 'galaxy-selected' : 'galaxy-plain']} onClick={() => setTab(2)}>{t('galaxy_advanced')}</li>
                            <li className={styleModule[tab === 1 ? `line-${currentLang}` : `line-right-${currentLang}`]}></li>
                        </ul>
                    </div>

                    {/* 转盘 */}
                    <div className={styleModule['bubbles']}>
                        {getBubbles()}
                    </div>
                    {/* 按钮 */}
                    <div className={styleModule['btns']}>
                        <div className={styleModule['btn-one']} onClick={() => handleExplorer(drawValue[tab].min)}>
                            <span className={styleModule['gan']}>{t('explorer', { count: 1 })}</span>
                            <span className={styleModule['diamond']}>
                                <img src={diamond} />
                                <em>{drawValue[tab].min}</em>
                            </span>
                        </div>
                        <div className={styleModule['btn-ten']} onClick={() => handleExplorer(drawValue[tab].medium)}>
                            <span className={styleModule['gan']}>{t('explorer', { count: 10 })}</span>
                            <span className={styleModule['diamond']}>
                                <img src={diamond} />
                                <em>{drawValue[tab].medium}</em>
                            </span>
                        </div>
                        <div className={styleModule['btn-hundred']} onClick={() => handleExplorer(drawValue[tab].max)}>
                            <span className={styleModule['gan']}>{t('explorer', { count: 100 })}</span>
                            <span className={styleModule['diamond']}>
                                <img src={diamond} />
                                <em>{drawValue[tab].max}</em>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmPop
                visible={confirmPopVisible}
                message={t('confirm_info', { diamond: diamondCount })}
                style={{ top: '45px' }}
                onCancel={() => setConfirmPopVisible(false)}
                onConfirm={() => onConfirm()}
            />
            <PrizesPop
                visible={prizesPopVisible}
                data={prizesPopData}
                value={diamondCount}
                onCancel={() => setPrizesPopVisible(false)}
                onConfirm={() => explorerAgain()}
            />
            <PrizePop
                visible={prizePopVisible}
                data={prizesPopData}
                value={diamondCount}
                onCancel={() => setPrizePopVisible(false)}
                onConfirm={() => explorerAgain()}
            />
            <RulesPop
                visible={rulesPopVisible}
                onClick={() => setRulesPopVisible(false)}
            />
        </>
    );
};

export default Explorer;