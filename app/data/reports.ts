// ~/data/reports.ts
export interface ReportBody {
  content: string;
}

interface SharedAvatar {
  src: string;
  alt: string;
}

interface SharedUser {
  name: string;
  href: string;
}

export type SharedItem = SharedAvatar | SharedUser;

export interface Report {
  id: string;
  name: string;
  shared: SharedItem[];
  status: string;
  lastUpdated: string; // ISO string for consistent hydration
  body: ReportBody | null;
  type: string;
  url: string;
  toJSON: () => any;
}

export const sharedItems = [
  {
    src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    alt: "Avatar",
  },
  {
    src: "https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    alt: "Avatar",
  },
  {
    src: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=facearea&facepad=3&w=300&h=300&q=80",
    alt: "Avatar",
  },
  {
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    alt: "Avatar",
  },
  { name: "Chris Lynch", href: "#" },
  { name: "Maria Guan", href: "#" },
  { name: "Amil Evara", href: "#" },
  { name: "Ebele Egbuna", href: "#" },
  { name: "James Patel", href: "#" },
  { name: "Sophie Nguyen", href: "#" },
  { name: "Liam Carter", href: "#" },
  { name: "Aisha Khan", href: "#" },
];

export const reports: Report[] = [
  {
    id: "1",
    name: "End of Term",
    shared: sharedItems.slice(0, 8),
    status: "Completed",
    lastUpdated: new Date("2025-06-10").toISOString(),
    body: { content: "Content for the end of term report." },
    type: "term-report",
    url: "/reports/end-of-term",
    toJSON: () => ({
      id: "1",
      name: "End of Term",
      status: "Completed",
    }),
  },
  {
    id: "2",
    name: "Beginning of Term",
    shared: sharedItems.slice(0, 6),
    status: "In Progress",
    lastUpdated: new Date("2025-06-09").toISOString(),
    body: { content: "Content for the beginning of term report." },
    type: "term-report",
    url: "/reports/beginning-of-term",
    toJSON: () => ({
      id: "2",
      name: "Beginning of Term",
      status: "In Progress",
    }),
  },
  {
    id: "3",
    name: "Activity Of Integration",
    shared: sharedItems.slice(0, 7),
    status: "Active",
    lastUpdated: new Date().toISOString(),
    body: { content: "Content for the activity of integration report." },
    type: "activity-report",
    url: "/reports/activity-of-integration",
    toJSON: () => ({
      id: "3",
      name: "Activity Of Integration",
      status: "Active",
    }),
  },
  {
    id: "4",
    name: "Mid Term",
    shared: sharedItems.slice(0, 5),
    status: "Pending",
    lastUpdated: new Date("2025-06-08").toISOString(),
    body: { content: "Content for the mid-term report." },
    type: "term-report",
    url: "/reports/mid-term",
    toJSON: () => ({
      id: "4",
      name: "Mid Term",
      status: "Pending",
    }),
  },
  {
    id: "5",
    name: "Test 09",
    shared: sharedItems.slice(0, 4),
    status: "Draft",
    lastUpdated: new Date("2025-06-07").toISOString(),
    body: { content: "Content for the test 09 report." },
    type: "test-report",
    url: "/reports/test-09",
    toJSON: () => ({
      id: "5",
      name: "Test 09",
      status: "Draft",
    }),
  },
  {
    id: "6",
    name: "Resource Paper",
    shared: sharedItems.slice(0, 3),
    status: "Review",
    lastUpdated: new Date("2025-06-06").toISOString(),
    body: { content: "Content for the resource paper report." },
    type: "resource-report",
    url: "/reports/resource-paper",
    toJSON: () => ({
      id: "6",
      name: "Resource Paper",
      status: "Review",
    }),
  },
  {
    id: "7",
    name: "Quarterly Review",
    shared: sharedItems.slice(0, 7),
    status: "Completed",
    lastUpdated: new Date("2025-06-05").toISOString(),
    body: { content: "Content for the quarterly review report." },
    type: "quarterly-report",
    url: "/reports/quarterly-review",
    toJSON: () => ({
      id: "7",
      name: "Quarterly Review",
      status: "Completed",
    }),
  },
  {
    id: "8",
    name: "Project Proposal",
    shared: sharedItems.slice(0, 5),
    status: "In Progress",
    lastUpdated: new Date("2025-06-04").toISOString(),
    body: { content: "Content for the project proposal report." },
    type: "proposal-report",
    url: "/reports/project-proposal",
    toJSON: () => ({
      id: "8",
      name: "Project Proposal",
      status: "In Progress",
    }),
  },
  {
    id: "9",
    name: "Annual Summary",
    shared: sharedItems.slice(0, 6),
    status: "Draft",
    lastUpdated: new Date("2025-06-03").toISOString(),
    body: { content: "Content for the annual summary report." },
    type: "summary-report",
    url: "/reports/annual-summary",
    toJSON: () => ({
      id: "9",
      name: "Annual Summary",
      status: "Draft",
    }),
  },
  {
    id: "10",
    name: "Evaluation Report",
    shared: sharedItems.slice(0, 4),
    status: "Pending",
    lastUpdated: new Date("2025-06-02").toISOString(),
    body: { content: "Content for the evaluation report." },
    type: "evaluation-report",
    url: "/reports/evaluation-report",
    toJSON: () => ({
      id: "10",
      name: "Evaluation Report",
      status: "Pending",
    }),
  },
  {
    id: "11",
    name: "Research Notes",
    shared: sharedItems.slice(0, 8),
    status: "Review",
    lastUpdated: new Date("2025-06-01").toISOString(),
    body: { content: "Content for the research notes report." },
    type: "research-report",
    url: "/reports/research-notes",
    toJSON: () => ({
      id: "11",
      name: "Research Notes",
      status: "Review",
    }),
  },
];
