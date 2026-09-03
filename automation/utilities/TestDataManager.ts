import fs from 'fs';
import path from 'path';

export class TestDataManager {
  private static loadJson(fileName: string): any {
    const filePath = path.resolve(__dirname, `../test-data/${fileName}`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  }

  static getUsers() {
    return this.loadJson('users.json');
  }

  static getInvalidData() {
    return this.loadJson('invalid-data.json');
  }

  static generateUniqueEmail(prefix: string = 'test.citizen'): string {
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}.${Date.now()}.${rand}@citizencare.gov`;
  }

  static generateRandomComplaintData(categoryId: string) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return {
      categoryId,
      title: `Automated Test Issue #${rand}: Severe Road Fracture`,
      description: `Detailed automated test description for civic issue #${rand}. Observed deep surface cracks requiring asphalt hot-mix patch.`,
      location: `${rand} Lexington Ave & 42nd St, Ward ${rand % 10}`,
      priority: 'HIGH',
      latitude: 40.75 + (Math.random() - 0.5) * 0.05,
      longitude: -73.98 + (Math.random() - 0.5) * 0.05,
    };
  }
}
