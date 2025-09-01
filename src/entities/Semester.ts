export class Semester {
  public readonly id: string;
  public readonly code: string;
  public readonly startDate: Date;
  public readonly endDate: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.code = dbData.code;
    this.startDate = dbData.start_date;
    this.endDate = dbData.end_date;
    this.createdAt = dbData.created_at;
    this.updatedAt = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Semester[] {
    return dbArray.map(dbData => new Semester(dbData));
  }
}
