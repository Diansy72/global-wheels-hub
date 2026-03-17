import { createContext, useContext, useState, ReactNode } from "react";

export type VehicleCategory = "Motorcycle" | "Car";
export type VehicleStatus = "Available" | "Booked";

export interface Vehicle {
  id: number;
  name: string;
  category: VehicleCategory;
  image: string;
  pricePerDay: number;
  plateNumber: string;
  fuelConsumption: string;
  selfDrive: boolean;
  maxSpeed: string;
  seatCapacity: number;
  features: string[];
  status: VehicleStatus;
}

export interface BookingRecord {
  id: number;
  vehicleId: number;
  vehicleName: string;
  plateNumber: string;
  category: VehicleCategory;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  customerName: string;
  notes: string;
}

export interface Destination {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
}

export interface TourVehicle {
  id: number;
  type: string;
  price: number;
}

export interface TourPackage {
  id: number;
  name: string;
  description: string;
  image: string;
  pricingType: "per_car" | "per_person";
  category: "Private" | "Group";
  destinations: string[];
  includedCosts: string[];
  notIncludedCosts: string[];
  vehicles: TourVehicle[];
  itinerary: { day: number; activities: { time: string; activity: string; label: "covered" | "personal" }[] }[];
}

export interface Tourist {
  id: number;
  photo: string;
  nationality: string;
  continent: string;
  destinationPackage: string;
}

export interface GoogleReview {
  id: number;
  photo: string;
  name: string;
  country: string;
  rating: number;
  comment: string;
}

export interface PromoNotif {
  id: number;
  title: string;
  description: string;
  expiredDate: string;
  pushNotification: boolean;
  active: boolean;
}

const defaultMotorcycleFeatures = ["2 Helm", "2 Jas Hujan", "Charger", "Smart Key"];
const defaultCarFeatures = ["AC", "Charger", "Smart Key", "Audio System", "Reclining Seat"];

const initialVehicles: Vehicle[] = [
  { id: 1, name: "Honda Beat", category: "Motorcycle", image: "", pricePerDay: 75000, plateNumber: "DK 1234 AA", fuelConsumption: "100 km/L", selfDrive: true, maxSpeed: "90 km/h", seatCapacity: 2, features: ["2 Helm", "2 Jas Hujan", "Charger"], status: "Available" },
  { id: 2, name: "Honda Vario", category: "Motorcycle", image: "", pricePerDay: 85000, plateNumber: "DK 5678 BB", fuelConsumption: "90 km/L", selfDrive: true, maxSpeed: "95 km/h", seatCapacity: 2, features: ["2 Helm", "2 Jas Hujan", "Charger", "Smart Key"], status: "Available" },
  { id: 3, name: "Honda Scoopy", category: "Motorcycle", image: "", pricePerDay: 70000, plateNumber: "DK 9012 CC", fuelConsumption: "110 km/L", selfDrive: true, maxSpeed: "80 km/h", seatCapacity: 2, features: ["2 Helm", "Charger"], status: "Booked" },
  { id: 4, name: "Toyota Avanza", category: "Car", image: "", pricePerDay: 450000, plateNumber: "DK 3456 DD", fuelConsumption: "14 km/L", selfDrive: true, maxSpeed: "170 km/h", seatCapacity: 7, features: ["AC", "Charger", "Audio System", "Reclining Seat"], status: "Available" },
  { id: 5, name: "Honda Brio", category: "Car", image: "", pricePerDay: 350000, plateNumber: "DK 7890 EE", fuelConsumption: "18 km/L", selfDrive: true, maxSpeed: "160 km/h", seatCapacity: 5, features: ["AC", "Charger", "Smart Key", "Audio System"], status: "Available" },
  { id: 6, name: "Honda Beat", category: "Motorcycle", image: "", pricePerDay: 75000, plateNumber: "DK 1111 FF", fuelConsumption: "100 km/L", selfDrive: true, maxSpeed: "90 km/h", seatCapacity: 2, features: ["2 Helm", "2 Jas Hujan"], status: "Available" },
];

const initialBookings: BookingRecord[] = [
  { id: 1, vehicleId: 3, vehicleName: "Honda Scoopy", plateNumber: "DK 9012 CC", category: "Motorcycle", bookingDate: "2026-03-15", bookingTime: "09:00", duration: 3, customerName: "Sarah Johnson", notes: "Pickup at hotel" },
];

