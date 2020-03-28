import UrlBuilder from "@/assets/ts/objects/UrlBuilder";

export default class Request {

    protected headers: Headers = new Headers({'Content-Type': 'application/json'});

    protected urlBuilder: UrlBuilder;

    protected method: string;

    protected body: any;

    protected skipUrlBuilding = false;

    constructor(url: string, method: string = 'GET') {
        this.urlBuilder = new UrlBuilder(url);
        this.method = method;
    }

    setBody(body: any) {
        if (typeof body !== "string" && !(body instanceof FormData)) body = JSON.stringify(body);
        this.body = body;
        return this;
    }

    setQueryParams(queryParams: UrlBuilderQueryParamInterface) {
        this.urlBuilder.setQueryParams(queryParams);
        return this;
    }

    addHeader(name: string, value: string, replaceIfExists: boolean = true) {
        if (this.headers.has(name) && replaceIfExists) {
            this.headers.set(name, value);
        } else {
            this.headers.append(name, value);
        }
        return this;
    }

    removeHeader(name: string) {
        this.headers.delete(name);
        return this;
    }

    setSkipUrlBuilding(skipUrlBuilding: boolean) {
        this.skipUrlBuilding = skipUrlBuilding;
        return this;
    }

    getUrlBuilder() {
        return this.urlBuilder;
    }

    trigger() {
        return fetch(this.skipUrlBuilding ? this.urlBuilder.getUrl() : this.urlBuilder.buildUrl(), {
            method: this.method,
            headers: this.headers,
            body: this.body
        });
    }
}
