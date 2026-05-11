import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test data for kanban board...');

  // Create interview types
  const screeningType = await prisma.interviewType.create({
    data: {
      name: 'Phone Screening',
      description: 'Initial phone screening',
    },
  });

  const technicalType = await prisma.interviewType.create({
    data: {
      name: 'Technical Interview',
      description: 'Technical skills assessment',
    },
  });

  const managerType = await prisma.interviewType.create({
    data: {
      name: 'Manager Interview',
      description: 'Manager round discussion',
    },
  });

  // Create interview flow with steps
  const interviewFlow = await prisma.interviewFlow.create({
    data: {
      description: 'Standard development interview process',
      interviewSteps: {
        create: [
          {
            interviewTypeId: screeningType.id,
            name: 'Initial Screening',
            orderIndex: 1,
          },
          {
            interviewTypeId: technicalType.id,
            name: 'Technical Interview',
            orderIndex: 2,
          },
          {
            interviewTypeId: managerType.id,
            name: 'Manager Interview',
            orderIndex: 3,
          },
        ],
      },
    },
  });

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Tech Corp',
    },
  });

  // Recruiter employee — required as Interview.employeeId
  const recruiter = await prisma.employee.create({
    data: {
      companyId: company.id,
      name: 'Sam Recruiter',
      email: 'sam.recruiter@techcorp.example',
      role: 'Recruiter',
    },
  });

  // Create position
  const position = await prisma.position.create({
    data: {
      title: 'Senior Backend Engineer',
      description: 'We are looking for a senior backend engineer with 5+ years of experience.',
      companyId: company.id,
      interviewFlowId: interviewFlow.id,
      status: 'Abierto',
      location: 'San Francisco, CA',
      jobDescription: 'We are looking for a senior backend engineer with 5+ years of experience in Node.js, TypeScript, and cloud infrastructure.',
    },
  });

  // Create candidates
  const candidates = [
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567890',
    },
    {
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos.garcia@example.com',
      phone: '+1234567891',
    },
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567892',
    },
    {
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'maria.rodriguez@example.com',
      phone: '+1234567893',
    },
    {
      firstName: 'Alex',
      lastName: 'Kim',
      email: 'alex.kim@example.com',
      phone: '+1234567894',
    },
  ];

  const createdCandidates = await Promise.all(
    candidates.map((candidate) =>
      prisma.candidate.create({
        data: candidate,
      })
    )
  );

  // Get interview steps for applications
  const steps = await prisma.interviewStep.findMany({
    where: { interviewFlowId: interviewFlow.id },
    orderBy: { orderIndex: 'asc' },
  });

  // Each tuple: candidate index, current step index, application date, notes, and
  // the interview scores already collected for that candidate (0..5). The
  // backend's averageScore is the mean of these per-interview scores.
  const applicationsSeed: Array<{
    candidateIdx: number;
    stepIdx: number;
    applicationDate: Date;
    notes: string;
    scores: number[];
  }> = [
    { candidateIdx: 0, stepIdx: 0, applicationDate: new Date(),                  notes: 'Strong background',         scores: [3] },
    { candidateIdx: 1, stepIdx: 1, applicationDate: new Date('2026-05-05'),      notes: 'Passed screening',          scores: [4, 5] },
    { candidateIdx: 2, stepIdx: 2, applicationDate: new Date('2026-05-03'),      notes: 'Technical interview passed', scores: [5, 4, 5] },
    { candidateIdx: 3, stepIdx: 0, applicationDate: new Date('2026-05-08'),      notes: 'New application',           scores: [2] },
    { candidateIdx: 4, stepIdx: 1, applicationDate: new Date('2026-05-06'),      notes: 'Scheduled tech interview',  scores: [4, 4] },
  ];

  for (const seed of applicationsSeed) {
    const application = await prisma.application.create({
      data: {
        positionId: position.id,
        candidateId: createdCandidates[seed.candidateIdx].id,
        currentInterviewStep: steps[seed.stepIdx].id,
        applicationDate: seed.applicationDate,
        notes: seed.notes,
      },
    });

    // Each prior step plus the current step has an Interview record so the
    // averageScore on the kanban card reflects the candidate's history.
    for (let i = 0; i < seed.scores.length; i++) {
      await prisma.interview.create({
        data: {
          applicationId: application.id,
          interviewStepId: steps[Math.min(i, steps.length - 1)].id,
          employeeId: recruiter.id,
          interviewDate: seed.applicationDate,
          score: seed.scores[i],
          result: seed.scores[i] >= 3 ? 'pass' : 'fail',
        },
      });
    }
  }

  console.log('✓ Test data seeded successfully!');
  console.log(`✓ Position ID: ${position.id}`);
  console.log(`✓ Created ${createdCandidates.length} candidates in kanban`);
  console.log(`✓ Navigate to http://localhost:3000/positions/${position.id} to view kanban`);
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
