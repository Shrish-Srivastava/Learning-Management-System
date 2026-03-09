import { ArrowRight, Layers, PlayCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

function CourseCard({ course, purchased }) {
  return (
    <article className="course-card glass-panel">
      <div className="course-card-media">
        <img src={course.thumbnail} alt={course.title} />
        <div className="course-card-badges">
          <span className="glass-chip">First lesson free</span>
          <span className="glass-chip price-chip">Rs. {course.price}</span>
        </div>
      </div>

      <div className="course-card-body">
        <div className="card-meta-row">
          <span>{course.category}</span>
          <span>{course.level}</span>
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <div className="card-stats">
          <div className="stat-pill">
            <Layers size={15} />
            <div>
              <strong>{course.sectionCount}</strong>
              <span>Sections</span>
            </div>
          </div>
          <div className="stat-pill">
            <PlayCircle size={15} />
            <div>
              <strong>{course.lessonCount}</strong>
              <span>Lessons</span>
            </div>
          </div>
          <div className="stat-pill">
            <Star size={15} />
            <div>
              <strong>Preview</strong>
              <span>Lesson 1</span>
            </div>
          </div>
        </div>

        <div className="card-actions">
          <Link className="button primary-button" to={`/courses/${course.slug}`}>
            {purchased ? "Continue Learning" : "View Course"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export { CourseCard };
