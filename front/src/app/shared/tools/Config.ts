export class Config {
  static server = {
    port: 3000,
    host: 'localhost',
  };
  static auth = {
    route: 'auth',
    register: 'register',
    login: 'login',
    token: 'token',
  };

  static subject = {
    route: 'subjects',
  };

  static assignment = {
    route: 'assignments',
  };

  // Retoune l'url du serveur
  static getServerUrl(): string {
    Config.server;
    return `http://${Config.server.host}:${Config.server.port}`;
  }
}
