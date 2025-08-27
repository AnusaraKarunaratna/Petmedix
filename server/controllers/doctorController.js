const Doctor = require('../models/Doctor');
const path = require('path');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const sendReminderEmail = require('../utils/emailService');

exports.registerDoctor = async (req, res) => {
  try {
    const { data } = req.body;
    const doctorData = JSON.parse(data);

    if (req.files) {
      if (req.files.coverImage) doctorData.coverImage = req.files.coverImage[0].filename;
      if (req.files.profileImage) doctorData.profileImage = req.files.profileImage[0].filename;
      if (req.files.clinicImage) doctorData.clinicImage = req.files.clinicImage[0].filename;
    }

    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();
    res.status(201).json({ message: 'Doctor registered successfully!', doctor: newDoctor });
  } catch (error) {
    console.error('Error in registerDoctor:', error);
    res.status(500).json({ message: 'Error registering doctor', error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}, 'doctorName occupation contactNumbers gmail profileImage');

    const updatedDoctors = doctors.map((doctor) => ({
      ...doctor._doc,
      profileImage: doctor.profileImage
        ? `${req.protocol}://${req.get('host')}/uploads/${doctor.profileImage}`
        : null,
    }));

    res.status(200).json(updatedDoctors);
  } catch (error) {
    console.error('Error in getDoctors:', error);
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error in getDoctorById:', error);
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { name, message, rating } = req.body;
    const doctorId = req.params.id;

    if (!name || !message || !rating) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the doctor by ID
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create a new feedback object
    const newFeedback = {
      name,
      message,
      rating,
      date: new Date(),
    };

    // Add the feedback to the doctor
    doctor.feedbacks.push(newFeedback);

    // Save the doctor with the new feedback
    await doctor.save();

    res.status(200).json({ message: 'Feedback added successfully', feedback: newFeedback });
  } catch (error) {
    console.error('Error in addFeedback:', error);
    res.status(500).json({ message: 'Error adding feedback', error: error.message });
  }
};

