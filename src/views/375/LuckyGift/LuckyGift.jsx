import { useEffect, useState } from 'react';
import './LuckyGift.scss';
import { Button, Space, Swiper, Toast } from 'antd-mobile';
import { Get, Post } from '@/utils/Ajax';
import { useLocation } from "react-router-dom";
import iconLuckyPrice from '@/assets/images/icon_lucky_price.png';
import iconLuckyAmount from '@/assets/images/icon_lucky_amount.png';
import iconLuckyArrow from '@/assets/images/icon_lucky_arrow.png';
import Marquee from "react-fast-marquee";

const groupData = (data, column = 8) => {
    const newData = [];
    if (data.length > column) {
        const count = Math.floor(data.length / column);
        const leave = data.length % column;
        let subData = [];
        for(let i = 1; i <= column * count; i++) {
            subData.push(data[i - 1]);
            if (i % column == 0) {
                newData.push(JSON.parse(JSON.stringify(subData)));
                subData = [];
            }
        }
        if (leave > 0) {
            for(let i = leave; i > 0; i--) {
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

    const handleClick = (el) => {
        const newData = JSON.parse(JSON.stringify(data));
        for(let i = 0; i < newData.length; ++i) {
            for(let j = 0; j < newData[i].length; ++j) {
                setCurrentObj(el);
                newData[i][j]['selected'] = newData[i][j].giftId === el.giftId;
            }
        }
        setData(newData);
    };

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
                    <img src={iconLuckyPrice} className='diamond'/>
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
        }).catch(() => {});;
    };

    const getUserData = () => {
        Get(`/bx-api/diamond/${searchParams.get('uid')}`).then((res) => {
            if (res.code === 200) {
                setUserData(res.data);
            }
        }).catch(() => {});
    };

    const handleGift = () => {
        draw({});
        jsBridgeGift((toUserParams) => {
            if (currentObj.giftId) {
                draw(toUserParams);
            }
        });
    };

    const draw = ({ uid, avatar, nickname}) => {
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
            uid, 
            avatar, 
            nickname, 
            anchorId: searchParams.get('anchorId'),
            giftId: currentObj.giftId
           }),
        }).then((res) => {
            if (res.code === 200) {
                getUserData();
            } else {
                Toast.show({
                    icon: 'fail',
                    content: 'Network Error or Server Error',
                });
            }
        }).catch(() => {});

    };

    useEffect(() => {
        getGiftData();
        getUserData();
    }, []);

    return (<div className='lucky-gift'>
        <div className='swiper-parent'>
            <Swiper>{items}</Swiper>
        </div>
        <div className='operation'>
         <img src={iconLuckyAmount} className='diamond'/>
         <span className='value'>{userData['normalAmount']}</span>
         <span className='top-up' onClick={() => jsBridgeTopup()}>
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