const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid');
const Doctor = require('../models/Doctor'); 
const User = require('../models/User');
const sendReminderEmail = require('../utils/emailService');

exports.createMeeting = async (req, res) => {
    try {
        const { title, description, time, doctor } = req.body;
        const meetingId = uuidv4();
        const meetingLink = `https://meet.jit.si/${meetingId}`;

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

        const newMeeting = new Meeting({
            title,
            description,
            time: meetingTime,
            meetingLink,
            user: req.user.id,
            doctor: doctorRecord._id
        });

        const savedMeeting = await newMeeting.save();

        // Save meeting to user
        await User.findByIdAndUpdate(req.user.id, {
            $push: { meetings: savedMeeting._id }
        });

        // Save booked time in doctor
        doctorRecord.bookedDateTimes.push({
            time: meetingTime,
            user: req.user.id
        });
        await doctorRecord.save();

        // Set up a one-time reminder using setTimeout
        const reminderTime = new Date(meetingTime.getTime() - 56 * 60 * 1000); // 10 minutes before meeting
        const now = new Date();
        const delay = reminderTime.getTime() - now.getTime();

        if (delay > 0) {
            setTimeout(async () => {
                try {
                    const meeting = await Meeting.findById(savedMeeting._id);

                    if (!meeting.emailSent) {
                        await sendReminderEmail(
                            userRecord.email,
                            `Reminder: Your meeting with Dr. ${doctor}`,
                            `Hello,
                        
                        This is a reminder for your upcoming meeting. Please find the details below:
                        
                        Title       : ${title}
                        Description : ${description}
                        Doctor      : Dr. ${doctor}
                        Time        : ${meetingTime.toLocaleString()}
                        Meeting Type: Online
                        Link        : ${meetingLink}
                        
                        Please be ready a few minutes before the scheduled time.
                        
                        Note: This is an auto-generated email. Please do not reply.
                        
                        Best regards,
                        Petmedix Sri Lanka`
                        );
                        
                        

                        meeting.emailSent = true;
                        await meeting.save();

                        console.log('Reminder email sent.');
                    } else {
                        console.log('Reminder email already sent. Skipping.');
                    }
                } catch (err) {
                    console.error('Failed to send reminder email:', err);
                }
            }, delay);
        }

        res.status(201).json({ success: true, meeting: savedMeeting });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch all meetings
exports.getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.status(200).json({ success: true, meetings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch meetings for the authenticated user
exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ user: req.user.id }).populate('doctor', 'doctorName');
        res.status(200).json({ success: true, meetings });
    } catch (error) {
        console.error('Error fetching user meetings:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
