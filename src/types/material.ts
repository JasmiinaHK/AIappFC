export interface Material {
  id?: number;
  subject: string;
  grade: string;
  lessonUnit: string;
  materialType: string;
  language: string;
  userEmail: string;
  generatedContent?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}

// Update MaterialFilters to be more explicit about types
export interface MaterialFilters {
  [key: string]: string | undefined;  // Index signature for any string key
  subject?: string;     // Optional subject filter
  grade?: string;       // Optional grade filter
  lessonUnit?: string;  // Optional lesson unit filter
  materialType?: string;// Optional material type filter
  language?: string;    // Optional language filter
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SortConfig {
  field: keyof Material;
  direction: 'ASC' | 'DESC';
}