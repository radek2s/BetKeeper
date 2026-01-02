export class UserNotExistsError extends Error {
  constructor(userEmail: string) {
    super(`User with ${userEmail} does not exists in system.`);
    this.name = "UserNotExists";
  }
}
