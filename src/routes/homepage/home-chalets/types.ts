

export const calculateTotalCapacity = (rooms: Room[]) => {
  return rooms.reduce((total, room) => total + room.capacity, 0);
};

interface Room {
  capacity: number;
  chaletId: string;
  room: number;
  roomType: string;
}

interface AvailabilityDate {
  date: string;
  isAvailable: boolean;
}

export const formatAvailabilityDate = (calendar: AvailabilityDate[]) => {
  if (!calendar || calendar.length === 0) return 'Check availability';

  // Find the first available date range
  let startDate = null;
  let endDate = null;
  let consecutiveDays = 0;

  for (let i = 0; i < calendar.length; i++) {
    if (calendar[i].isAvailable) {
      if (!startDate) {
        startDate = new Date(calendar[i].date);
      }
      consecutiveDays++;
      
      // Check if we're at the end or if next date is unavailable
      if (i === calendar.length - 1 || !calendar[i + 1].isAvailable) {
        endDate = new Date(calendar[i].date);
        break;
      }
    } else if (startDate) {
      // If we hit an unavailable date after finding a start date
      endDate = new Date(calendar[i - 1].date);
      break;
    }
  }

  if (startDate) {
    if (consecutiveDays === 1) {
      return `Available on ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return `Available ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  return 'No availability';
};