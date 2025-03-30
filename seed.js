// app/utils/test-notifications.js
export const generateTestNotifications = (userId, count = 20) => {
  const now = new Date();

  const notificationTemplates = [
    {
      type: "MESSAGE",
      title: "New Message",
      message: "You have a new message from a friend",
      priority: 1,
    },
    {
      type: "FRIEND_REQUEST",
      title: "Friend Request",
      message: "You have a new friend request",
      priority: 1,
    },
    {
      type: "LIKE",
      title: "Post Liked",
      message: "Someone liked your post",
      priority: 2,
    },
    {
      type: "COMMENT",
      title: "New Comment",
      message: "Someone commented on your post",
      priority: 2,
    },
    {
      type: "MENTION",
      title: "You Were Mentioned",
      message: "You were mentioned in a post",
      priority: 1,
    },
    {
      type: "EVENT",
      title: "Upcoming Event",
      message: "You have an event coming up soon",
      priority: 3,
    },
    {
      type: "REMINDER",
      title: "Reminder",
      message: "This is a reminder for your task",
      priority: 3,
    },
    {
      type: "SYSTEM",
      title: "System Update",
      message: "New system update available",
      priority: 4,
    },
    {
      type: "PROMOTION",
      title: "Special Offer",
      message: "Check out this limited time offer",
      priority: 5,
    },
    {
      type: "SECURITY",
      title: "Security Alert",
      message: "Unusual login attempt detected",
      priority: 1,
    },
    {
      type: "ACHIEVEMENT",
      title: "New Achievement",
      message: "You unlocked a new achievement!",
      priority: 2,
    },
    {
      type: "WELCOME",
      title: "Welcome!",
      message: "Thanks for joining our platform",
      priority: 5,
    },
    {
      type: "NEWSLETTER",
      title: "Newsletter",
      message: "Our monthly newsletter is here",
      priority: 5,
    },
    {
      type: "ORDER",
      title: "Order Confirmation",
      message: "Your order has been confirmed",
      priority: 3,
    },
    {
      type: "SHIPPING",
      title: "Shipping Update",
      message: "Your order has shipped",
      priority: 3,
    },
    {
      type: "SUPPORT",
      title: "Support Ticket",
      message: "Your support request was received",
      priority: 2,
    },
    {
      type: "FEEDBACK",
      title: "Feedback Request",
      message: "How was your experience?",
      priority: 4,
    },
    {
      type: "PASSWORD",
      title: "Password Changed",
      message: "Your password was recently changed",
      priority: 1,
    },
    {
      type: "VERIFICATION",
      title: "Verify Email",
      message: "Please verify your email address",
      priority: 1,
    },
    {
      type: "INVITE",
      title: "Invitation",
      message: "You have been invited to join a group",
      priority: 2,
    },
  ];

  // Sort by priority (lower numbers = higher priority)
  const sortedTemplates = [...notificationTemplates].sort(
    (a, b) => (a.priority || 5) - (b.priority || 5)
  );

  return Array.from({ length: count }, (_, i) => {
    const template = sortedTemplates[i % sortedTemplates.length];
    return {
      ...template,
      userId,
      date: new Date(now.getTime() - i * 60000), // 1 minute apart
      read: false,
      archived: false,
    };
  });
};

export const postTestNotifications = async (userId, options = {}) => {
  const { batchSize = 5, delayBetweenBatches = 500 } = options;
  const notifications = generateTestNotifications(userId);
  const results = [];

  for (let i = 0; i < notifications.length; i += batchSize) {
    const batch = notifications.slice(i, i + batchSize);

    try {
      const batchResults = await Promise.all(
        batch.map((notification) =>
          fetch("/notifications", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              intent: "create",
              title: notification.title,
              message: notification.message,
              type: notification.type,
            }),
          }).then(async (res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
        )
      );

      results.push(...batchResults);

      // Add delay between batches except for the last one
      if (i + batchSize < notifications.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenBatches)
        );
      }
    } catch (error) {
      console.error(`Error posting batch ${i / batchSize + 1}:`, error);
      // Push error results for the failed batch
      batch.forEach(() => {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      });
    }
  }

  return results;
};
