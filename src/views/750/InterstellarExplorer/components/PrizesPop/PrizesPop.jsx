import styleModule from "./PrizesPop.module.scss";
import diamond from '@/assets/images/diamond.png';
import prize from '@/assets/images/prize.png';

const PrizesPop = ({ visible = false, data = [], style = {}, value = 10, onCancel = () => {}, onConfirm = () => {} }) => {
    const { t } = useTranslation();
    const styleObj = Object.assign({
        display: visible ? 'flex' : 'none'
    });

    // let listStyle = {};
    // if (data && data.length < 5) {
    //     listStyle = {
    //         "alignContent": "center",
    //     }
    // }
    
    return (
       <div className={styleModule['main']} style={styleObj}>
         <div className={styleModule['content']} style={style}>
            <div className={styleModule['head']}></div>
            <div className={styleModule['prizes']}>
                <ul className={styleModule['prizes-list']}>
                    {data.length && data.map((item, index) => {
                    return <li className={styleModule['prize']} key={index}>
                    <div className={styleModule['img']}>
                        <img src={item.giftId ? `${globalURL}/icons/${item['giftId']}.png` : prize} />
                    </div>
                    <div className={styleModule['name']}>{item['name']}</div>
                    <div className={styleModule['price']}>            
                        <img src={diamond} />
                        <em>{ item['value'] }</em>
                    </div>
                </li>
                    })}
                </ul>
            </div>

            <div className={styleModule['btns']}>
                <span className={styleModule['think-about']} onClick={onCancel}>
                    <span>{t('enjoy_prize')}</span>
                </span>
                <span className={styleModule['confirm']} onClick={onConfirm}>
                    <span>{t('explorer_again')} </span>
                    <span>
                        <img src={diamond} />
                        <em>{ value }</em>
                    </span>
                </span>
            </div>
         </div>
       </div>
    );
};


export default PrizesPop;