const initialDestinations: Destination[] = [
  { id: 1, title: "Komodo Island", description: "Home of the legendary Komodo dragons, pristine beaches and crystal-clear waters.", image: "", location: "Flores, NTT" },
  { id: 2, title: "Raja Ampat", description: "Paradise for divers with the richest marine biodiversity on Earth.", image: "", location: "West Papua" },
  { id: 3, title: "Labuan Bajo", description: "Gateway to Komodo National Park with stunning sunset views.", image: "", location: "Flores, NTT" },
];

const initialTourPackages: TourPackage[] = [
  {
    id: 1, name: "Bali Explorer", description: "3-day adventure exploring the best of Bali", image: "", pricingType: "per_person", category: "Group",
    destinations: ["Ubud", "Kintamani", "Tanah Lot"],
    includedCosts: ["Fuel", "Driver", "Parking", "Entrance tickets"],
    notIncludedCosts: ["Lunch", "Tips", "Personal expenses"],
    vehicles: [{ id: 1, type: "Small Car", price: 500000 }, { id: 2, type: "Minibus", price: 1200000 }],
    itinerary: [{ day: 1, activities: [{ time: "08:00", activity: "Hotel pickup", label: "covered" }, { time: "10:00", activity: "Ubud Monkey Forest", label: "covered" }, { time: "12:30", activity: "Lunch at local restaurant", label: "personal" }] }],
  },
];

const initialTourists: Tourist[] = [
  { id: 1, photo: "", nationality: "Japan 🇯🇵", continent: "Asia", destinationPackage: "Bali Explorer" },
  { id: 2, photo: "", nationality: "Germany 🇩🇪", continent: "Europe", destinationPackage: "Komodo Trip" },
  { id: 3, photo: "", nationality: "USA 🇺🇸", continent: "Americas", destinationPackage: "Raja Ampat Dive" },
];

const initialReviews: GoogleReview[] = [
  { id: 1, photo: "", name: "Sarah Johnson", country: "USA 🇺🇸", rating: 5, comment: "Amazing experience! DriveNusa made our trip unforgettable." },
  { id: 2, photo: "", name: "Hiroshi Tanaka", country: "Japan 🇯🇵", rating: 5, comment: "Excellent service and very professional staff." },
];

const initialPromos: PromoNotif[] = [
  { id: 1, title: "Early Bird Discount", description: "Get 20% off for bookings made 7 days in advance", expiredDate: "2026-06-30", pushNotification: true, active: true },
  { id: 2, title: "Weekend Special", description: "Free helmet upgrade for weekend rentals", expiredDate: "2026-04-30", pushNotification: false, active: true },
];

interface AdminContextType {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  bookings: BookingRecord[];
  setBookings: React.Dispatch<React.SetStateAction<BookingRecord[]>>;
  destinations: Destination[];
  setDestinations: React.Dispatch<React.SetStateAction<Destination[]>>;
  tourPackages: TourPackage[];
  setTourPackages: React.Dispatch<React.SetStateAction<TourPackage[]>>;
  tourists: Tourist[];
  setTourists: React.Dispatch<React.SetStateAction<Tourist[]>>;
  reviews: GoogleReview[];
  setReviews: React.Dispatch<React.SetStateAction<GoogleReview[]>>;
  promos: PromoNotif[];
  setPromos: React.Dispatch<React.SetStateAction<PromoNotif[]>>;
  webClicks: number;
  defaultMotorcycleFeatures: string[];
  defaultCarFeatures: string[];
  getBestVehicles: () => { name: string; category: VehicleCategory; totalBookings: number }[];
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [bookings, setBookings] = useState(initialBookings);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [tourPackages, setTourPackages] = useState(initialTourPackages);
  const [tourists, setTourists] = useState(initialTourists);
  const [reviews, setReviews] = useState(initialReviews);
  const [promos, setPromos] = useState(initialPromos);
  const webClicks = 48291;

  const getBestVehicles = () => {
    const countMap: Record<string, { category: VehicleCategory; count: number }> = {};
    bookings.forEach((b) => {
      if (!countMap[b.vehicleName]) countMap[b.vehicleName] = { category: b.category, count: 0 };
      countMap[b.vehicleName].count++;
    });
    return Object.entries(countMap)
      .map(([name, { category, count }]) => ({ name, category, totalBookings: count }))
      .sort((a, b) => b.totalBookings - a.totalBookings);
  };

  return (
    <AdminContext.Provider value={{
      vehicles, setVehicles, bookings, setBookings,
      destinations, setDestinations, tourPackages, setTourPackages,
      tourists, setTourists, reviews, setReviews,
      promos, setPromos, webClicks, defaultMotorcycleFeatures, defaultCarFeatures,
      getBestVehicles,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
