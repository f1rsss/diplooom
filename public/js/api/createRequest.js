/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const { method, url, data, callback } = options;

    const xhr = new XMLHttpRequest();
    let requestURL = url;
    let formData = null;

    if (method === 'GET' && data) {
        let query = Object.entries(data)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');
        requestURL += `?${query}`;
    } else if (method !== 'GET' && data) {
        formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
    }

    xhr.responseType = 'json';
    xhr.open(method, requestURL);

    xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(null, xhr.response);
        } else {
            callback(xhr.response || new Error(`HTTP ${xhr.status}`), xhr.response);
        }
    });

    xhr.addEventListener('error', () => {
        callback(new Error('Ошибка сети'));
    });

    if (method === 'GET') {
        xhr.send();
    } else {
        xhr.send(formData);
    }
};
