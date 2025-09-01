export class UserCourse {
  public readonly id: string;
  public readonly userId: string;
  public readonly courseId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.userId = dbData.user_id;
    this.courseId = dbData.course_id;
    this.createdAt = dbData.created_at;
    this.updatedAt = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): UserCourse[] {
    return dbArray.map(dbData => new UserCourse(dbData));
  }
}
