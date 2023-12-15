/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '@prisma/client';

const facilities = require('./fixtures/facilities.json');
const services = require('./fixtures/services.json');
const treatments = require('./fixtures/treatments.json');
const roles = require('./fixtures/roles.json');

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

  const rolesPromise = roles.map((role) =>
    prisma.treatment.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    }),
  );

  await prisma.$transaction([
    ...facilitiesPromise,
    ...servicesPromise,
    ...treatmentsPromise,
    ...rolesPromise,
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