exports.createOnlineReservation = async (req, res) => {
  try {
    const { title, description, time, doctor } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    const doctorRecord = await Doctor.findOne({ doctorName: doctor });
    const userRecord = await User.findById(req.user.id);

    if (!doctorRecord || !userRecord) {
      return res.status(404).json({ error: 'Doctor or user not found.' });
    }

    const meetingTime = new Date(time);
    if (isNaN(meetingTime)) {
      return res.status(400).json({ error: 'Invalid time provided.' });
    }

    const meetingId = uuidv4();
    const meetingLink = `https://meet.jit.si/${meetingId}`;

    const newReservation = {
      title,
      description,
      time: meetingTime,
      meetingLink,
      user: req.user.id,
      emailSent: false
    };

    // Initialize arrays if undefined in Doctor
    if (!doctorRecord.onlineReservations) doctorRecord.onlineReservations = [];
    if (!doctorRecord.bookedDateTimes) doctorRecord.bookedDateTimes = [];

    // Add reservation & booked time to Doctor
    doctorRecord.onlineReservations.push(newReservation);
    doctorRecord.bookedDateTimes.push({
      time: meetingTime,
      user: req.user.id
    });

    // Save Doctor record
    await doctorRecord.save();

    // Prepare reservation object for User model
    const userReservation = {
      title,
      description,
      time: meetingTime,
      meetingLink,
      doctor,
      emailSent: false,
    };

    // Initialize arrays if undefined in User
    if (!userRecord.onlineReservations) userRecord.onlineReservations = [];
    if (!userRecord.bookedDateTimes) userRecord.bookedDateTimes = [];

    // Add reservation & booked time to User
    userRecord.onlineReservations.push(userReservation);
    userRecord.bookedDateTimes.push({
      time: meetingTime,
      doctor
    });

    // Save User record
    await userRecord.save();

    // Reminder email logic
    const reminderTime = new Date(meetingTime.getTime() - 10 * 60 * 1000);
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(async () => {
        try {
          // Refetch doctor and user to update emailSent status
          const updatedDoctor = await Doctor.findById(doctorRecord._id);
          const updatedUser = await User.findById(userRecord._id);

          const reservationDoctor = updatedDoctor.onlineReservations.find(
            r => r.user.toString() === req.user.id && r.time.getTime() === meetingTime.getTime()
          );

          const reservationUser = updatedUser.onlineReservations.find(
            r => r.time.getTime() === meetingTime.getTime() && r.doctor === doctor
          );

          if (reservationDoctor && !reservationDoctor.emailSent) {
            await sendReminderEmail(
              userRecord.email,
              `Reminder: Your meeting with Dr. ${doctor}`,
              `Hello,

This is a reminder for your upcoming meeting.

Title       : ${title}
Description : ${description}
Doctor      : Dr. ${doctor}
Time        : ${meetingTime.toLocaleString()}
Meeting Type: Online
Link        : ${meetingLink}

Note: This is an auto-generated email. Please do not reply.

Best regards,
Petmedix Sri Lanka`
            );

            reservationDoctor.emailSent = true;
            reservationUser.emailSent = true;

            await updatedDoctor.save();
            await updatedUser.save();

            console.log('Reminder email sent.');
          }
        } catch (err) {
          console.error('Failed to send reminder email:', err);
        }
      }, delay);
    }

    res.status(201).json({ success: true, reservation: newReservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSavedMeetings = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return the saved online reservations
    res.status(200).json({
      success: true,
      meetings: user.onlineReservations || []
    });
  } catch (error) {
    console.error('Error fetching saved meetings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.createPhysicalReservation = async (req, res) => {
  try {
    const { title, description, time, doctor, location } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    const doctorRecord = await Doctor.findOne({ doctorName: doctor });
    const userRecord = await User.findById(req.user.id);

    if (!doctorRecord || !userRecord) {
      return res.status(404).json({ error: 'Doctor or user not found.' });
    }

    const meetingTime = new Date(time);
    if (isNaN(meetingTime)) {
      return res.status(400).json({ error: 'Invalid time provided.' });
    }

    const newReservation = {
      title,
      description,
      time: meetingTime,
      location,
      user: req.user.id,
      emailSent: false,
    };

    // Initialize arrays if undefined in Doctor
    if (!doctorRecord.PhysicalReservations) doctorRecord.PhysicalReservations = [];
    if (!doctorRecord.bookedDateTimes) doctorRecord.bookedDateTimes = [];

    doctorRecord.PhysicalReservations.push(newReservation);
    doctorRecord.bookedDateTimes.push({
      time: meetingTime,
      user: req.user.id,
    });

    await doctorRecord.save();

    // Prepare reservation object for User model (similar shape but doctor ref)
    const userReservation = {
      title,
      description,
      time: meetingTime,
      location,
      doctor,
      emailSent: false,
    };

    // Initialize arrays if undefined in User
    if (!userRecord.PhysicalReservations) userRecord.PhysicalReservations = [];
    if (!userRecord.bookedDateTimes) userRecord.bookedDateTimes = [];

    userRecord.PhysicalReservations.push(userReservation);
    userRecord.bookedDateTimes.push({
      time: meetingTime,
      doctor,
    });

    await userRecord.save();

    // Reminder email logic (unchanged, just adjusted to PhysicalReservations)
    const reminderTime = new Date(meetingTime.getTime() - 10 * 60 * 1000);
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(async () => {
        try {
          const updatedDoctor = await Doctor.findById(doctorRecord._id);
          const updatedUser = await User.findById(userRecord._id);

          const reservationDoctor = updatedDoctor.PhysicalReservations.find(
            r => r.user.toString() === req.user.id && r.time.getTime() === meetingTime.getTime()
          );

          const reservationUser = updatedUser.PhysicalReservations.find(
            r => r.time.getTime() === meetingTime.getTime() && r.doctor === doctor
          );

          if (reservationDoctor && !reservationDoctor.emailSent) {
            await sendReminderEmail(
              userRecord.email,
              `Reminder: Your meeting with Dr. ${doctor}`,
              `Hello,

This is a reminder for your upcoming meeting.

Title       : ${title}
Description : ${description}
Doctor      : Dr. ${doctor}
Time        : ${meetingTime.toLocaleString()}
Meeting Type: Physical
Location    : ${location || 'N/A'}

Note: This is an auto-generated email. Please do not reply.

Best regards,
Petmedix Sri Lanka`
            );

            reservationDoctor.emailSent = true;
            reservationUser.emailSent = true;

            await updatedDoctor.save();
            await updatedUser.save();

            console.log('Reminder email sent.');
          }
        } catch (err) {
          console.error('Failed to send reminder email:', err);
        }
      }, delay);
    }

    res.status(201).json({ success: true, reservation: newReservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSavedPhysicalMeetings = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    // Find the user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Return the saved online reservations
    res.status(200).json({
      success: true,
      meetings: user.PhysicalReservations || []
    });
  } catch (error) {
    console.error('Error fetching saved meetings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOnlineMeetingsByDoctorName = async (req, res) => {
  try {
    const { doctorName } = req.query;

    if (!doctorName) {
      return res.status(400).json({ error: 'doctorName query parameter is required' });
    }

    // Find doctor document by doctorName
    const doctor = await Doctor.findOne({ doctorName });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get online meetings (onlineReservations)
    const onlineMeetings = doctor.onlineReservations || [];

    return res.status(200).json({ meetings: onlineMeetings });
  } catch (error) {
    console.error('Error fetching online meetings:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getPhysicalMeetingsByDoctorName = async (req, res) => {
  try {
    const { doctorName } = req.query;

    if (!doctorName) {
      return res.status(400).json({ error: 'doctorName query parameter is required' });
    }

    // Find doctor document by doctorName
    const doctor = await Doctor.findOne({ doctorName });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get physical meetings (PhysicalReservations)
    const physicalMeetings = doctor.PhysicalReservations || [];

    return res.status(200).json({ meetings: physicalMeetings });
  } catch (error) {
    console.error('Error fetching physical meetings:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.getPhysicalMeetingsLocationsByDoctorName = async (req, res) => {
  try {
    const { doctorName } = req.query;

    if (!doctorName) {
      return res.status(400).json({ error: 'doctorName query parameter is required' });
    }

    // Find doctor document by doctorName
    const doctor = await Doctor.findOne({ doctorName });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Return places with name, mapUrl, and availability
    const locations = doctor.places.map(place => ({
      name: place.name,
      mapUrl: place.mapUrl,
      availability: place.availability
    }));

    return res.status(200).json({ locations });
  } catch (error) {
    console.error('Error fetching physical meetings:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
      const doctors = await Doctor.find();
      res.status(200).json({ data: doctors });
  } catch (error) {
      console.error('Error fetching doctors:', error);
      res.status(500).json({ message: 'Failed to fetch doctors.' });
  }
};
