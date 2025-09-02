export class Course {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly description: string | null;
  public readonly coordinator_id: string | null;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.name = dbData.name;
    this.code = dbData.code;
    this.description = dbData.description;
    this.coordinator_id = dbData.coordinator_id;
    this.created_at = dbData.created_at;
    this.updated_at = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Course[] {
    return dbArray.map(dbData => new Course(dbData));
  }
}
