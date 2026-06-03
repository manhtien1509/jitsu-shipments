export type AssignmentStatus = 'OPEN' | 'COMPLETED';

export interface Assignment {
  id: string;
  label: string;
  status: AssignmentStatus;
  clients: string[];
  shipment_count: number;
}

export type AssignmentCreate = Omit<Assignment, 'id' | 'shipment_count'> & {
  shipment_count?: number;
};

export type AssignmentUpdate = Partial<Omit<Assignment, 'id'>>;