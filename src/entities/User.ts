export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly role: 'student' | 'teacher' | 'coordinator' | 'admin';
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.name = dbData.name;
    this.email = dbData.email;
    this.role = dbData.role;
    this.createdAt = dbData.created_at;
    this.updatedAt = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): User[] {
    return dbArray.map(dbData => new User(dbData));
  }
}
