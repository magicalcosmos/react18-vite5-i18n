import styl from "./InterstellarExplorer.module.scss";

const InterstellarExplorer = () => {
    const { t } = useTranslation();

    console.log(t("explorer", { count: 123 })); 
    return (
        <div>
            <h1 className={styl.test}>StarDetect</h1>
        </div>
    );
};
export default InterstellarExplorer;