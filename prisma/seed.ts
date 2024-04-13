/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '@prisma/client';
import facilities from './fixtures/facilities.json';
import services from './fixtures/services.json';
import treatments from './fixtures/treatments.json';
import roles from './fixtures/roles.json';
import cities from './fixtures/city.json';

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
  const defaultRolesPromise = roles.map((role) =>
    prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    }),
  );
  const citiesPromise = cities.map((city) =>
    prisma.city.upsert({
      where: { id: city.id },
      update: {},
      create: city,
    }),
  );
  await prisma.$transaction([
    ...facilitiesPromise,
    ...servicesPromise,
    ...treatmentsPromise,
    ...defaultRolesPromise,
    ...citiesPromise,
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
