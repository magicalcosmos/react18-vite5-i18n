import styleModule from "./RulesPop.module.scss";
import rulesBackImg from '@/assets/images/rules-back.png';

const RulesPop = ({ visible = false, onClick=() => {} }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const styleObj = Object.assign({
        display: visible ? 'flex' : 'none'
    });
    
    return (
       <div className={styleModule['main']} style={styleObj}>
         <div className={styleModule[`content-${currentLang}`]}>
            <div className={styleModule['back']} onClick={onClick}>
              <img src={rulesBackImg} />
            </div>
            <div className={styleModule['rule-img']}>
               <img src={`/images/test.webp`} style={{width: '100%', height: '3000px'}}/>
            </div>
         </div>
       </div>
    );
};


export default RulesPop;