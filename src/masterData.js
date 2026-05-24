// Master Technology Stacks Table
export const masterStacks = [
  { id: "1001", name: "Spring Cloud" },
  { id: "1002", name: "Spring Boot" },
  { id: "1003", name: "Spring Core" },
  { id: "1004", name: "Spring MVC & REST" },
  { id: "1005", name: "Spring ORM & Data JPA" },
  { id: "1006", name: "Core Java" }
];

// Master Topics Table (Relational to Stack_id)
export const masterTopics = [
  { id: "1001", stackId: "1001", name: "Introduction to Spring Cloud" },
  { id: "1002", stackId: "1001", name: "Service Discovery design pattern – Eureka Server & Discovery Client" },
  { id: "1003", stackId: "1001", name: "Eureka Heartbeats & Self Preservation" },
  { id: "1004", stackId: "1001", name: "Spring Cloud Loadbalancer" },
  { id: "1005", stackId: "1001", name: "Spring Cloud OpenFeign" },
  { id: "1006", stackId: "1001", name: "Resilience4J- Circuit Breaker" },
  { id: "1007", stackId: "1001", name: "Spring Boot Actuator" },
  // Adding a few generic ones for the other stacks so the UI doesn't break if changed
  { id: "2001", stackId: "1002", name: "Spring Boot Annotations" },
  { id: "2002", stackId: "1002", name: "Spring Boot Dependencies" }
];

// Centralized Master List of SMEs across the entire platform
export const masterSmeList = [
  { id: "rushikesh.mote", role: "SME", skills: ["Spring Cloud", "Spring Core"] },
  { id: "ansh.patel", role: "SME", skills: ["Spring Boot"] },
  { id: "devesh.ghodpage", role: "ADMIN", skills: ["Spring MVC & REST", "Spring Cloud", "Spring Boot"] },
  { id: "shan.khan", role: "SME", skills: ["Spring Boot", "Spring Cloud"] },
  { id: "dipali.panzade", role: "SME", skills: ["Spring Cloud"] },
];