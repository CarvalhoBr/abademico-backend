export class UserCourse {
  public readonly id: string;
  public readonly user_id: string;
  public readonly course_id: string;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.user_id = dbData.user_id;
    this.course_id = dbData.course_id;
    this.created_at = dbData.created_at;
    this.updated_at = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): UserCourse[] {
    return dbArray.map(dbData => new UserCourse(dbData));
  }
}
