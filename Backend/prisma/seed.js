const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { PrismaClient, Role } = require("@prisma/client");
const { courseSeedData } = require("../src/utils/courseSeedData");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@skillup.com";
  const name = process.env.ADMIN_NAME || "Shrish";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash(password, 10),
    },
    create: {
      name,
      email,
      role: Role.ADMIN,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
}

async function seedCourses() {
  for (const course of courseSeedData) {
    const existing = await prisma.course.findUnique({
      where: { slug: course.slug },
    });

    const savedCourse = existing
      ? await prisma.course.update({
          where: { id: existing.id },
          data: {
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            duration: course.duration,
            thumbnail: course.thumbnail,
            price: course.price,
            playlistId: course.playlistId,
            isPublished: true,
          },
        })
      : await prisma.course.create({
          data: {
            title: course.title,
            slug: course.slug,
            description: course.description,
            category: course.category,
            level: course.level,
            duration: course.duration,
            thumbnail: course.thumbnail,
            price: course.price,
            playlistId: course.playlistId,
            isPublished: true,
          },
        });

    await prisma.section.deleteMany({ where: { courseId: savedCourse.id } });

    for (const section of course.sections) {
      const createdSection = await prisma.section.create({
        data: {
          courseId: savedCourse.id,
          title: section.title,
          orderIndex: section.lessons[0].sectionOrder,
        },
      });

      for (const lesson of section.lessons) {
        await prisma.lesson.create({
          data: {
            title: lesson.title,
            description: lesson.description,
            durationLabel: lesson.durationLabel,
            orderIndex: lesson.orderIndex,
            sectionOrder: lesson.sectionOrder,
            courseOrder: lesson.playlistIndex + 1,
            playlistIndex: lesson.playlistIndex,
            isFreePreview: lesson.isFreePreview,
            playlistId: lesson.playlistId,
            youtubeUrl: lesson.youtubeUrl,
            courseId: savedCourse.id,
            sectionId: createdSection.id,
          },
        });
      }
    }
  }
}

async function main() {
  await seedAdmin();
  await seedCourses();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("SkillUp seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
