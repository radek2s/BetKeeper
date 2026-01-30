export type TabName = "requests" | "pending" | "resolved" | "completed";

export type SortByType = "CREATED" | "UPDATED";
export type SortOrderType = "ASC" | "DSC";

export type SortType = {
  sortBy: SortByType | null;
  order: SortOrderType | null;
};
