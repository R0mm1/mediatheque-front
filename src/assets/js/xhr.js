const config = require('../../../mediatheque');

const Xhr = {

    verifyToken() {
        let createdAt = parseInt(localStorage.getItem('created_at'));
        let expiresIn = parseInt(localStorage.getItem('expires_in'));
        let now = Math.floor(Date.now() / 1000);

        if (typeof createdAt !== 'number' || (createdAt + expiresIn - 60) < now) {
            return new Promise.resolve(() => {
                let formData = new FormData();
                formData.append('grant_type', 'refresh_token');
                formData.append('client_id', config.auth.client_id);
                formData.append('client_secret', config.auth.client_secret);
                formData.append('refresh_token', localStorage.getItem('refresh_token'));

                let headers = new Headers();
                headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));

                return fetch('/oauth/v2/token', {
                    method: 'POST',
                    body: formData,
                    headers: headers
                })
            })
                .then(response => this.handleFetchResponse(response))
                .then(response => response.json())
                .then(response => {
                    this.storeTokenData(response.access_token, response.refresh_token, response.expires_in);
                    return Promise.resolve();
                });
        } else {
            return Promise.resolve();
        }
    },

    fetch(url, params) {
        if (typeof params.headers == 'undefined') params.headers = new Headers();
        params.headers.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));

        return this.verifyToken()
            .then(() => {
                return fetch(url, params);
            })
            .then(response => {
                return this.handleFetchResponse(response);
            })
            .then(response => {
                let jsonMimeType = ['application/json', 'application/ld+json'],
                    contentType = response.headers.get('Content-Type'),
                    jsonLike = false;

                for (let mimeIterator = 0; mimeIterator < jsonMimeType.length; mimeIterator++) {
                    if (contentType.indexOf(jsonMimeType[mimeIterator]) !== -1) {
                        jsonLike = true;
                        break;
                    }
                }

                if (jsonLike) {
                    return response.json();
                } else {
                    return Promise.resolve(response);
                }
            });
    },

    login(username, password) {
        let formData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('client_id', config.auth.client_id);
        formData.append('client_secret', config.auth.client_secret);
        formData.append('username', username);
        formData.append('password', password);

        this.buildGetUrl('/oauth/v2/token')
            .then(url => {
                return fetch(url, {
                    method: 'POST',
                    body: formData
                });
            })
            .then(response => this.handleFetchResponse(response))
            .then(response => response.json())
            .then(response => {
                this.storeTokenData(response.access_token, response.refresh_token, response.expires_in);
                window.location = config.default.page;
            })
            .catch(error => {
                console.error(error);
                alert('Une erreur est survenue');
            });
    },

    handleFetchResponse(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    },

    storeTokenData(accesToken, refreshToken, expiresIn) {
        localStorage.setItem('access_token', accesToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('expires_in', expiresIn);
        localStorage.setItem('created_at', Math.floor(Date.now() / 1000));
    },

    buildGetUrl(url, params) {
        return new Promise((resolve) => {
            let oUrl = new URL(url, 'http://' + config.api.endpoint + '/');

            if (params) {
                Object.keys(params).forEach((paramName) => {
                    let value = params[paramName];

                    if (typeof value === 'object') {
                        Object.keys(value).forEach(propertyName => {
                            oUrl.searchParams.append(paramName + '[' + propertyName + ']', value[propertyName]);
                        });
                    } else {
                        oUrl.searchParams.append(paramName, value);
                    }
                });
            }


            resolve(oUrl.toString());
        });
    },

    sendFile(file, endpoint){
        let formData = new FormData();
        formData.append('file', file);
        return this.fetch(endpoint, {
            method: 'POST',
            body: formData
        });
    }
};

export default Xhr;