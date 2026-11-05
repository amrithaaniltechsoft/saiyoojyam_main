export interface DashboardInmate {
  id: number;
  user_id?: number;
  uid: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  building_id?: number;
  building_name?: string;
  room_id?: number;
  room_name?: string;
  room_type_name?: string;
  ac_type?: string;
  check_in_date?: string;
  check_out_date?: string;
  duration_of_stay?: string;
  status?: string;
  monthly_rent?: number;
  caution_deposit?: number;
  admission_fee?: number;
}

export interface DashboardPendingBill {
  month_key: string;
  month_name: string;
  period: string;
  room_label: string;
  rent_amount: string;
  rent_amount_num: number;
  total_payable: string;
  total_payable_num: number;
  due_date: string;
  is_overdue: boolean;
  status: string;
  is_partial: boolean;
  invoice_id: number | null;
  meals_included: boolean;
  wifi_included: boolean;
}

export interface DashboardCurrentBill {
  period: string;
  room_label: string;
  rent_amount: string;
  rent_amount_num: number;
  total_payable: string;
  total_payable_num?: number;
  status: string;
  is_paid: boolean;
  last_paid_date?: string;
  due_date: string;
  meals_included: boolean;
  wifi_included: boolean;
}

export interface DashboardInvoice {
  id: string;
  invoice_id: number;
  period: string;
  date: string;
  amount_num: number;
  amount: string;
  total: string;
  status: string;
  status_code: number;
  print_url: string;
}

export interface DashboardTerm {
  id: number | string;
  title: string;
  small_description?: string;
  desc?: string;
  pdf_file?: string | null;
  pdf_url?: string;
  download_url?: string;
}

export interface DashboardData {
  inmate: DashboardInmate;
  current_bill: DashboardCurrentBill;
  pending_bills?: DashboardPendingBill[];
  pending_count?: number;
  total_pending_amount?: string;
  total_pending_amount_num?: number;
  is_all_paid?: boolean;
  invoices: DashboardInvoice[];
  terms?: DashboardTerm[];
  print_url: string;
}
