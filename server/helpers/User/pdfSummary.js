const ClockInOut = require('../../models/ClockInOut');

module.exports = {
    getUserWorkSummary: async (userId, fromDate, toDate) => {
        const clockedInDocuments = await ClockInOut.find({
            user: userId,
            clockIn: { $gte: fromDate, $lte: toDate }
        });
    
        let dailyWorkSummary = {};
    
        clockedInDocuments.forEach(doc => {
            const clockInDate = doc.clockIn.toISOString().split('T')[0];
            const clockIn = doc.clockIn;
            const clockOut = doc.clockOut || new Date(); // If clockOut is null, use current time.
            const diff = clockOut - clockIn;
            const hours = diff / 1000 / 60 / 60;
    
            if (!dailyWorkSummary[clockInDate]) {
                dailyWorkSummary[clockInDate] = {
                    totalHoursWorked: 0,
                    totalHoursAssigned: 0
                };
            }
    
            if (doc.assigned) {
                dailyWorkSummary[clockInDate].totalHoursAssigned += hours;
            } else {
                dailyWorkSummary[clockInDate].totalHoursWorked += hours;
            }
        });
    
        // Round the values
        Object.keys(dailyWorkSummary).forEach(date => {
            dailyWorkSummary[date].totalHoursAssigned = Math.round(dailyWorkSummary[date].totalHoursAssigned);
            dailyWorkSummary[date].totalHoursWorked = Math.round(dailyWorkSummary[date].totalHoursWorked);
        });
    
        return dailyWorkSummary;
    }
}