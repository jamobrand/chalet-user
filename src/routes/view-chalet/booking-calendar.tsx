import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { startOfToday, isBefore, addMonths } from 'date-fns';
import { UnavailableDate, Booking } from './view-chalet-types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingCalendarProps {
  unavailableDates: UnavailableDate[];
  bookings: Booking[];
}

export const BookingCalendar = ({ unavailableDates, bookings }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(today);

  // Create a Set of disabled dates for O(1) lookup
  const disabledDatesSet = new Set([
    ...unavailableDates.map((d) => new Date(d.date).toISOString()),
    ...bookings.flatMap((booking) =>
      booking.bookingDates.map((date) => new Date(date.date).toISOString()),
    ),
  ]);

  // Optimized date checking function
  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || disabledDatesSet.has(date.toISOString());
  };

  const handlePreviousMonth = () => {
    const newMonth = addMonths(currentMonth, -1);
    // Only allow navigating to months from current month onwards
    if (!isBefore(newMonth, startOfToday())) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  // Check if we can go to previous month (only if it's not before current month)
  const canGoPrevious = !isBefore(addMonths(currentMonth, -1), startOfToday());

  const calendarClass = cn(
    'rounded-md border-0',
    'w-full [&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-1',
    '[&_.rdp-cell]:p-0 [&_.rdp-button]:w-12 [&_.rdp-button]:h-12',
    '[&_.rdp-button:hover]:bg-gray-50 [&_.rdp-button:hover]:rounded-full',
    '[&_.rdp-button:focus]:bg-gray-50 [&_.rdp-button:focus]:rounded-full',
    '[&_.rdp-button.rdp-day_selected]:bg-gray-900 [&_.rdp-button.rdp-day_selected]:text-white [&_.rdp-button.rdp-day_selected]:rounded-full',
    '[&_.rdp-button.rdp-day_selected]:hover:bg-gray-800',
    '[&_.rdp-button.rdp-day_disabled]:opacity-25 [&_.rdp-button.rdp-day_disabled]:cursor-not-allowed',
    '[&_.rdp-head_cell]:font-normal [&_.rdp-head_cell]:text-gray-500',
    '[&_.rdp-caption]:mb-4',
    '[&_.rdp-nav]:hidden',
    '[&_.rdp-caption_label]:hidden',
  );

  return (
    <div className="space-y-6">
      <div className="calendar-container relative">
        <div className="absolute top-2 w-full flex justify-between px-8 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousMonth}
            disabled={!canGoPrevious}
            className="rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="rounded-full hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden md:grid md:grid-cols-2 md:gap-8">
          {[0, 1].map((monthOffset) => (
            <Calendar
              key={monthOffset}
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={isDateDisabled}
              month={addMonths(currentMonth, monthOffset)}
              className={calendarClass}
              classNames={{
                nav_button_next: 'hidden',
                nav_button_previous: 'hidden',
                nav_button: 'hidden',
                nav: 'hidden',
              }}
              showOutsideDays={false}
              fromDate={today}
            />
          ))}
        </div>

        <div className="md:hidden">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            month={currentMonth}
            className={calendarClass}
            classNames={{
              nav_button_next: 'hidden',
              nav_button_previous: 'hidden',
              nav_button: 'hidden',
              nav: 'hidden',
            }}
            showOutsideDays={false}
            fromDate={today}
          />
        </div>
      </div>
    </div>
  );
};
