export class Enrollment {
  public readonly id: string;
  public readonly student_id: string;
  public readonly subject_id: string;
  public readonly enrollment_date: Date;
  public readonly status: 'active' | 'completed' | 'dropped';
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.student_id = dbData.student_id;
    this.subject_id = dbData.subject_id;
    this.enrollment_date = dbData.enrollment_date;
    this.status = dbData.status;
    this.created_at = dbData.created_at;
    this.updated_at = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Enrollment[] {
    return dbArray.map(dbData => new Enrollment(dbData));
  }
}
