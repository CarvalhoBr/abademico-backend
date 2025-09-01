export class Enrollment {
  public readonly id: string;
  public readonly studentId: string;
  public readonly subjectId: string;
  public readonly enrollmentDate: Date;
  public readonly status: 'active' | 'completed' | 'dropped';
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.studentId = dbData.student_id;
    this.subjectId = dbData.subject_id;
    this.enrollmentDate = dbData.enrollment_date;
    this.status = dbData.status;
    this.createdAt = dbData.created_at;
    this.updatedAt = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Enrollment[] {
    return dbArray.map(dbData => new Enrollment(dbData));
  }
}
