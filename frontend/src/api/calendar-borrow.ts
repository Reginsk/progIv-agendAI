import { useMemo } from 'react';
// api
import { useGetBorrows, createBorrow, updateBorrow, deleteBorrow } from 'src/api/borrow';
// types
import { ICalendarEvent } from 'src/types/calendar';
import { IBorrowItem, IBorrowUpdate } from 'src/types/borrow';

// ----------------------------------------------------------------------

// Convert borrow data to calendar event format
function borrowToCalendarEvent(borrow: IBorrowItem): ICalendarEvent {
  const getColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'borrowed':
        return '#1976D2'; // Blue for active borrows
      case 'returned':
        return '#2E7D32'; // Green for returned items
      case 'overdue':
        return '#D32F2F'; // Red for overdue items
      default:
        return '#757575'; // Gray for unknown status
    }
  };

  const title = borrow.item?.name || `Item ${borrow.itemId || 'Unknown'}`;
  const userName = borrow.user?.name || `User ${borrow.userId || 'Unknown'}`;

  return {
    id: borrow.id,
    color: getColor(borrow.status),
    title: `${title} - ${userName}`,
    allDay: true,
    description: `
      Item: ${title}
      User: ${userName}
      Quantity: ${borrow.quantity}
      Status: ${borrow.status.charAt(0).toUpperCase() + borrow.status.slice(1)}
      Borrow Date: ${new Date(borrow.borrow_date).toLocaleDateString()}
      ${borrow.returned_date ? `Returned: ${new Date(borrow.returned_date).toLocaleDateString()}` : ''}
    `.trim(),
    start: borrow.due_date,
    end: borrow.due_date,
  };
}

function calendarEventToBorrow(eventData: Partial<ICalendarEvent>, existingBorrow?: IBorrowItem): Partial<IBorrowUpdate> {
  return {
    due_date: eventData.end?.toString(),
  };
}

// ----------------------------------------------------------------------

export function useGetCalendarEvents() {
  const { borrows, borrowsLoading, borrowsError, borrowsValidating, borrowsEmpty } = useGetBorrows();

  const memoizedValue = useMemo(() => {
    const events = borrows.map(borrowToCalendarEvent);

    return {
      events: events || [],
      eventsLoading: borrowsLoading,
      eventsError: borrowsError,
      eventsValidating: borrowsValidating,
      eventsEmpty: borrowsEmpty,
    };
  }, [borrows, borrowsLoading, borrowsError, borrowsValidating, borrowsEmpty]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createCalendarEvent(eventData: ICalendarEvent) {
  throw new Error('Calendar events should be created through borrow management');
}

// ----------------------------------------------------------------------

export async function updateCalendarEvent(eventData: Partial<ICalendarEvent>) {
  if (!eventData.id) {
    throw new Error('Event ID is required for updates');
  }

  const borrowUpdate = calendarEventToBorrow(eventData);
  return await updateBorrow(eventData.id, borrowUpdate);
}

// ----------------------------------------------------------------------

export async function deleteCalendarEvent(eventId: string) {
  throw new Error('Calendar events should be deleted through borrow management');
}

// ----------------------------------------------------------------------

export { createBorrow as createBorrowEvent, updateBorrow as updateBorrowEvent, deleteBorrow as deleteBorrowEvent };