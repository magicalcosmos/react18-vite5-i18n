import { useEffect, useState } from 'react';
import './LuckyGift.scss';
import { Button, Space, Swiper, Toast } from 'antd-mobile';
import { Get, Post } from '@/utils/Ajax';
import { useLocation } from "react-router-dom";
import iconLuckyPrice from '@/assets/images/icon_lucky_price.png';
import iconLuckyAmount from '@/assets/images/icon_lucky_amount.png';
import iconLuckyArrow from '@/assets/images/icon_lucky_arrow.png';
import Marquee from "react-fast-marquee";
import { useDevice } from '@/hooks/Tools';

const groupData = (data, column = 8) => {
    const newData = [];
    if (data.length > column) {
        const count = Math.floor(data.length / column);
        const leave = data.length % column;
        let subData = [];
        for (let i = 1; i <= column * count; i++) {
            subData.push(data[i - 1]);
            if (i % column == 0) {
                newData.push(JSON.parse(JSON.stringify(subData)));
                subData = [];
            }
        }
        if (leave > 0) {
            for (let i = leave; i > 0; i--) {
                subData.push(data[data.length - i]);
            }
            newData.push(subData)
        }
    } else {
        newData.push(data);
    }
    return newData;
};

const LuckyGift = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState({});
    const [currentObj, setCurrentObj] = useState(null);

    const { getOS } = useDevice();
    const device = getOS();

    const handleClick = (el) => {
        const newData = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < newData.length; ++i) {
            for (let j = 0; j < newData[i].length; ++j) {
                setCurrentObj(el);
                newData[i][j]['selected'] = newData[i][j].giftId === el.giftId;
            }
        }
        setData(newData);
    };

    /**
     * 盲盒列表
     */
    const items = data.map((item, index) => (
        <Swiper.Item key={index}>
            <div className='swiper-custom'>
                {item.map((el, idx) => {
                    return <div className={`custom-item ${el.selected ? 'custom-item-active' : ''}`} key={idx} onClick={() => handleClick(el)}>
                        <div>
                            <img className='item-icon' src={`${globalURL}/icons/${el['giftId']}.png`} />
                        </div>
                        <div className='gift-name'>
                            {
                                el[`giftName${currentLang.capitalizeFirstLetter()}`].length > 10 ?
                                    <Marquee speed={10}>
                                        {el[`giftName${currentLang.capitalizeFirstLetter()}`]}
                                    </Marquee> :
                                    el[`giftName${currentLang.capitalizeFirstLetter()}`]
                            }
                        </div>
                        <div>
                            <img src={iconLuckyPrice} className='diamond' />
                            <span className='value'>{el['value']}</span>
                        </div>
                    </div>
                })}
            </div>
        </Swiper.Item>
    ));

    const getGiftData = () => {
        Get(`/api/excel/data`).then((res) => {
            if (res.code === 200) {
                setData(groupData(res.data.gift));
            }
        }).catch(() => { });;
    };

    const getUserData = () => {
        Get(`/bx-api/diamond/${searchParams.get('uid')}`).then((res) => {
            if (res.code === 200) {
                setUserData(res.data);
            }
        }).catch(() => { });
    };

    /**
     * native获取json数据
     * @param {*} jsonStr 
     */
    const getRewardUserInfo = (jsonStr) => {
        const data = JSON.parse(jsonStr);
        data && draw(data);
    };

    /**
     * 赠送 
     */
    const handleGift = () => {
        if (currentObj.giftId) {
            if (device === 'android' || window.AndroidJS) {
                window.AndroidJS.jsBridgeGift();
            } else if (device === 'iOS' || window.webkit && window.webkit.messageHandlers) {
                window.webkit.messageHandlers.jsBridgeGift.postMessage({});
            }
        }
    };

    /**
     * 充值
     */
    const handleTopup = () => {
        if (device === 'android' || window.AndroidJS) {
            window.AndroidJS.jsBridgeTopup();
        } else if (device === 'iOS' || window.webkit && window.webkit.messageHandlers) {
            window.webkit.messageHandlers.jsBridgeTopup.postMessage({});
        }
    };

    /**
     * 赠送
     * @param {*} param0 
     * @returns 
     */
    const draw = (nativeParams) => {
        if (!currentObj) {
            return;
        }

        if (userData['normalAmount'] < currentObj['value']) {
            jsBridgeTopup();
            return;
        }
        Post(`/api/draw/${searchParams.get('uid')}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userType: 3,
                uid: searchParams('uid'),
                avatar: searchParams('avatar'),
                nickname: searchParams('nickName'),
                anchorId: searchParams.get('anchorId'),
                giftId: currentObj.giftId
            }),
        }).then((res) => {
            if (res.code === 200) {
                sendMessageToNative(res.data && res.data[0], nativeParams);
                getUserData();
            } else {
                Toast.show({
                    icon: 'fail',
                    content: 'Network Error or Server Error',
                });
            }
        }).catch(() => { });

    };

    const sendMessageToNative = (gift = {}, nativeParams = {}) => {
        Post('https://api.hihugging.com/chatroomMessage/commonSend', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "bizData": {
                        "toUidStr": "240720597220120011",
                        "toUid": nativeParams['uid'],
                        "giftName": gift['giftNameId'],
                        "toAvatar": nativeParams['avatar'] || "https://w2.heyhugging.com/hugging-user/1E57D436-5EC4-46F9-A82B-289CB663D05C.jpg",
                        "isBatch": "0",
                        "toNickname": nativeParams['nickName'],
                        "roomId": searchParams.get('roomId'),
                        "giftId": gift['giftId'],
                        "uid": searchParams['uid'],
                        "fromAccId": "",
                        "giftImg": `http://47.245.101.239/icons/${gift['giftId']}` || "https://w6.heyhugging.com/hugging-background/382ed719976f44898ccb6fefa75ac915.png",
                        "fromNickname": searchParams['nickName'],
                        "isFree": 0,
                        "appId": 10,
                        "giftPrice": gift['value'],
                        "fromAvatar": searchParams['avatar'],
                        "levelIcon": "",
                        "amount": "1",
                        "level": 0,
                        "warningIcon": false,
                        "toAccId": ""
                    },
                    "code": "324",
                    "roomId": searchParams.get('roomId'),
                    "uid": searchParams['uid'],
                    "secret": "6fa56ccec6ba49b99e04849089559d13"
                }),
        }).then(() => { }).catch(() => { });
    }
    useEffect(() => {
        window.getRewardUserInfo = getRewardUserInfo;
        getGiftData();
        getUserData();
    }, []);

    return (<div className='lucky-gift'>
        <div className='swiper-parent'>
            <Swiper>{items}</Swiper>
        </div>
        <div className='operation'>
            <img src={iconLuckyAmount} className='diamond' />
            <span className='value'>{userData['normalAmount']}</span>
            <span className='top-up' onClick={() => handleTopup()}>
                {t('top_up')}&nbsp;
                <img src={iconLuckyArrow} className='arrow' />
            </span>
            <span className='btns' onClick={handleGift}>
                <span className='amount'>1</span>
                <span className='gift'>{t('gift')}</span>
            </span>
        </div>
    </div>);
};

export default LuckyGift;