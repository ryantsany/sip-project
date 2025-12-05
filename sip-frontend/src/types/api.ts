export type ApiMessages = string | string[];

export interface ApiMeta {
  code: number;
  messages: ApiMessages;
  validations: Record<string, string[]> | null;
  response_date: string;
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T;
}

export interface ProfileData {
  nama: string;
  nomor_induk: string;
  kelas: string | null;
}
export type ProfileResponse = ApiResponse<ProfileData>;

export interface BookSummary {
  judul: string;
  cover_url: string | null;
  penulis?: string;
  penerbit: string;
  tahun: string;
  isbn: string;
  deskripsi: string | null;
  kategori: string;
  jumlah: number | string;
  stok: number | string;
  status: 'available' | 'Dipinjam' | string;
  slug: string;
}

export interface CreatedBook {
  id: number;
  judul: string;
  cover_url: string | null;
  pengarang: string;
  penerbit: string;
  tahun: number | string;
  isbn: string;
  deskripsi: string | null;
  kategori: string | null;
  jumlah: number;
  stok: number;
  status: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export type BooksResponse = ApiResponse<Paginated<BookSummary>>;
export type LatestBooksResponse = ApiResponse<BookSummary[]>;
export type BookSummaryResponse = ApiResponse<BookSummary>;
export type AddBookResponse = ApiResponse<{ book: CreatedBook }>;

export interface BorrowRecord {
  id: string;
  book_id: number;
  book_title: string;
  borrow_date: string;
  due_date: string;
  return_date?: string | null;
  created_at: string;
  updated_at: string;
  status: 'Pending' | 'Dipinjam' | 'Selesai' | string;
  denda?: number | null;
  notes?: string | null;
}
export type BorrowListResponse = ApiResponse<BorrowRecord[]>;
export type BorrowCreateResponse = ApiResponse<Pick<BorrowRecord, 'id' | 'book_id' | 'borrow_date' | 'due_date' | 'status'>>;

export interface UserListItem {
  nama: string;
  nomor_induk: string;
  kelas: string | null;
  role: string;
  peminjaman_aktif: number;
}
export type UsersResponse = ApiResponse<Paginated<UserListItem>>;

export interface NotificationItem {
  id: number | string;
  tipe: string;
  pesan: string;
  is_read: 0 | 1 | boolean;
  created_at: string;
}
export type NotificationsResponse = ApiResponse<NotificationItem[]>;

export interface LoginData {
  redirect_url: string;
  token: string;
}
export type LoginResponse = ApiResponse<LoginData>;

export interface CreatedUser {
  id: number;
  nama: string;
  nomor_induk: string;
  role: 'siswa' | 'guru' | 'admin' | 'petugas';
  kelas: string | null;
  created_at: string;
  updated_at: string;
}
export type AddUserResponse = ApiResponse<{ user: CreatedUser }>;


export interface AdminDashBorrowRecord {
  peminjam: string;
  book_title: string;
  borrow_date: string;
  due_date: string;
  return_date?: string | null;
  status: 'Pending' | 'Dipinjam' | 'Selesai' | string;
  denda?: number | null;
  notes?: string | null;
}

export interface AdminDashboardData {
  total_books: number;
  total_borrowings: number;
  total_pending: number;
  total_active: number;
  total_overdue: number;
  total_returned: number;
  books_added_this_month: number;
  books_borrowed_this_month: number;
  books_overdue_this_month: number;
  pending_borrowings: AdminDashBorrowRecord[];
  late_borrowings: AdminDashBorrowRecord[];
}

export type AdminDashboardResponse = ApiResponse<AdminDashboardData>;