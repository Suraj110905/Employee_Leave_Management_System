/**
 * Simulated Application Notification Records.
 * Contains read/unread statuses and contextual alerts.
 */
export const DUMMY_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Leave Approved",
    message: "Your sick leave request for 2026-06-10 has been approved by Sarah Hansen.",
    time: "2 hours ago",
    read: false,
    type: "approval",
  },
  {
    id: "notif-2",
    title: "New Leave Request",
    message: "Alice Smith has submitted a new annual leave request for review.",
    time: "4 hours ago",
    read: false,
    type: "request",
  },
  {
    id: "notif-3",
    title: "System Update",
    message: "The LeavePortal system has been successfully upgraded to v1.0.0.",
    time: "1 day ago",
    read: true,
    type: "system",
  },
  {
    id: "notif-4",
    title: "Holiday Reminder",
    message: "Friendly reminder: Monday, Sept 7th is a national holiday.",
    time: "3 days ago",
    read: true,
    type: "info",
  },
];

export default DUMMY_NOTIFICATIONS;
