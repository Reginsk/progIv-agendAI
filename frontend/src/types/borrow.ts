// ----------------------------------------------------------------------

export type IBorrowStatus = 'active' | 'returned' | 'overdue';

export type IBorrowItem = {
  id: string;
  userId?: string;
  itemId?: string;
  quantity: number;
  borrow_date: string;
  due_date: string;
  returned_date?: string;
  status: IBorrowStatus;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  item?: {
    id: string;
    name: string;
    description: string;
    category?: string;
  };
};

export type IBorrowCreate = {
  userId: string;
  itemId: string;
  quantity: number;
  borrow_date: string;
  due_date: string;
};

export type IBorrowUpdate = {
  returned_date?: string;
  status?: IBorrowStatus;
  quantity?: number;
  due_date?: string;
};