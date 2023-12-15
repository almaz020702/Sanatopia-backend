/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '@prisma/client';
import facilities from './fixtures/facilities.json';
import services from './fixtures/services.json';
import treatments from './fixtures/treatments.json';

const prisma = new PrismaClient();

async function main() {
  const facilitiesPromise = facilities.map((facility) =>
    prisma.facility.upsert({
      where: { id: facility.id },
      update: {},
      create: facility,
    }),
  );
  const servicesPromise = services.map((service) =>
    prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    }),
  );

  const treatmentsPromise = treatments.map((treatment) =>
    prisma.treatment.upsert({
      where: { id: treatment.id },
      update: {},
      create: treatment,
    }),
  );
  await prisma.$transaction([
    ...facilitiesPromise,
    ...servicesPromise,
    ...treatmentsPromise,
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
