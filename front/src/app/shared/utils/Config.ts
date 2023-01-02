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

  static teacher = {
    route: 'teachers',
  };

  static assignment = {
    route: 'assignments',
  };

  static permsPath = {
    home: { path: '', needAdmin: false, needLogged: false },
    addAss: { path: 'assignment/add', needAdmin: true, needLogged: true },
    getAss: { path: 'assignment/:id', needAdmin: false, needLogged: false },
    gen: { path: 'gen', needAdmin: true, needLogged: true },
    editAss: { path: 'assignment/:id/edit', needAdmin: true, needLogged: true },
    submitAss: {
      path: 'assignment/:id/submit',
      needAdmin: false,
      needLogged: true,
    },
    rateAss: { path: 'assignment/:id/rate', needAdmin: true, needLogged: true },
    login: { path: 'connection', needAdmin: false, needLogged: false },
    register: { path: 'register', needAdmin: false, needLogged: false },
    getTeacher: { path: 'teacher/:id', needAdmin: false, needLogged: false },
    deleteAss: {
      path: '$deleteAssignment$',
      needAdmin: true,
      needLogged: true,
    },
  };

  // Retoune l'url du serveur
  static getServerUrl(): string {
    Config.server;
    return `http://${Config.server.host}:${Config.server.port}`;
  }
}
