export type RequestStatus = 'Pendiente' | 'Progreso' | 'Resuelta';
export type RequestPriority = 'Alta' | 'Media' | 'Baja';
export type RequestCategory = 'Petición' | 'Queja' | 'Sugerencia' | 'Reclamo' | 'Denuncia';

export interface CitizenRequest {
  id: string;
  date: string;
  originalText: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  citizenData?: {
    cedula: string;
    nombre: string;
    telefono: string;
    email: string;
    hasEvidence: boolean;
  };
  aiAnalysis: {
    intent: string;
    urgencyScore: number;
    justification: string;
  };
  comments?: {
    text: string;
    date: string;
  }[];
}
