import styleModule from "./PrizePop.module.scss";
import diamond from '@/assets/images/diamond.png';
import prize from '@/assets/images/prize.png';

const PrizePop = ({ visible = false, data = [], style = {}, value = 10, onCancel = () => {}, onConfirm = () => {} }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const styleObj = Object.assign({
        display: visible ? 'flex' : 'none'
    });
    return (
       <div className={styleModule['main']} style={styleObj}>
         <div className={styleModule['content']} style={style}>
            <div className={styleModule['head']}>
                <img src={`/src/assets/images/${currentLang}/prize-title.png`} />
            </div>
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
                        <em>{value}</em>
                    </span>
                </span>
            </div>
         </div>
       </div>
    );
};


export default PrizePop;