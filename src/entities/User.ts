export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly role: 'student' | 'teacher' | 'coordinator' | 'admin';
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.name = dbData.name;
    this.email = dbData.email;
    this.role = dbData.role;
    this.created_at = dbData.created_at;
    this.updated_at = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): User[] {
    return dbArray.map(dbData => new User(dbData));
  }
}
