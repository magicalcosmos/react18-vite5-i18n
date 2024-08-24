

export const useLocation = () => {
    const getParamByKey = (key) => {
        const href = window.location.href;
        const params = href.slice(href.indexOf('?') + 1, href.length);
        if (params.length > 1) {
            let paramObj = params.split('&').map(p => p.split('=').map(decodeURIComponent));
            for (let [k, v ] of paramObj) {
                if (k === key) {
                    return v;
                }
            }
        }
        return '';
    };
    return {
        getParamByKey,
    }
};