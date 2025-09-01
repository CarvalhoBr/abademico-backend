export class Course {
  public readonly id: string;
  public readonly name: string;
  public readonly code: string;
  public readonly description: string | null;
  public readonly coordinatorId: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(dbData: any) {
    this.id = dbData.id;
    this.name = dbData.name;
    this.code = dbData.code;
    this.description = dbData.description;
    this.coordinatorId = dbData.coordinator_id;
    this.createdAt = dbData.created_at;
    this.updatedAt = dbData.updated_at;
  }

  static fromArray(dbArray: any[]): Course[] {
    return dbArray.map(dbData => new Course(dbData));
  }
}
