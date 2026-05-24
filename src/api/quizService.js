import axiosClient from './axiosClient';

// Rich Mock Data - Combining screenshot DB schema with all previous UI scenario questions
const INITIAL_MOCK_DATA = [
  // 1. Database Screenshot Question 1
  { 
    id: 1001, 
    stem: "Alex is building a microservices-based system using Spring Boot. He wants features like centralized configuration, service discovery, and client-side load balancing without building everything from scratch. Which is the primary purpose of Spring Cloud?", 
    optionA: "To replace Spring Boot completely",
    optionB: "To provide tools for building distributed systems and microservices",
    optionC: "To manage only database transactions",
    optionD: "To handle only UI development",
    correctOption: "B",
    difficulty: "Medium",
    stack: "Spring Cloud", 
    topic: "Introduction to Spring Cloud",
    creatorId: "ansh.patel", 
    status: "Ready for Review" 
  },
  // 2. Database Screenshot Question 2
  { 
    id: 1002, 
    stem: "John has multiple instances of a service running dynamically in the cloud. He wants each service to automatically register itself and discover others without hardcoding URLs. Which component is used for this purpose?", 
    optionA: "Spring MVC",
    optionB: "Eureka Server",
    optionC: "Hibernate",
    optionD: "Apache Tomcat",
    correctOption: "B",
    difficulty: "Medium",
    stack: "Spring Cloud", 
    topic: "Service Discovery design pattern – Eureka Server & Discovery Client",
    creatorId: "ansh.patel", 
    status: "Approved" 
  },
  // 3. Draft Question (For My Questions Edit Demo)
  { 
    id: 1003, 
    stem: "Explain the internal combination of @SpringBootApplication.", 
    optionA: "Only @Component",
    optionB: "Combines @Configuration, @EnableAutoConfiguration, @ComponentScan",
    optionC: "Database management annotations",
    optionD: "Service discovery tags",
    correctOption: "B",
    difficulty: "Medium",
    stack: "Spring Boot", 
    topic: "Spring Boot Annotations",
    creatorId: "ansh.patel", 
    status: "Draft" 
  },
  // 4. Ready for Review (For Admin Assign Demo)
  { 
    id: 1004, 
    stem: "What is the primary purpose of Spring Boot Starters?", 
    optionA: "To start the JVM securely",
    optionB: "To provide opinionated, pre-configured dependency descriptors",
    optionC: "To completely replace Maven and Gradle",
    optionD: "To manage database connection pooling",
    correctOption: "B",
    difficulty: "Easy",
    stack: "Spring Boot", 
    topic: "Spring Boot Dependencies",
    creatorId: "shan.khan", 
    status: "Ready for Review" 
  },
  // 5. Under Review (Admin to SME Assignment Scenario)
  { 
    id: 1005, 
    stem: "How does API Gateway pattern function in a microservice architecture?", 
    optionA: "It handles database table routing",
    optionB: "It acts as a single entry point for API routing and filtering",
    optionC: "It generates UI components for React apps",
    optionD: "It caches local data exclusively",
    correctOption: "B",
    difficulty: "Hard",
    stack: "Spring Cloud", 
    topic: "Spring Cloud Loadbalancer",
    creatorId: "shan.khan", 
    status: "Under Review", 
    reviewerId: "devesh.ghodpage" 
  },
  // 6. Security Question (Another Admin Assignment Target)
  { 
    id: 1006, 
    stem: "Which statement best describes Spring Security filter chains?", 
    optionA: "They optimize raw SQL queries before execution",
    optionB: "They process HTTP requests to apply authentication and authorization",
    optionC: "They manage stateless session properties in Redis",
    optionD: "They filter out unused Java imports during compilation",
    correctOption: "B",
    difficulty: "Hard",
    stack: "Spring Boot", 
    topic: "Spring Boot Dependencies",
    creatorId: "rushikesh.mote", 
    status: "Ready for Review" 
  },
  // 7. Actuator Question (Mapped to Spring Cloud in DB screenshot)
  { 
    id: 1007, 
    stem: "What is the main function of an Actuator endpoint?", 
    optionA: "A frontend component for testing",
    optionB: "A production-ready monitoring and metrics management feature",
    optionC: "A database migration trigger",
    optionD: "A framework for unit testing controllers",
    correctOption: "B",
    difficulty: "Medium",
    stack: "Spring Cloud", 
    topic: "Spring Boot Actuator",
    creatorId: "ansh.patel", 
    status: "Approved" 
  },
  // 8. Under Review (SME to SME scenario)
  { 
    id: 1008, 
    stem: "Explain the purpose of the @Qualifier annotation in Spring.", 
    optionA: "It resolves autowiring conflicts when multiple beans of the same type exist",
    optionB: "It explicitly defines a new bean within the context",
    optionC: "It creates a REST endpoint mapping",
    optionD: "It handles global HTTP exceptions",
    correctOption: "A",
    difficulty: "Medium",
    stack: "Spring Core", 
    topic: "Spring Core Concepts",
    creatorId: "shan.khan", 
    status: "Under Review", 
    reviewerId: "ansh.patel" 
  },
  // 9. Under Review (SME to SME scenario)
  { 
    id: 1009, 
    stem: "What is the default scope of a Spring Bean if no scope is explicitly defined?", 
    optionA: "Prototype",
    optionB: "Request",
    optionC: "Singleton",
    optionD: "Session",
    correctOption: "C",
    difficulty: "Easy",
    stack: "Spring Core", 
    topic: "Spring Core Concepts",
    creatorId: "devesh.ghodpage", 
    status: "Under Review", 
    reviewerId: "rushikesh.mote" 
  },
  // 10. Under Review (Assigned to Admin Divya)
  { 
    id: 1010, 
    stem: "Which annotation is typically used at the class level to achieve global exception handling in Spring MVC?", 
    optionA: "@ExceptionHandler",
    optionB: "@ControllerAdvice",
    optionC: "@RestController",
    optionD: "@ErrorHandler",
    correctOption: "B",
    difficulty: "Medium",
    stack: "Spring MVC & REST", 
    topic: "REST API Error Handling",
    creatorId: "ansh.patel", 
    status: "Under Review", 
    reviewerId: "devesh.ghodpage" 
  }
];

