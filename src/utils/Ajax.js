/**
 * 封装的 fetch 请求函数
 * @param {string} url - 请求的 URL
 * @param {Object} options - fetch 的选项，包含 method, headers, body 等
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise} - 返回一个 Promise，解析为 JSON 数据或错误信息
 */
function fetchWrapper(url, options = {}, timeout = 30000) {
    // 创建一个超时的 Promise
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeout)
    );
    
    // 使用 fetch 发起请求
    const fetchPromise = fetch(url, options)
        .then(response => {
            // 检查 HTTP 状态码是否为 2xx
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // 解析响应为 JSON
            if (options.fileStream === true) {
                return response.blob();
            }
            return response.json();
        });

    // 使用 Promise.race 来处理超时
    return Promise.race([fetchPromise, timeoutPromise])
        .catch(error => {
            // 捕获 fetch 或超时错误
            console.error('Fetch error:', error);
            throw error;
        });
}


export function Get(url, options = {}) {
    return fetchWrapper(url, {
        method: 'GET',
        ...options
    });
};

export function Post(url, options = {}) {
    return fetchWrapper(url, {
        method: 'POST',
        ...options
    });
}