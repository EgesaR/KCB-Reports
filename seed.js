// seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

// Data templates
const adminRoles = [
  { roleName: "Head Teacher" },
  { roleName: "Deputy Head Teacher" },
  { roleName: "Head of Department" },
  { roleName: "Class Teacher" },
  { roleName: "Bursar" },
  { roleName: "Games Master/Mistress" },
  { roleName: "Discipline Coordinator" },
  { roleName: "Counselor" },
  { roleName: "Patron/Matron" },
  { roleName: "Director of Studies (O'Level)" },
  { roleName: "Director of Studies (A'Level)" },
  { roleName: "Director of Studies (Upper Primary)" },
  { roleName: "Director of Studies (Lower Primary)" },
];

const subjects = [
  "English Language",
  "Mathematics",
  "History and Political Education",
  "Geography",
  "Biology",
  "Physics",
  "Chemistry",
  "Physical Education",
  "Religious Education (CRE or IRE)",
  "Entrepreneurship Education",
  "Information and Communication Technology (ICT)",
  "Art and Design",
  "Performing Arts",
  "Technology and Design",
  "Nutrition and Food Technology",
  "Agriculture",
  "Foreign Languages",
  "Kiswahili",
  "Literature in English",
  "Local Languages",
];

const classes = [
  "Senior 1 (S1)",
  "Senior 2 (S2)",
  "Senior 3 (S3)",
  "Senior 4 (S4)",
  "Senior 5 (S5)",
  "Senior 6 (S6)",
];

const schools = [
  { name: "Gayaza High School", badgeUrl: "https://placeholder.com/school1" },
  { name: "Namilyango College", badgeUrl: "https://placeholder.com/school2" },
  {
    name: "Kibuli Secondary School",
    badgeUrl: "https://placeholder.com/school3",
  },
  {
    name: "St. Mary's College Kisubi",
    badgeUrl: "https://placeholder.com/school4",
  },
  { name: "King's College Budo", badgeUrl: "https://placeholder.com/school5" },
  {
    name: "Makerere College School",
    badgeUrl: "https://placeholder.com/school6",
  },
  {
    name: "Mt. St. Mary's Namagunga",
    badgeUrl: "https://placeholder.com/school7",
  },
  { name: "Ntare School", badgeUrl: "https://placeholder.com/school8" },
  { name: "Jinja College", badgeUrl: "https://placeholder.com/school9" },
  {
    name: "Busoga College Mwiri",
    badgeUrl: "https://placeholder.com/school10",
  },
  {
    name: "St. Henry's College Kitovu",
    badgeUrl: "https://placeholder.com/school11",
  },
  {
    name: "Masaka Secondary School",
    badgeUrl: "https://placeholder.com/school12",
  },
  { name: "Mbarara High School", badgeUrl: "https://placeholder.com/school13" },
  { name: "Seeta High School", badgeUrl: "https://placeholder.com/school14" },
  {
    name: "Bishop Cipriano Kihangire",
    badgeUrl: "https://placeholder.com/school15",
  },
  {
    name: "Trinity College Nabbingo",
    badgeUrl: "https://placeholder.com/school16",
  },
  {
    name: "Kawempe Muslim Secondary School",
    badgeUrl: "https://placeholder.com/school17",
  },
  {
    name: "Lubiri Secondary School",
    badgeUrl: "https://placeholder.com/school18",
  },
  {
    name: "Namirembe Hillside High School",
    badgeUrl: "https://placeholder.com/school19",
  },
  { name: "Mengo Senior School", badgeUrl: "https://placeholder.com/school20" },
  {
    name: "St. Lawrence Schools and Colleges",
    badgeUrl: "https://placeholder.com/school21",
  },
  {
    name: "Iganga Secondary School",
    badgeUrl: "https://placeholder.com/school22",
  },
  { name: "Lubiri High School", badgeUrl: "https://placeholder.com/school23" },
  { name: "Tororo Girls School", badgeUrl: "https://placeholder.com/school24" },
  { name: "Kibuli High School", badgeUrl: "https://placeholder.com/school25" },
  {
    name: "St. Joseph's Nsambya",
    badgeUrl: "https://placeholder.com/school26",
  },
  {
    name: "Aga Khan High School",
    badgeUrl: "https://placeholder.com/school27",
  },
  {
    name: "Victoria High School",
    badgeUrl: "https://placeholder.com/school28",
  },
  {
    name: "Our Lady of Africa SS",
    badgeUrl: "https://placeholder.com/school29",
  },
  {
    name: "Ndejje Secondary School",
    badgeUrl: "https://placeholder.com/school30",
  },
  {
    name: "Katikamu SDA Secondary School",
    badgeUrl: "https://placeholder.com/school31",
  },
  {
    name: "Light Academy Secondary School",
    badgeUrl: "https://placeholder.com/school32",
  },
  {
    name: "Bweranyangi Girls' Secondary School",
    badgeUrl: "https://placeholder.com/school33",
  },
  { name: "Teso College Aloet", badgeUrl: "https://placeholder.com/school34" },
  {
    name: "Maryhill High School",
    badgeUrl: "https://placeholder.com/school35",
  },
  { name: "Kigezi High School", badgeUrl: "https://placeholder.com/school36" },
  {
    name: "St. Peter's SS Naalya",
    badgeUrl: "https://placeholder.com/school37",
  },
  {
    name: "Soroti Secondary School",
    badgeUrl: "https://placeholder.com/school38",
  },
  {
    name: "Kyambogo College School",
    badgeUrl: "https://placeholder.com/school39",
  },
  { name: "Lira Town College", badgeUrl: "https://placeholder.com/school40" },
  {
    name: "Kitende Secondary School",
    badgeUrl: "https://placeholder.com/school41",
  },
  {
    name: "Kassanda Secondary School",
    badgeUrl: "https://placeholder.com/school42",
  },
  {
    name: "Kololo Senior Secondary School",
    badgeUrl: "https://placeholder.com/school43",
  },
  {
    name: "Kiira College Butiki",
    badgeUrl: "https://placeholder.com/school60",
  },
  {
    name: "Caltec Academy Makerere",
    badgeUrl: "https://placeholder.com/school44",
  },
  {
    name: "St. Balikuddembe Mitala Maria",
    badgeUrl: "https://placeholder.com/school45",
  },
  {
    name: "Luwero Secondary School",
    badgeUrl: "https://placeholder.com/school46",
  },
  {
    name: "St. Julian High School Gayaza",
    badgeUrl: "https://placeholder.com/school47",
  },
  {
    name: "Gombe Secondary School",
    badgeUrl: "https://placeholder.com/school48",
  },
  {
    name: "St. Andrew Kaggwa Gombe High School",
    badgeUrl: "https://placeholder.com/school49",
  },
  {
    name: "Kitgum Comprehensive College",
    badgeUrl: "https://placeholder.com/school50",
  },
  {
    name: "Nabisunsa Girls School",
    badgeUrl: "https://placeholder.com/school51",
  },
  {
    name: "Kilembe Secondary School",
    badgeUrl: "https://placeholder.com/school52",
  },
  { name: "Iganga High School", badgeUrl: "https://placeholder.com/school53" },
  {
    name: "St. Charles Lwanga Kasasa",
    badgeUrl: "https://placeholder.com/school54",
  },
  {
    name: "Kabale Secondary School",
    badgeUrl: "https://placeholder.com/school55",
  },
  {
    name: "Busia Secondary School",
    badgeUrl: "https://placeholder.com/school56",
  },
  {
    name: "St. Kalemba Secondary School",
    badgeUrl: "https://placeholder.com/school57",
  },
  {
    name: "Tororo Progressive Academy",
    badgeUrl: "https://placeholder.com/school58",
  },
  {
    name: "Kamwokya Christian School",
    badgeUrl: "https://placeholder.com/school59",
  },
  {
    name: "Mvara Secondary School",
    badgeUrl: "https://placeholder.com/school60",
  },
];

// Interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function promptForAccount() {
  const createAccount = await prompt("Create admin account? (y/n): ");
  if (createAccount.toLowerCase() !== "y") return null;

  const name = await prompt("Admin name: ");
  const email = await prompt("Admin email: ");
  const password = await prompt("Admin password: ");
  rl.close();

  return { name, email, password };
}

async function createUserAccount({ name, email, password, roles = ["ADMIN"] }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log(`User ${email} exists`);
    return existingUser;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      profilePicture: null,
      dob: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: { create: roles.map((role) => ({ role })) },
    },
    include: { roles: true },
  });

  return user;
}

async function seedDatabase() {
  await prisma.$transaction(async (tx) => {
    // Insert subjects
    await tx.subject.createMany({
      data: subjects.map((name) => ({ name })),
      skipDuplicates: true,
    });

    // Insert classes
    await tx.class.createMany({
      data: classes.map((name) => ({ name })),
      skipDuplicates: true,
    });

    // Insert schools
    await tx.school.createMany({
      data: schools,
      skipDuplicates: true,
    });

    // Insert admin roles
    await tx.adminRole.createMany({
      data: adminRoles,
      skipDuplicates: true,
    });
  });
}

async function seed() {
  try {
    // Prompt for admin account creation
    const accountDetails = await promptForAccount();
    const user = await createUserAccount(
      accountDetails || {
        name: "Egesa Raymond",
        email: "egesaraymond644@gmail.com",
        password: "3f7jer03",
        roles: ["ADMIN"],
      }
    );

    console.log(`Created admin user:`, user.email);

    // Seed all database tables
    await seedDatabase();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed().then(() => process.exit(0));
