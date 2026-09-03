export const AuthPayloads = {
  validCitizen: {
    name: 'Enterprise Citizen',
    email: `auto.citizen.${Date.now()}@citizencare.gov`,
    password: 'Password@123',
    phone: '+1 555-0911',
    role: 'CITIZEN',
  },
  invalidEmail: {
    name: 'Bad Email User',
    email: 'not-an-email',
    password: 'Password@123',
  },
  shortPassword: {
    name: 'Short Pass User',
    email: 'shortpass@citizencare.gov',
    password: '123',
  },
  loginCitizen: {
    email: 'citizen@citizencare.gov',
    password: 'Citizen@123',
  },
  loginStaffRoads: {
    email: 'staff.roads@citizencare.gov',
    password: 'Staff@123',
  },
  loginAdmin: {
    email: 'admin@citizencare.gov',
    password: 'Admin@123',
  },
};