export const quizService = {
  
  getMyQuestions: async () => {
    const currentUser = localStorage.getItem('currentUser') || 'Unknown';
    let db = JSON.parse(localStorage.getItem('mockQuizDB'));
    
    // Auto-heal empty databases
    if (!db || db.length === 0) {
      localStorage.setItem('mockQuizDB', JSON.stringify(INITIAL_MOCK_DATA));
      db = INITIAL_MOCK_DATA;
    }
    return db.filter(q => q.creatorId === currentUser);
  },

  getAllQuestions: async () => {
    let db = JSON.parse(localStorage.getItem('mockQuizDB'));
    if (!db || db.length === 0) {
      localStorage.setItem('mockQuizDB', JSON.stringify(INITIAL_MOCK_DATA));
      db = INITIAL_MOCK_DATA;
    }
    return db;
  },

  getMyPendingReviews: async () => {
    const currentUser = localStorage.getItem('currentUser') || 'Unknown';
    let db = JSON.parse(localStorage.getItem('mockQuizDB'));
    if (!db || db.length === 0) {
      localStorage.setItem('mockQuizDB', JSON.stringify(INITIAL_MOCK_DATA));
      db = INITIAL_MOCK_DATA;
    }
    return db.filter(q => q.reviewerId === currentUser && q.status === "Under Review");
  },

  submitEvaluation: async (questionId, newStatus, feedback = '') => {
    const currentDB = JSON.parse(localStorage.getItem('mockQuizDB')) || [];
    const updatedDB = currentDB.map(q => {
      if (q.id === questionId) {
        return { ...q, status: newStatus, reviewerFeedback: feedback };
      }
      return q;
    });
    localStorage.setItem('mockQuizDB', JSON.stringify(updatedDB));
    return true;
  },

  assignReviewer: async (questionId, reviewerId) => {
    const currentDB = JSON.parse(localStorage.getItem('mockQuizDB')) || [];
    const updatedDB = currentDB.map(q => {
      if (q.id === questionId) {
        return { ...q, status: "Under Review", reviewerId: reviewerId };
      }
      return q;
    });
    localStorage.setItem('mockQuizDB', JSON.stringify(updatedDB));
    return true;
  },

  saveDrafts: async (newQuestionsArray) => {
    const currentUser = localStorage.getItem('currentUser') || 'Unknown';
    const currentDB = JSON.parse(localStorage.getItem('mockQuizDB')) || [];
    
    const formattedQuestions = newQuestionsArray.map((q, index) => ({
      id: 2000 + Math.floor(Math.random() * 1000) + index,
      stem: q.stem || q["Question Stem"],
      stack: q.stack || q["Technology Stack"],
      topic: q.topic || q["Topic"],
      difficulty: q.difficulty || q["Difficulty"],
      status: "Draft",
      creatorId: currentUser,
      optionA: q.optionA || q["Option A"],
      optionB: q.optionB || q["Option B"],
      optionC: q.optionC || q["Option C"],
      optionD: q.optionD || q["Option D"],
      correctOption: q.correctOption || q["Correct Answer"]
    }));

    const updatedDB = [...formattedQuestions, ...currentDB];
    localStorage.setItem('mockQuizDB', JSON.stringify(updatedDB));
    return true;
  }
};