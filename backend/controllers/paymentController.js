const Trip = require('../models/Trip');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Process payment for approved trip
exports.processPayment = async (req, res) => {
  try {
    const { tripId, applicantId, paymentMethod, paymentDetails } = req.body;
    const userId = req.user.id;

    console.log('=== PAYMENT DEBUG INFO ===');
    console.log('Payment request:', { tripId, applicantId, userId, paymentMethod });
    console.log('User ID from token:', userId);

    // Find the trip and verify the applicant
    const trip = await Trip.findById(tripId).populate('userId', 'name email');
    if (!trip) {
      console.log('Trip not found with ID:', tripId);
      return res.status(404).json({ message: 'Trip not found' });
    }

    console.log('Trip found:', trip.title);
    console.log('Trip applicants:', trip.applicants.map(app => ({
      _id: app._id.toString(),
      userId: app.userId.toString(),
      status: app.status
    })));

    // Find the applicant in the trip's applicants array with multiple fallback strategies
    let applicant;
    
    // Strategy 1: Find by userId and applicantId (if provided) with approved status
    if (applicantId) {
      applicant = trip.applicants.find(app => 
        app.userId.toString() === userId && 
        app._id.toString() === applicantId && 
        app.status === 'approved'
      );
      console.log('Strategy 1 - Searching with applicantId:', applicantId, 'Result:', !!applicant);
    }
    
    // Strategy 2: Find by userId with approved status (fallback)
    if (!applicant) {
      applicant = trip.applicants.find(app => 
        app.userId.toString() === userId && app.status === 'approved'
      );
      console.log('Strategy 2 - Searching by userId only with approved status. Result:', !!applicant);
    }
    
    // Strategy 3: Find any applicant for this user and auto-approve if pending (for demo purposes)
    if (!applicant) {
      const pendingApplicant = trip.applicants.find(app => 
        app.userId.toString() === userId && app.status === 'pending'
      );
      
      if (pendingApplicant) {
        console.log('Found pending applicant, auto-approving for demo purposes');
        pendingApplicant.status = 'approved';
        await trip.save();
        applicant = pendingApplicant;
      }
    }
    
    if (!applicant) {
      console.log('=== APPLICANT NOT FOUND ===');
      console.log('Searched for userId:', userId);
      console.log('Searched for applicantId:', applicantId);
      console.log('Available applicants:', trip.applicants.map(app => ({
        _id: app._id.toString(),
        userId: app.userId.toString(),
        status: app.status,
        userIdMatch: app.userId.toString() === userId,
        statusMatch: app.status === 'approved'
      })));
      
      // Try to find any applicant for this user regardless of status
      const anyApplicant = trip.applicants.find(app => app.userId.toString() === userId);
      if (anyApplicant) {
        console.log('Found applicant with different status:', anyApplicant.status);
        if (anyApplicant.status === 'rejected') {
          return res.status(400).json({ message: 'Application was rejected' });
        } else if (anyApplicant.status === 'paid') {
          const user = await User.findById(userId);
          if (user) {
            await sendAdminNotification({
              type: 'payment_completed',
              user: { id: userId, name: user.name, email: user.email },
              trip: { id: trip._id, title: trip.title, destination: trip.destination, startDate: anyApplicant.preferredStartDate, endDate: anyApplicant.preferredEndDate },
              payment: { method: paymentMethod, transactionId: anyApplicant.paymentDetails?.transactionId || `DUP_${Date.now()}`, amount: trip.customBudget || trip.budget || trip.basePrice || 0, currency: trip.currency || 'INR', paidAt: anyApplicant.paymentDetails?.paidAt || new Date() }
            });
          }
          return res.json({ success: true, alreadyPaid: true, message: 'Payment already completed', transactionId: anyApplicant.paymentDetails?.transactionId });
        }
      } else {
        // No application found at all - create one for demo purposes
        console.log('No application found, creating one for demo purposes');
        const newApplicant = {
          userId: userId,
          status: 'approved',
          preferredStartDate: new Date(),
          preferredEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          appliedAt: new Date()
        };
        
        trip.applicants.push(newApplicant);
        await trip.save();
        
        // Get the newly created applicant
        applicant = trip.applicants[trip.applicants.length - 1];
        console.log('Created new applicant:', applicant._id.toString());
      }
    }

    if (!applicant) {
      return res.status(400).json({ message: 'Unable to process payment - application issue' });
    }

    console.log('Applicant found:', {
      _id: applicant._id.toString(),
      status: applicant.status
    });

    if (applicant.status === 'paid') {
      const user = await User.findById(userId);
      if (user) {
        await sendAdminNotification({
          type: 'payment_completed',
          user: { id: userId, name: user.name, email: user.email },
          trip: { id: trip._id, title: trip.title, destination: trip.destination, startDate: applicant.preferredStartDate, endDate: applicant.preferredEndDate },
          payment: { method: paymentMethod, transactionId: applicant.paymentDetails?.transactionId || `DUP_${Date.now()}`, amount: trip.customBudget || trip.budget || trip.basePrice || 0, currency: trip.currency || 'INR', paidAt: applicant.paymentDetails?.paidAt || new Date() }
        });
      }
      return res.json({ success: true, alreadyPaid: true, message: 'Payment already completed', transactionId: applicant.paymentDetails?.transactionId });
    }

    // Simulate payment processing (in real app, integrate with Stripe/PayPal)
    const paymentResult = await simulatePayment(paymentMethod, paymentDetails, trip.basePrice);
    
    if (paymentResult.success) {
      // Update applicant status to paid
      applicant.status = 'paid';
      applicant.paymentDetails = {
        method: paymentMethod,
        transactionId: paymentResult.transactionId,
        amount: trip.basePrice,
        currency: trip.currency || 'USD',
        paidAt: new Date()
      };
      
      await trip.save();
      console.log('Payment successful, applicant status updated to paid');

      // Get user details for admin notification
      const user = await User.findById(userId);

      // For office visits, send a detailed meeting notification to admin
      if (paymentMethod === 'office' && paymentDetails) {
        await sendOfficeVisitNotification({
          user: { id: userId, name: user.name, email: user.email },
          trip: { id: trip._id, title: trip.title, destination: trip.destination },
          visitDetails: paymentDetails,
          transactionId: paymentResult.transactionId,
          amount: trip.customBudget || trip.budget || trip.basePrice || 0,
          currency: trip.currency || 'INR'
        });
      } else {
        await sendAdminNotification({
          type: 'payment_completed',
          user: { id: userId, name: user.name, email: user.email },
          trip: { id: trip._id, title: trip.title, destination: trip.destination, startDate: applicant.preferredStartDate, endDate: applicant.preferredEndDate, image: trip.image },
          payment: { method: paymentMethod, transactionId: paymentResult.transactionId, amount: trip.customBudget || trip.budget || trip.basePrice || 0, currency: trip.currency || 'INR', paidAt: new Date() }
        });
      }

      // Send confirmation notification to user
      if (user) {
        const notificationId = `payment_${tripId}_${applicant._id}_${Date.now()}`;
        const notification = {
          id: notificationId,
          type: 'payment_confirmed',
          title: 'Payment Confirmed! ✅',
          message: `Your payment for "${trip.title}" has been processed successfully. You're all set for your adventure!`,
          tripId: trip._id,
          isRead: false,
          actionRequired: false,
          createdAt: new Date()
        };
        
        user.notifications.push(notification);
        await user.save();
        console.log('Payment confirmation notification sent to user');
      }

      console.log('=== PAYMENT COMPLETED SUCCESSFULLY ===');
      res.json({
        success: true,
        message: 'Payment processed successfully',
        transactionId: paymentResult.transactionId,
        trip: {
          title: trip.title,
          destination: trip.destination,
          amount: trip.basePrice,
          currency: trip.currency || 'USD'
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed',
        error: paymentResult.error
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// Function to send admin notification (simulate admin dashboard update)
const sendAdminNotification = async (data) => {
  try {
    console.log('=== ADMIN NOTIFICATION ===');
    console.log('Payment Completed - New Booking Confirmed');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Customer Details:');
    console.log('  - Name:', data.user.name);
    console.log('  - Email:', data.user.email);
    console.log('  - Customer ID:', data.user.id);
    console.log('Trip Details:');
    console.log('  - Trip:', data.trip.title);
    console.log('  - Destination:', data.trip.destination);
    console.log('  - Start Date:', data.trip.startDate);
    console.log('  - End Date:', data.trip.endDate);
    console.log('Payment Details:');
    console.log('  - Method:', data.payment.method.toUpperCase());
    console.log('  - Transaction ID:', data.payment.transactionId);
    console.log('  - Amount:', data.payment.currency, data.payment.amount);
    console.log('  - Paid At:', data.payment.paidAt);
    console.log('=== END ADMIN NOTIFICATION ===');
    
    // Store notification in a way that admin dashboard can access
    // In a real application, this would be stored in database and sent via WebSocket/SSE
    // For demo purposes, we'll use a global variable or file system
    
    // Create notification object for admin
    const adminNotification = new Notification({
      type: 'payment',
      priority: 'high',
      title: `Payment Confirmed: ${data.trip.title}`,
      message: `${data.user.name} (${data.user.email}) has completed payment of ${data.payment.currency} ${data.payment.amount} for "${data.trip.title}" via ${data.payment.method.toUpperCase()}. Transaction ID: ${data.payment.transactionId}`,
      customer: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      },
      trip: {
        id: data.trip.id,
        title: data.trip.title,
        destination: data.trip.destination,
        startDate: data.trip.startDate,
        endDate: data.trip.endDate
      }
    });

    await adminNotification.save();
    console.log('Admin notification saved to DB:', adminNotification._id);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
};

// Send detailed office visit notification to admin
const sendOfficeVisitNotification = async ({ user, trip, visitDetails, transactionId, amount, currency }) => {
  try {
    const visitDate = visitDetails.preferredDate
      ? new Date(visitDetails.preferredDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : 'Not specified';
    const visitTime = visitDetails.preferredTime || 'Not specified';

    const adminNotification = new Notification({
      type: 'booking',
      priority: 'urgent',
      title: `🏢 Office Visit Scheduled — ${trip.title}`,
      message:
        `Customer ${visitDetails.fullName || user.name} has scheduled an office visit to pay for "${trip.title}".
` +
        `📅 Visit Date: ${visitDate} at ${visitTime}
` +
        `👤 Name: ${visitDetails.fullName || user.name}
` +
        `📞 Phone: ${visitDetails.phoneNumber || 'N/A'}
` +
        `✉️ Email: ${visitDetails.email || user.email}
` +
        `💰 Amount Due: ${currency} ${amount}
` +
        `📝 Notes: ${visitDetails.notes || 'None'}
` +
        `🔖 Ref ID: ${transactionId}`,
      customer: {
        id: user.id,
        name: visitDetails.fullName || user.name,
        email: visitDetails.email || user.email,
        phone: visitDetails.phoneNumber || ''
      },
      trip: {
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        startDate: visitDetails.preferredDate ? new Date(visitDetails.preferredDate) : null
      }
    });

    await adminNotification.save();
    console.log('Office visit notification saved to DB:', adminNotification._id);
    return { success: true };
  } catch (error) {
    console.error('Error saving office visit notification:', error);
    return { success: false, error: error.message };
  }
};

// Get admin notifications endpoint
exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = global.adminNotifications || [];
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark admin notification as read
exports.markAdminNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notifications = global.adminNotifications || [];
    
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking admin notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Simulate payment processing (replace with real payment gateway)
const simulatePayment = async (method, details, amount) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Always return success for demo purposes
  return {
    success: true,
    transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

// Get payment history for user
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const trips = await Trip.find({
      'applicants.userId': userId,
      'applicants.status': 'paid'
    }).populate('userId', 'name email');
    
    const payments = [];
    trips.forEach(trip => {
      const userApplicant = trip.applicants.find(app => 
        app.userId.toString() === userId && app.status === 'paid'
      );
      
      if (userApplicant && userApplicant.paymentDetails) {
        payments.push({
          tripId: trip._id,
          tripTitle: trip.title,
          destination: trip.destination,
          paymentDetails: userApplicant.paymentDetails,
          organizer: trip.userId.name
        });
      }
    });
    
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};