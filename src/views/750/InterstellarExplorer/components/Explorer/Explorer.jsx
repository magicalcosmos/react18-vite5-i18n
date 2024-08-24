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

    const isEnoughDiamond = (count, callback) => {
        const drawType = count === 10 ? 'min' : count === 100 ? 'medium' : 'max';
        Get(`/api/diamond/${searchParams.get('uid')}?drawType=${drawType}&userType=${tab}`).then((res) => {
            switch (res.code) {
                case 204:
                    jsBridgeTopup();
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

    const getMarqueMesage = () => {
        Post('https://api.hihugging.com/chatroomMessage/commonSend', {
            "bizData":{
                "ext":{
                    "roomTitle":"风花雪月的房间"
                },
                "leftImg":"https://w2.heyhugging.com/hugging-user/1E57D436-5EC4-46F9-A82B-289CB663D05C.jpg",
                "bg":"https://w3.heyhugging.com/hugging-config/4ca133a5725e41d0b7e8dafdcc15e826.png",
                "type":1,
                "title":"恭喜",
                "content":"取得熱門清單Top 1"
            },
            "code":"1803",
            "roomId":"4fb5626b6ddf4bdb99001f4567721dfe",
            "uid":240870960050160042,
            "secret":"6fa56ccec6ba49b99e04849089559d13"
        }).then((res) => {
            
        }).catch(() => {

        });
    };

    const draw = (callback) => {
        const drawType = diamondCount === 10 ? 'min' : diamondCount === 100 ? 'medium' : 'max';
        Post(`/api/draw/${searchParams.get('uid')}?userType=${tab}&drawType=${drawType}`).then((res) => {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                setIsStop(true);
                if (res.code === 200) {
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
                        <img className={styleModule['close']} src={iconClose} onClick={() => jsBridgeClose()}/>
                        {
                            marqueMessage.length ? <span className={styleModule['notice-message']}>
                                <img className={styleModule['notice']} src={iconNotice} />
                                <span className={`${styleModule['message']}`}><Marquee>{marqueMessage}</Marquee></span>
                            </span> : null
                        }
                        <img 
                        className={`${styleModule['rules']} ${styleModule['rules-' + currentLang]}`} 
                        src={`/images/${currentLang}/icon-rules.png`} 
                        onClick={() => setRulesPopVisible(true)}
                        />
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