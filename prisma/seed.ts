import { PrismaClient, InvoiceStatus } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando população do banco de dados...');

  const password = await bcrypt.hash('password', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@acme.com',
      password: password
    }
  });
  
  console.log(`Usuário criado: ${ user.email }`);

  const customers_data = [
    {
      name: 'Alex Bessa',
      email: 'alex@email.com',
      imageUrl: 'https://ui-avatars.com/api/?name=Alex+Bessa&background=random'
    }, {
      name: 'Valdiana Bessa',
      email: 'valdiana@email.com',
      imageUrl: 'https://ui-avatars.com/api/?name=Valdiana+Bessa&background=random'
    }, {
      name: 'Timóteo Bessa',
      email: 'timoteo@email.com',
      imageUrl: 'https://ui-avatars.com/api/?name=Timoteo+Bessa&background=random'
    }
  ];

  const customers = [];

  for (const data of customers_data) {
    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {},
      create: data
    });

    customers.push(customer);
    console.log(`Cliente criado: ${ customer.name }`);
  };

  const invoicesData = [
    { amount: 15795, status: InvoiceStatus.PEDENTE, date: '2026-10-05', customer: customers[0] },
    { amount: 20348, status: InvoiceStatus.PEDENTE, date: '2026-10-05', customer: customers[1] },
    { amount: 3040,  status: InvoiceStatus.PAGO,    date: '2026-07-05', customer: customers[0] },
    { amount: 44800, status: InvoiceStatus.PAGO,    date: '2026-08-05', customer: customers[0] },
    { amount: 34577, status: InvoiceStatus.PEDENTE, date: '2026-11-05', customer: customers[2] },
    { amount: 54246, status: InvoiceStatus.PEDENTE, date: '2026-11-05', customer: customers[1] },
    { amount: 667,   status: InvoiceStatus.PEDENTE, date: '2026-11-05', customer: customers[2] },
    { amount: 32545, status: InvoiceStatus.PAGO,    date: '2026-06-05', customer: customers[0] },
    { amount: 1250,  status: InvoiceStatus.PAGO,    date: '2026-05-05', customer: customers[1] },
    { amount: 8546,  status: InvoiceStatus.PAGO,    date: '06-05-2026', customer: customers[2] },
    { amount: 500,   status: InvoiceStatus.PAGO,    date: '03-05-2026', customer: customers[0] },
    { amount: 8945,  status: InvoiceStatus.PAGO,    date: '02-05-2026', customer: customers[1] }
  ];

  for (const invoice of invoicesData) {
    await prisma.invoice.create({
      data: {
        amount: invoice.amount,
        status: invoice.status,
        date: new Date(invoice.date),
        customerId: invoice.customer.id
      }
    });
  };

  console.log(`${invoicesData.length} faturas criadas.`);

  const revenueData = [
    { month: 'Jan', revenue: 2000 },
    { month: 'Fev', revenue: 1800 },
    { month: 'Mar', revenue: 2200 },
    { month: 'Abr', revenue: 2500 },
    { month: 'Mai', revenue: 2300 },
    { month: 'Jun', revenue: 3200 },
    { month: 'Jul', revenue: 3500 },
    { month: 'Ago', revenue: 3700 },
    { month: 'Set', revenue: 2500 },
    { month: 'Out', revenue: 2800 },
    { month: 'Nov', revenue: 3000 },
    { month: 'Dez', revenue: 4800 },
  ];

  for (const data of revenueData) {
    await prisma.revenue.upsert({
      where: { month: data.month },
      update: { revenue: data.revenue },
      create: data
    });
  };

  console.log('Dados de receita mensal criados.');

  console.log('População concluída com sucesso.');

};

main()
  .catch((error) => {
    console.log('Erro ao popular o banco:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  