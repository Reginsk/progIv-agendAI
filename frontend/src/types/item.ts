// ----------------------------------------------------------------------

export type IItemTableFilterValue = string | string[];

export type IItemTableFilters = {
    name: string;
    category: string[];
};

// ----------------------------------------------------------------------

export type IItemItem = {
    id: string;
    name: string;
    description?: string;
    category: string;
    total_quantity: number;
    available_quantity: number;
    created_at?: string;
    updated_at?: string;
};

// ----------------------------------------------------------------------

export type IItemCard = {
    id: string;
    name: string;
    category: string;
    total_quantity: number;
    available_quantity: number;
    description?: string;
};