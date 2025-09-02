export class Subject {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly credits: number;
  public readonly course_id: string;
  public readonly semester_id: string;
  public readonly teacher_id: string | null;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.name = dbData.name;
    this.code = dbData.code;
    this.credits = dbData.credits;
    this.course_id = dbData.course_id;
    this.semester_id = dbData.semester_id;
    this.teacher_id = dbData.teacher_id;
    this.created_at = dbData.created_at;
    this.updated_at = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Subject[] {
    return dbArray.map(dbData => new Subject(dbData));
  }
}
