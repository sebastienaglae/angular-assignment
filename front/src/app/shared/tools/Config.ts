import * as config from '../../../../config.json';
export class Config {
  static data = config;

  static getServerUrl() {
    return `http://${Config.data.server.host}:${Config.data.server.port}`;
  }
}
