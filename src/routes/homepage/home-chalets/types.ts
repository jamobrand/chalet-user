export const formatAvailabilityDate = (calendar:UnavailableDate[]) => {
    if (!calendar || calendar.length === 0) return 'Check availability';
    
    let startDate = null;
    let endDate = null;
    let currentStreak = 0;
    
    for (let i = 0; i < calendar.length; i++) {
      if (calendar[i].isAvailable) {
        if (!startDate) {
          startDate = new Date(calendar[i].date);
        }
        currentStreak++;
        if (currentStreak >= 5 || i === calendar.length - 1) {
          endDate = new Date(calendar[i].date);
          break;
        }
      } else {
        startDate = null;
        currentStreak = 0;
      }
    }
    
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { day: 'numeric' })}`;
    }
    
    return 'Check availability';
  };
  
  export const calculateTotalCapacity = (rooms:Room[]) => {
    return rooms.reduce((total, room) => total + room.capacity, 0);
  };

  interface Room {
    capacity: number;
    chaletId: string;
    room:number;
    roomType:string;
  }

  interface UnavailableDate {
    id: string;
    chaletId: string;
    date: string;
    isAvailable?: boolean;
  }