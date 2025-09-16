const { Kubik } = require('rubik-main');
const querystring = require('querystring');
const FormData = require('form-data');
const fetch = require('node-fetch');
const isObject = require('lodash/isObject');
const set = require('lodash/set');

const methods = require('./Usedesk/methods');

const UsedeskError = require('../errors/Usedesk');

const DEFAULT_HOST = 'https://api.usedesk.ru/';

/**
 * Кубик для запросов к API ботов Usedesk
 * @class
 * @prop {String} [token] токен для доступа к API
 * @prop {String} [host=DEFAULT_HOST] адрес API Usedesk
 */
class Usedesk extends Kubik {
  constructor(token, host) {
    super(...arguments);
    this.token = token || null;
    this.host = host || null;

    this.generateMethods();
  }

  /**
   * Поднять кубик
   * @param  {Object} dependencies зависимости
   */
  up({ config }) {
    this.config = config;

    const options = this.config.get(this.name);

    this.token = this.token || options.token || null;
    this.host = this.host || options.host || DEFAULT_HOST;
    this.logSendAttachments = options.logSendAttachments;
  }

  normalizeHost(host) {
    return host.endsWith('/') ? host : host + '/';
  }

  getUrl(urlPath, queryParams, token, host) {
    if (!token) token = this.token;
    if (!host) host = this.host;

    if (!token) throw new TypeError('token is not defined');
    if (!host) throw new TypeError('host is not defined');

    if (!queryParams) queryParams = {};
    queryParams.api_token = token;

    host = this.normalizeHost(host);

    return `${host}${urlPath}?${querystring.stringify(queryParams)}`;
  }

  /**
   * Сделать запрос к API Ботов Usedesk
   * @param  {String} name  имя метода
   * @param  {Object|String} body тело запроса
   * @param  {String} [token=this.token] токен для запроса
   * @param  {String} [host=this.host] хост API Usedesk
   * @return {Promise<Object>} ответ от Usedesk
   */
  async request({ path, body, method, token, host, queryParams }) {
    const headers = {};

    if (body) {
      if (body instanceof FormData) {
        Object.assign(headers, body.getHeaders());
      } else if (isObject(body)) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }
      if (!method) method = 'POST';
    } else {
      if (!method) method = 'GET';
    }

    const url = this.getUrl(path, queryParams, token, host);
    const response = await fetch(url, { method, body, headers });

    let result = await response.text();

    try {
      result = JSON.parse(result);
    } catch (err) {
      throw new UsedeskError(`invalid response body: ${result}`);
    }

    if (response.status !== 200) {
      throw new UsedeskError(`status is not 200. ${result.message}`);
    }

    if (result.error) {
      throw new UsedeskError(`invalid result in body: ${result.error}`);
    }

    return result;
  }

  generateMethods() {
    methods.forEach(({ method, path }) => {
      const methodFunction = (options) => {
        if (!options) options = {};
        const { body, pathParams, token, host, method, queryParams } = options;
        let urlPath = path;
        if (path instanceof Function) {
          urlPath = path(pathParams);
        }

        return this.request({ path: urlPath, body, method, token, host, queryParams });
      };

      set(this, method, methodFunction);
    });
  }
}

Usedesk.prototype.dependencies = Object.freeze(['config']);
Usedesk.prototype.name = 'usedesk';

module.exports = Usedesk;
