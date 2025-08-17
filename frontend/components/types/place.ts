export type Place = {
  id: number ;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distanceM?: number;
  openTimeText?: string;
  address?: string;
  desc?: string;
  imageUrl?: string;
};
