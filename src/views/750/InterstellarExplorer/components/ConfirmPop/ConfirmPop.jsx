import styleModule from "./ConfirmPop.module.scss";
const ConfirmPop = ({ visible = false, message = '', style = {}, onCancel = () => {}, onConfirm = () => {} }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    const styleObj = Object.assign({
        display: visible ? 'flex' : 'none'
    });
    
    return (
       <div className={styleModule['main']} style={styleObj}>
         <div className={styleModule[`content-${currentLang}`]} style={style}>
            <div className={styleModule['message']}>{message}</div>
            <div className={styleModule['btns']}>
                <span className={styleModule[`think-about-${currentLang}`]} onClick={onCancel}>{t('think_about')}</span>
                <span className={styleModule[`confirm-${currentLang}`]} onClick={onConfirm}>{t('confirm')}</span>
            </div>
         </div>
       </div>
    );
};

export default ConfirmPop;