export class Subject {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly credits: number;
  public readonly courseId: string;
  public readonly semesterId: string;
  public readonly teacherId: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.name = dbData.name;
    this.code = dbData.code;
    this.credits = dbData.credits;
    this.courseId = dbData.course_id;
    this.semesterId = dbData.semester_id;
    this.teacherId = dbData.teacher_id;
    this.createdAt = dbData.created_at;
    this.updatedAt = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Subject[] {
    return dbArray.map(dbData => new Subject(dbData));
  }
}
