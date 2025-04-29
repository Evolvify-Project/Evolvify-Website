import { Link } from "react-router-dom";

export const skills = [
  // ^ Presentation Skill
  {
    id: "presentation",
    title: "Presentation Skill",
    subtitle: "Presentation",
    description: "Overcoming stage fright and speaking with confidence",
    descriptionPage:
      "Master the art of delivering impactful presentations. This skill focuses on overcoming stage fright, structuring your content effectively, and engaging your audience with confidence.",
    image: "/src/assets/images/Presentation_1.jpg",
    videoUrl: "/src/assets/videos/presentation-video.mp4",
    coursesCount: "7",
    level: "Beginner",
    unit: "1",
    units: 5,
    learnings: [
      "Techniques to overcome stage fright",
      "How to structure a presentation",
      "Engaging your audience effectively",
      "Using visuals to enhance your message",
    ],
    sidebarLinks: [
      "Designing Engaging Slides",
      "Using Visuals Effectively",
      "Public Speaking Tips",
      "Presentation Structure Mastery",
    ],
    unitsContent: [
      {
        unitNumber: 1,
        articles: [
          {
            id: 1,
            title: "Designing Engaging Slides Presentation articl unit-1",
          },
          { id: 2, title: "Using Visuals Effectively articl unit-1" },
        ],
        videos: [
          { id: 1, title: "Public Speaking Tips video unit-1" },
          { id: 2, title: "Presentation Structure Mastery video unit-1" },
        ],
      },
      {
        unitNumber: 2,
        articles: [
          { id: 3, title: "Storytelling in Presentations articl unit-2" },
        ],
        videos: [{ id: 3, title: "Engaging Your Audience video unit-2" }],
      },
      {
        unitNumber: 3,
        articles: [{ id: 4, title: "Overcoming Stage Fright articl unit-3" }],
        videos: [{ id: 4, title: "Confidence on Stage video unit-3" }],
      },
      {
        unitNumber: 4,
        articles: [{ id: 5, title: "Slide Design Principles articl unit-5" }],
        videos: [
          { id: 5, title: "PowerPoint Tips and Tricks video unit-5" },
          { id: 6, title: "Word Tips and Tricks video unit-5" },
        ],
      },
      {
        unitNumber: 5,
        articles: [{ id: 6, title: "Effective Use of Visuals articl unit-5" }],
        videos: [{ id: 7, title: "Final Presentation Checklist video unit-5" }],
      },
    ],
  },

  // ? Interview Skill
  {
    id: "interview",
    title: "Interview Skill",
    subtitle: "Interview",
    description: "Learn body language tips to create a strong impression",
    descriptionPage:
      "Prepare for success in any interview with tips on body language, answering common questions, and presenting yourself confidently.",
    image: "/src/assets/images/Interview_2jpg.jpg",
    videoUrl: "/src/assets/videos/interview-video.mp4",
    coursesCount: "5",
    level: "Beginner",
    unit: "1",
    units: 5,
    learnings: [
      "How to prepare for common interview questions",
      "Body language tips for a strong impression",
      "How to present yourself confidently",
      "Strategies for following up after an interview",
    ],
    sidebarLinks: [
      "Mastering Common Interview Questions",
      "Body Language Tips for Interviews",
      "Interview Preparation Strategies",
      "Mock Interview Examples",
    ],
    unitsContent: [
      {
        unitNumber: 1,
        articles: [
          { id: 1, title: "Mastering Common Interview Questions" },
          { id: 2, title: "Body Language Tips for Interviews" },
        ],
        videos: [
          { id: 1, title: "Interview Preparation Strategies" },
          { id: 2, title: "Mock Interview Examples" },
        ],
      },
      {
        unitNumber: 2,
        articles: [{ id: 3, title: "Dressing for Success" }],
        videos: [{ id: 3, title: "Common Mistakes in Interviews" }],
      },
      {
        unitNumber: 3,
        articles: [{ id: 4, title: "How to Follow Up After Interview" }],
        videos: [{ id: 4, title: "Impressing Recruiters" }],
      },
      {
        unitNumber: 4,
        articles: [{ id: 5, title: "Understanding Job Requirements" }],
        videos: [{ id: 5, title: "Practicing with a Friend" }],
      },
      {
        unitNumber: 5,
        articles: [{ id: 6, title: "Answering Tough Questions" }],
        videos: [{ id: 6, title: "Virtual Interview Tips" }],
      },
    ],
  },

  // * Communication Skill
  {
    id: "communication",
    title: "Communication Skill",
    subtitle: "Stop Using Filler Words! Speak More Clearly and Professionally",
    description: "The art of active listening for better relationships",
    descriptionPage:
      "Effective communication is the key to success in both personal and professional life. Whether you are speaking with colleagues, presenting ideas, or networking, strong communication skills can help you express yourself clearly, build relationships, and create opportunities.",
    image: "/src/assets/images/communication_3.jpg",
    videoUrl: "/src/assets/videos/communication-video.mp4",
    coursesCount: "7",
    level: "Beginner",
    unit: "1",
    units: 5,
    learnings: [
      "The core components of effective communication",
      "How to improve your verbal and non-verbal communication",
      "The role of active listening and emotional intelligence",
      "Practical tips to overcome communication barriers Common mistakes to avoid in both personal and professional settings",
    ],
    sidebarLinks: [
      "Stop Using Filler Words: Speak More Clearly and Professionally",
      "The Power of Words: How to Speak Clearly and Confidently",
      "Non-verbal Communication Techniques",
      "Listening vs Hearing",
    ],
    unitsContent: [
      {
        unitNumber: 1,
        articles: [
          {
            id: 1,
            title:
              "The Power of Words: How to Speak Clearly and Confidently articl unit-1",
          },
          { id: 2, title: "Understanding Active Listening articl unit-1" },
        ],
        videos: [
          {
            id: 1,
            title:
              "Stop Using Filler Words! Speak More Clearly and Professionally video unit-1",
          },
          { id: 2, title: "The Art of Active Listening video unit-1" },
        ],
      },
      {
        unitNumber: 2,
        articles: [
          {
            id: 3,
            title:
              "Body Language and Its Impact on Communication articl unit-2",
          },
        ],
        videos: [
          {
            id: 3,
            title: "Improve Non-verbal Cues in Conversations video unit-2",
          },
        ],
      },
      {
        unitNumber: 3,
        articles: [
          {
            id: 4,
            title: "How to Handle Difficult Conversations articl unit-3",
          },
        ],
        videos: [
          { id: 4, title: "Handling Conflict with Confidence video unit-3" },
        ],
      },
      {
        unitNumber: 4,
        articles: [
          { id: 5, title: "How to Communicate with Empathy articl unit-4" },
        ],
        videos: [
          {
            id: 5,
            title:
              "The Role of Empathy in Effective Communication video unit-4",
          },
        ],
      },
      {
        unitNumber: 5,
        articles: [{ id: 6, title: "Assessment" }],
        videos: [{ id: 6, title: "Assessment" }],
      },
    ],
  },

  // ! Teamwork Skill
  {
    id: "teamwork",
    title: "Teamwork Skill",
    subtitle: "Teamwork",
    description:
      "Learn to handle conflicts positively and create a productive team environment",
    descriptionPage:
      "Teamwork is essential for success in any group setting. Learn how to collaborate effectively, handle conflicts, and create a positive and productive team environment.",
    image: "/src/assets/images/Teamwork_4.jpg",
    videoUrl: "/src/assets/videos/teamwork-video.mp4",
    coursesCount: "5",
    level: "Beginner",
    unit: "1",
    units: 3,
    learnings: [
      "How to build trust in a team",
      "Strategies for effective collaboration",
      "Handling conflicts positively",
      "Creating a productive team environment",
    ],
    sidebarLinks: ["Building Trust in Teams", "Collaborative Problem Solving"],
    unitsContent: [
      {
        unitNumber: 1,
        articles: [{ id: 1, title: "Building Trust in Teams" }],
        videos: [{ id: 1, title: "Collaborative Problem Solving" }],
      },
      {
        unitNumber: 2,
        articles: [{ id: 2, title: "Handling Conflict in Teams" }],
        videos: [{ id: 2, title: "Constructive Feedback in Groups" }],
      },
      {
        unitNumber: 3,
        articles: [{ id: 3, title: "Fostering a Team Culture" }],
        videos: [{ id: 3, title: "Leading vs Following" }],
      },
    ],
  },

  // ~ Time Management Skill
  {
    id: "time-management",
    title: "Time Management Skill",
    subtitle: "Time Management",
    description: "Learn how to prioritize tasks and avoid procrastination",
    descriptionPage:
      "Effective time management helps you stay productive and reduce stress. Learn how to prioritize tasks, manage your time efficiently, and avoid procrastination.",
    image: "/src/assets/images/timeManagement_5.jpg",
    videoUrl: "/src/assets/videos/time-management-video.mp4",
    coursesCount: "5",
    level: "Beginner",
    unit: "1",
    units: 3,
    learnings: [
      "How to prioritize tasks effectively",
      "Techniques to avoid procrastination",
      "Time management tools and strategies",
      "Balancing work and personal life",
    ],
    sidebarLinks: ["Task Prioritization Techniques", "Avoiding Distractions"],
    unitsContent: [
      {
        unitNumber: 1,
        articles: [{ id: 1, title: "Task Prioritization Techniques" }],
        videos: [{ id: 1, title: "Avoiding Distractions" }],
      },
      {
        unitNumber: 2,
        articles: [{ id: 2, title: "Creating a Weekly Schedule" }],
        videos: [{ id: 2, title: "Time Blocking Techniques" }],
      },
      {
        unitNumber: 3,
        articles: [{ id: 3, title: "Managing Deadlines Efficiently" }],
        videos: [{ id: 3, title: "Beating Procrastination" }],
      },
    ],
  },
];
