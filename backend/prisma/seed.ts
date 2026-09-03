import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CitizenCare Database with Enterprise Civic Data...');

  // Clean existing data in reverse dependency order
  await prisma.feedback.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.staffAssignment.deleteMany({});
  await prisma.complaintStatusHistory.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.testData.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.complaintCategory.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});

  const hashedCitizenPassword = await bcrypt.hash('Citizen@123', 10);
  const hashedStaffPassword = await bcrypt.hash('Staff@123', 10);
  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);

  // 1. Departments
  const deptRoads = await prisma.department.create({
    data: {
      name: 'Roads & Infrastructure Department',
      code: 'ROADS',
      description: 'Responsible for public roadway maintenance, asphalt resurfacing, and pedestrian bridges.',
      email: 'roads@citizencare.gov',
      headName: 'Director Robert Vance',
    },
  });

  const deptSanitation = await prisma.department.create({
    data: {
      name: 'Sanitation & Solid Waste Management',
      code: 'SANITATION',
      description: 'Oversees municipal waste collection, recycling, and street cleanliness.',
      email: 'sanitation@citizencare.gov',
      headName: 'Chief Officer Angela Martin',
    },
  });

  const deptWater = await prisma.department.create({
    data: {
      name: 'Water Supply & Drainage Authority',
      code: 'WATER',
      description: 'Manages municipal drinking water distribution, sewer lines, and storm drainage.',
      email: 'water@citizencare.gov',
      headName: 'Commissioner David Wallace',
    },
  });

  const deptElectricity = await prisma.department.create({
    data: {
      name: 'Municipal Power & Street Lighting',
      code: 'ELECTRICITY',
      description: 'Maintains streetlights, public electrical grids, and traffic light signals.',
      email: 'power@citizencare.gov',
      headName: 'Lead Engineer Jim Halpert',
    },
  });

  const deptParks = await prisma.department.create({
    data: {
      name: 'Parks & Public Spaces Directorate',
      code: 'PARKS',
      description: 'Preserves public gardens, recreational spaces, urban trees, and play areas.',
      email: 'parks@citizencare.gov',
      headName: 'Director Leslie Knope',
    },
  });

  // 2. Complaint Categories with SLAs
  const catRoads = await prisma.complaintCategory.create({
    data: {
      name: 'Pothole & Asphalt Road Damage',
      code: 'ROAD_DAMAGE',
      description: 'Deep road potholes, broken asphalt, or hazardous crater on traffic roads.',
      departmentId: deptRoads.id,
      defaultPriority: 'HIGH',
      slaHours: 48,
      icon: 'Road',
    },
  });

  const catStreetlight = await prisma.complaintCategory.create({
    data: {
      name: 'Streetlight & Illumination Failure',
      code: 'STREETLIGHT_FAIL',
      description: 'Malfunctioning or dark streetlights causing public safety hazards at night.',
      departmentId: deptElectricity.id,
      defaultPriority: 'MEDIUM',
      slaHours: 72,
      icon: 'Lightbulb',
    },
  });

  const catGarbage = await prisma.complaintCategory.create({
    data: {
      name: 'Garbage Accumulation & Illegal Dumping',
      code: 'GARBAGE_DUMP',
      description: 'Overflowing public bins, unattended waste piles, or uncollected community garbage.',
      departmentId: deptSanitation.id,
      defaultPriority: 'HIGH',
      slaHours: 48,
      icon: 'Trash2',
    },
  });

  const catWater = await prisma.complaintCategory.create({
    data: {
      name: 'Water Contamination / Supply Outage',
      code: 'WATER_CONTAM',
      description: 'Severe municipal water pipe bursts, dirty tap water, or total supply outage.',
      departmentId: deptWater.id,
      defaultPriority: 'CRITICAL',
      slaHours: 24,
      icon: 'Droplets',
    },
  });

  const catDrainage = await prisma.complaintCategory.create({
    data: {
      name: 'Drainage Blockage & Waterlogging',
      code: 'DRAIN_OVERFLOW',
      description: 'Blocked sewage grates leading to stagnant road water or flooding.',
      departmentId: deptWater.id,
      defaultPriority: 'HIGH',
      slaHours: 48,
      icon: 'Waves',
    },
  });

  const catParks = await prisma.complaintCategory.create({
    data: {
      name: 'Public Park / Playground Damage',
      code: 'PARK_MAINT',
      description: 'Broken playground equipment, fallen branches, or damaged park benches.',
      departmentId: deptParks.id,
      defaultPriority: 'LOW',
      slaHours: 168,
      icon: 'Trees',
    },
  });

  // 3. Users: Admin, Staff, Citizens
  const adminUser = await prisma.user.create({
    data: {
      name: 'Chief Administrator Sarah Jenkins',
      email: 'admin@citizencare.gov',
      phone: '+1 555-0100',
      passwordHash: hashedAdminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const staffRoads = await prisma.user.create({
    data: {
      name: 'Inspector Marcus Chen (Roads)',
      email: 'staff.roads@citizencare.gov',
      phone: '+1 555-0101',
      passwordHash: hashedStaffPassword,
      role: 'STAFF',
      status: 'ACTIVE',
      departmentId: deptRoads.id,
    },
  });

  const staffSanitation = await prisma.user.create({
    data: {
      name: 'Supervisor Elena Rodriguez (Sanitation)',
      email: 'staff.sanitation@citizencare.gov',
      phone: '+1 555-0102',
      passwordHash: hashedStaffPassword,
      role: 'STAFF',
      status: 'ACTIVE',
      departmentId: deptSanitation.id,
    },
  });

  const staffPower = await prisma.user.create({
    data: {
      name: 'Field Engineer Alex Patel (Power)',
      email: 'staff.power@citizencare.gov',
      phone: '+1 555-0103',
      passwordHash: hashedStaffPassword,
      role: 'STAFF',
      status: 'ACTIVE',
      departmentId: deptElectricity.id,
    },
  });

  const staffWater = await prisma.user.create({
    data: {
      name: 'Field Technician Liam O’Connor (Water)',
      email: 'staff.water@citizencare.gov',
      phone: '+1 555-0104',
      passwordHash: hashedStaffPassword,
      role: 'STAFF',
      status: 'ACTIVE',
      departmentId: deptWater.id,
    },
  });

  const citizenUser = await prisma.user.create({
    data: {
      name: 'Johnathan Doe (Citizen)',
      email: 'citizen@citizencare.gov',
      phone: '+1 555-0199',
      passwordHash: hashedCitizenPassword,
      role: 'CITIZEN',
      status: 'ACTIVE',
    },
  });

  const citizenUser2 = await prisma.user.create({
    data: {
      name: 'Jane Smith (Citizen)',
      email: 'jane.smith@gmail.com',
      phone: '+1 555-0198',
      passwordHash: hashedCitizenPassword,
      role: 'CITIZEN',
      status: 'ACTIVE',
    },
  });

  // 4. Realistic Complaints with Complete Lifecycles
  const now = new Date();

  // Complaint 1: Resolved with 5-Star Feedback
  const comp1CreatedAt = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
  const comp1Expected = new Date(comp1CreatedAt.getTime() + 48 * 60 * 60 * 1000);
  const comp1Resolved = new Date(comp1CreatedAt.getTime() + 32 * 60 * 60 * 1000);

  const comp1 = await prisma.complaint.create({
    data: {
      complaintNumber: 'C-1001',
      citizenId: citizenUser.id,
      categoryId: catRoads.id,
      departmentId: deptRoads.id,
      title: 'Hazardous deep pothole near Metro Station Exit 4',
      description: 'A 2-foot wide pothole has formed in the right lane of Main Avenue right before the bus station, causing heavy vehicle tire damage and severe lane weaving.',
      location: 'Main Avenue & 5th St Crossing, North Ward',
      latitude: 40.7128,
      longitude: -74.006,
      priority: 'HIGH',
      status: 'CLOSED',
      assignedStaffId: staffRoads.id,
      expectedResolutionDate: comp1Expected,
      resolvedDate: comp1Resolved,
      createdAt: comp1CreatedAt,
      updatedAt: comp1Resolved,
    },
  });

  await prisma.complaintStatusHistory.createMany({
    data: [
      {
        complaintId: comp1.id,
        oldStatus: null,
        newStatus: 'SUBMITTED',
        changedById: citizenUser.id,
        remarks: 'Complaint registered by citizen with road picture.',
        createdAt: comp1CreatedAt,
      },
      {
        complaintId: comp1.id,
        oldStatus: 'SUBMITTED',
        newStatus: 'ASSIGNED',
        changedById: adminUser.id,
        remarks: 'Assigned to North Ward rapid response asphalt crew.',
        createdAt: new Date(comp1CreatedAt.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        complaintId: comp1.id,
        oldStatus: 'ASSIGNED',
        newStatus: 'IN_PROGRESS',
        changedById: staffRoads.id,
        remarks: 'Road crew arrived on site. Milling and asphalt hot-mix patch initiated.',
        createdAt: new Date(comp1CreatedAt.getTime() + 18 * 60 * 60 * 1000),
      },
      {
        complaintId: comp1.id,
        oldStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        changedById: staffRoads.id,
        remarks: 'Pothole filled with Grade A mastic asphalt and roller compacted. Road reopened.',
        createdAt: comp1Resolved,
      },
      {
        complaintId: comp1.id,
        oldStatus: 'RESOLVED',
        newStatus: 'CLOSED',
        changedById: citizenUser.id,
        remarks: 'Citizen confirmed quality resolution and provided 5-star rating.',
        createdAt: new Date(comp1Resolved.getTime() + 4 * 60 * 60 * 1000),
      },
    ],
  });

  await prisma.staffAssignment.create({
    data: {
      complaintId: comp1.id,
      staffId: staffRoads.id,
      assignedById: adminUser.id,
      assignedAt: new Date(comp1CreatedAt.getTime() + 2 * 60 * 60 * 1000),
      notes: 'Priority asphalt patch needed before morning commute.',
      isActive: true,
    },
  });

  await prisma.feedback.create({
    data: {
      complaintId: comp1.id,
      citizenId: citizenUser.id,
      rating: 5,
      comment: 'Excellent and swift response! The asphalt repair was completed before morning rush hour. Very impressed by the municipal team.',
      resolutionConfirmed: true,
      createdAt: new Date(comp1Resolved.getTime() + 4 * 60 * 60 * 1000),
    },
  });

  // Complaint 2: In Progress (Electricity / Streetlight)
  const comp2CreatedAt = new Date(now.getTime() - 20 * 60 * 60 * 1000);
  const comp2Expected = new Date(comp2CreatedAt.getTime() + 72 * 60 * 60 * 1000);

  const comp2 = await prisma.complaint.create({
    data: {
      complaintNumber: 'C-1002',
      citizenId: citizenUser.id,
      categoryId: catStreetlight.id,
      departmentId: deptElectricity.id,
      title: 'Dark zone: 4 consecutive streetlight poles broken on Oak Boulevard',
      description: 'Between 12th and 15th Ave, all streetlights have been completely dark for 3 nights, leading to safety and pedestrian visibility concerns.',
      location: 'Oak Boulevard, Blocks 1200-1500, West District',
      latitude: 40.7282,
      longitude: -73.9942,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedStaffId: staffPower.id,
      expectedResolutionDate: comp2Expected,
      createdAt: comp2CreatedAt,
      updatedAt: now,
    },
  });

  await prisma.complaintStatusHistory.createMany({
    data: [
      {
        complaintId: comp2.id,
        oldStatus: null,
        newStatus: 'SUBMITTED',
        changedById: citizenUser.id,
        remarks: 'Reported by citizen.',
        createdAt: comp2CreatedAt,
      },
      {
        complaintId: comp2.id,
        oldStatus: 'SUBMITTED',
        newStatus: 'ASSIGNED',
        changedById: staffPower.id,
        remarks: 'Staff self-claimed from power department queue.',
        createdAt: new Date(comp2CreatedAt.getTime() + 4 * 60 * 60 * 1000),
      },
      {
        complaintId: comp2.id,
        oldStatus: 'ASSIGNED',
        newStatus: 'IN_PROGRESS',
        changedById: staffPower.id,
        remarks: 'Feeder pillar fuse inspection in progress; replacement LED luminaires en route.',
        createdAt: new Date(comp2CreatedAt.getTime() + 10 * 60 * 60 * 1000),
      },
    ],
  });

  await prisma.staffAssignment.create({
    data: {
      complaintId: comp2.id,
      staffId: staffPower.id,
      assignedById: staffPower.id,
      assignedAt: new Date(comp2CreatedAt.getTime() + 4 * 60 * 60 * 1000),
      notes: 'Luminaires and underground wiring check scheduled.',
      isActive: true,
    },
  });

  // Complaint 3: Critical Water Outage - Newly Submitted
  const comp3CreatedAt = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const comp3Expected = new Date(comp3CreatedAt.getTime() + 24 * 60 * 60 * 1000);

  const comp3 = await prisma.complaint.create({
    data: {
      complaintNumber: 'C-1003',
      citizenId: citizenUser2.id,
      categoryId: catWater.id,
      departmentId: deptWater.id,
      title: 'High-pressure water main pipeline burst flooding sidewalk',
      description: 'Major underground pipeline fracture spewing clean water across the sidewalk and entering residential basements.',
      location: '88 River Street, Downtown Zone',
      latitude: 40.7589,
      longitude: -73.9851,
      priority: 'CRITICAL',
      status: 'SUBMITTED',
      expectedResolutionDate: comp3Expected,
      createdAt: comp3CreatedAt,
      updatedAt: comp3CreatedAt,
    },
  });

  await prisma.complaintStatusHistory.create({
    data: {
      complaintId: comp3.id,
      oldStatus: null,
      newStatus: 'SUBMITTED',
      changedById: citizenUser2.id,
      remarks: 'Emergency water complaint filed by resident.',
      createdAt: comp3CreatedAt,
    },
  });

  // Complaint 4: Overdue Garbage Complaint (for demonstrating SLA breach highlight)
  const comp4CreatedAt = new Date(now.getTime() - 60 * 60 * 60 * 1000);
  const comp4Expected = new Date(comp4CreatedAt.getTime() + 48 * 60 * 60 * 1000); // Expired 12 hours ago!

  const comp4 = await prisma.complaint.create({
    data: {
      complaintNumber: 'C-1004',
      citizenId: citizenUser.id,
      categoryId: catGarbage.id,
      departmentId: deptSanitation.id,
      title: 'Commercial waste bin overflow in Market Square alley',
      description: 'Excessive organic waste piling outside containers for 4 days creating foul odor and pest attraction.',
      location: 'Central Market Alleyway #3, Commercial Sector',
      latitude: 40.7306,
      longitude: -73.9352,
      priority: 'HIGH',
      status: 'ASSIGNED',
      assignedStaffId: staffSanitation.id,
      expectedResolutionDate: comp4Expected,
      createdAt: comp4CreatedAt,
      updatedAt: now,
    },
  });

  await prisma.complaintStatusHistory.createMany({
    data: [
      {
        complaintId: comp4.id,
        oldStatus: null,
        newStatus: 'SUBMITTED',
        changedById: citizenUser.id,
        remarks: 'Reported by citizen.',
        createdAt: comp4CreatedAt,
      },
      {
        complaintId: comp4.id,
        oldStatus: 'SUBMITTED',
        newStatus: 'ASSIGNED',
        changedById: adminUser.id,
        remarks: 'Assigned to sanitation route #7.',
        createdAt: new Date(comp4CreatedAt.getTime() + 6 * 60 * 60 * 1000),
      },
    ],
  });

  // Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: citizenUser.id,
        complaintId: comp1.id,
        title: 'Complaint C-1001 Resolved',
        message: 'Your pothole report has been repaired and verified. Please rate your resolution experience.',
        isRead: false,
        createdAt: comp1Resolved,
      },
      {
        userId: citizenUser.id,
        complaintId: comp2.id,
        title: 'Status Updated on C-1002',
        message: 'Staff Engineer Alex Patel has begun on-site inspection for the broken streetlights.',
        isRead: false,
        createdAt: new Date(comp2CreatedAt.getTime() + 10 * 60 * 60 * 1000),
      },
      {
        userId: staffRoads.id,
        complaintId: comp1.id,
        title: 'New Assignment C-1001',
        message: 'You have been assigned high priority complaint C-1001: Pothole near Metro Station.',
        isRead: true,
        createdAt: new Date(comp1CreatedAt.getTime() + 2 * 60 * 60 * 1000),
      },
    ],
  });

  // Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: citizenUser.id,
        action: 'USER_LOGIN',
        entity: 'USER',
        entityId: citizenUser.id,
        details: JSON.stringify({ email: citizenUser.email, role: 'CITIZEN' }),
        ipAddress: '127.0.0.1',
      },
      {
        userId: citizenUser.id,
        action: 'CREATE_COMPLAINT',
        entity: 'COMPLAINT',
        entityId: comp1.id,
        details: JSON.stringify({ complaintNumber: 'C-1001', priority: 'HIGH' }),
        ipAddress: '127.0.0.1',
      },
      {
        userId: adminUser.id,
        action: 'ASSIGN_STAFF',
        entity: 'COMPLAINT',
        entityId: comp1.id,
        details: JSON.stringify({ assignedStaff: 'Marcus Chen', role: 'STAFF' }),
        ipAddress: '127.0.0.1',
      },
      {
        userId: staffRoads.id,
        action: 'UPDATE_STATUS',
        entity: 'COMPLAINT',
        entityId: comp1.id,
        details: JSON.stringify({ from: 'IN_PROGRESS', to: 'RESOLVED' }),
        ipAddress: '127.0.0.1',
      },
    ],
  });

  console.log('✅ CitizenCare Database Successfully Seeded!');
  console.log('--------------------------------------------------');
  console.log('Sample Credentials:');
  console.log('👤 Citizen: citizen@citizencare.gov / Citizen@123');
  console.log('👷 Staff:   staff.roads@citizencare.gov / Staff@123');
  console.log('⚡ Staff:   staff.power@citizencare.gov / Staff@123');
  console.log('👑 Admin:   admin@citizencare.gov / Admin@123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
