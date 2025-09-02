export class Semester {
  public readonly id: string;
  public readonly code: string;
  public readonly start_date: Date;
  public readonly end_date: Date;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.code = dbData.code;
    this.start_date = dbData.start_date;
    this.end_date = dbData.end_date;
    this.created_at = dbData.created_at;
    this.updated_at = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Semester[] {
    return dbArray.map(dbData => new Semester(dbData));
  }
}
