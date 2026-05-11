/**
 * Idempotent backfill: for every Application that has zero Interview rows,
 * insert one Interview per prior-or-current interview step with a realistic
 * score so the kanban averageScore is non-zero.
 *
 * Run with: npx ts-node scripts/add-interviews.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Deterministic score per (applicationId mod N) so re-runs are stable.
const scorePool = [3, 4, 5, 2, 4, 5, 3, 4];

async function main() {
  const apps = await prisma.application.findMany({
    include: {
      interviews: true,
      position: { include: { interviewFlow: { include: { interviewSteps: true } } } },
    },
  });

  // Ensure a recruiter Employee exists to satisfy Interview.employeeId.
  const anyCompany = await prisma.company.findFirst();
  if (!anyCompany) {
    console.error('No Company found — cannot create recruiter Employee.');
    process.exit(1);
  }

  let recruiter = await prisma.employee.findFirst({ where: { role: 'Recruiter' } });
  if (!recruiter) {
    recruiter = await prisma.employee.create({
      data: {
        companyId: anyCompany.id,
        name: 'Sam Recruiter',
        email: `sam.recruiter+${Date.now()}@techcorp.example`,
        role: 'Recruiter',
      },
    });
    console.log(`Created recruiter Employee id=${recruiter.id}`);
  }

  let inserted = 0;
  let skipped = 0;

  for (const app of apps) {
    if (app.interviews.length > 0) {
      skipped++;
      continue;
    }
    const steps = (app.position?.interviewFlow?.interviewSteps ?? [])
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex);
    if (steps.length === 0) continue;

    const currentIdx = steps.findIndex((s) => s.id === app.currentInterviewStep);
    const upTo = currentIdx >= 0 ? currentIdx + 1 : 1;

    for (let i = 0; i < upTo; i++) {
      const score = scorePool[(app.id + i) % scorePool.length];
      await prisma.interview.create({
        data: {
          applicationId: app.id,
          interviewStepId: steps[i].id,
          employeeId: recruiter.id,
          interviewDate: app.applicationDate ?? new Date(),
          score,
          result: score >= 3 ? 'pass' : 'fail',
        },
      });
      inserted++;
    }
  }

  console.log(`Inserted ${inserted} Interview rows; skipped ${skipped} applications that already had interviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
