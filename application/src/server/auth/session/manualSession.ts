export class ManualSession {
  static #instance: ManualSession;
  private _userId: string;
  constructor() {
    console.log("Using Manual Session Manager");
    this._userId = process.env.NEXT_PUBLIC_USER_ID ?? "";
  }

  public static get manager(): ManualSession {
    if (!ManualSession.#instance) {
      ManualSession.#instance = new ManualSession();
    }
    return ManualSession.#instance;
  }

  public static get userId(): string {
    return ManualSession.manager._userId;
  }

  public static set userId(value) {
    console.log(`Changing active user session to userId=${value}`);
    ManualSession.manager._userId = value;
  }
}
