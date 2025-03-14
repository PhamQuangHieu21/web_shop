export type Category = {
  category_id: string;
  name: string;
  icon: string;
  modified_date: Date;
  created_date: Date;
};

export type CategoryForm = {
  name: string;
  icon: string;
};
