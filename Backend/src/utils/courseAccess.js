const courseLessonsFromSections = (sections) =>
  sections
    .slice()
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .flatMap((section) =>
      section.lessons
        .slice()
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((lesson) => ({ ...lesson, sectionTitle: section.title }))
    );

const getLessonLockState = ({
  lesson,
  previousLesson,
  purchased,
  completedLessonIds,
  isAdmin,
}) => {
  if (isAdmin) {
    return { locked: false, reason: null };
  }

  if (lesson.isFreePreview) {
    return { locked: false, reason: null };
  }

  if (!purchased) {
    return {
      locked: true,
      reason: "Buy this course to continue learning.",
    };
  }

  if (!previousLesson) {
    return { locked: false, reason: null };
  }

  if (!completedLessonIds.has(previousLesson.id)) {
    return {
      locked: true,
      reason: "Complete the previous lesson to unlock this video.",
    };
  }

  return { locked: false, reason: null };
};

const buildCourseTree = ({ course, progress = [], purchased = false, isAdmin = false }) => {
  const completedLessonIds = new Set(
    progress.filter((item) => item.isCompleted).map((item) => item.lessonId)
  );

  const orderedLessons = courseLessonsFromSections(course.sections);
  const lessonStateById = new Map();

  orderedLessons.forEach((lesson, index) => {
    const previousLesson = index > 0 ? orderedLessons[index - 1] : null;
    lessonStateById.set(
      lesson.id,
      getLessonLockState({
        lesson,
        previousLesson,
        purchased,
        completedLessonIds,
        isAdmin,
      })
    );
  });

  return {
    ...course,
    purchased,
    sections: course.sections
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((section) => ({
        ...section,
        lessons: section.lessons
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((lesson) => {
            const progressItem =
              progress.find((item) => item.lessonId === lesson.id) || null;
            const lockState = lessonStateById.get(lesson.id);
            return {
              ...lesson,
              isCompleted: Boolean(progressItem?.isCompleted),
              lastPositionSecs: progressItem?.lastPositionSecs || 0,
              locked: lockState.locked,
              lockReason: lockState.reason,
            };
          }),
      })),
  };
};

const getAdjacentLessonIds = (sections, lessonId) => {
  const orderedLessons = courseLessonsFromSections(sections);
  const index = orderedLessons.findIndex((lesson) => lesson.id === lessonId);

  if (index === -1) {
    return { previousLessonId: null, nextLessonId: null, previousLesson: null };
  }

  return {
    previousLessonId: orderedLessons[index - 1]?.id || null,
    nextLessonId: orderedLessons[index + 1]?.id || null,
    previousLesson: orderedLessons[index - 1] || null,
  };
};

module.exports = {
  buildCourseTree,
  getAdjacentLessonIds,
};
