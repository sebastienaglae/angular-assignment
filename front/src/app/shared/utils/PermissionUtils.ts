export abstract class PermissionUtils {
  static getPerms(
    path: string | undefined,
    isAdmin: boolean,
    isLogged: boolean,
    permsPath: any
  ): PermissionState {
    if (!path) {
      throw new Error('DENIED NO PATH PROVIDED');
    }
    let perm = undefined;
    let keys = Object.keys(permsPath);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = permsPath[key];
      if (path === value.path) {
        perm = value;
        break;
      }
      if (path.startsWith('/') && path.substring(1) === value.path) {
        perm = value;
        break;
      }
    }

    if (!perm) {
      throw new Error(`DENIED NO PERMS FOUND FOR THIS PATH: ${path}`);
    }

    if (perm.needAdmin && !isAdmin) {
      return PermissionState.DENIED_NOT_ADMIN;
    }

    if (perm.needLogged && !isLogged) {
      return PermissionState.DENIED_NOT_LOGGED;
    }

    return PermissionState.ALLOWED;
  }
}

export enum PermissionState {
  ALLOWED,
  DENIED_NOT_LOGGED,
  DENIED_NOT_ADMIN,
}
