export const sendOrderNotification = async (order: any, type: "status_update" | "created" | "delivered") => {
  try {
    const message = {
      status_update: `Your order #${order.orderNumber} status has been updated to: ${order.status}.`,
      created: `Thank you! Your order #${order.orderNumber} has been received.`,
      delivered: `Your order #${order.orderNumber} has been delivered. Enjoy!`
    }[type];

    console.log(`[NOTIFICATION SYSTEM] Sending updates for Order ${order.orderNumber}...`);
    
    // 1. Send Email (e.g., SendGrid/Nodemailer)
    console.log(`- Email sent to: ${order.shippingAddress.email} -> "${message}"`);
    
    // 2. Send SMS/WhatsApp (e.g., Twilio)
    console.log(`- WhatsApp message sent to: ${order.shippingAddress.phone} -> "${message}"`);

    // 3. Real-time Push (e.g., Pusher/Socket.io)
    console.log(`- Socket event emitted to channel: private-user-${order.user}`);

    // Return true to indicate successful "sending"
    return true;
  } catch (error) {
    console.error("[NOTIFICATION SYSTEM] Error:", error);
    return false;
  }
};
