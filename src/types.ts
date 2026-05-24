export interface RSVPResponse {
  id: string;
  name: string;
  phone: string;
  numberOfGuests: number;
  attending: boolean;
  notes?: string;
  location?: string;
  submittedAt: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: string;
  description: string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export interface DressCodeItem {
  id: string;
  name: string;
  description: string;
  colorHex: string;
  bgClass: string;
  textClass: string;
}
