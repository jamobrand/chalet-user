import { API_URL } from "@/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Room {
  id: number;
  adults: number;
  children: number;
}

interface SearchParams {
  checkIn?: Date;
  checkOut?: Date;
  rooms?: Room[];
}

export const useSearchChalets = (params?: SearchParams) => {
  return useQuery({
    queryKey: ['search-chalets', params],
    queryFn: async () => {
      // If no dates provided, return all chalets
      if (!params?.checkIn || !params?.checkOut || !params?.rooms) {
        const { data } = await axios.get(`${API_URL}/v1/chalets/all-chalets`);
        return data;
      }
      
      // Use the rooms data directly from params instead of parsing from URL
      const { data } = await axios.post(`${API_URL}/v1/chalets/search`, {
        checkIn: params.checkIn.toISOString(),
        checkOut: params.checkOut.toISOString(),
        rooms: params.rooms.map(room => ({
          adults: room.adults,
          children: room.children
        }))
      });
      
      // Return just the chalets array
      return data.chalets;
    },
    select: (data) => data, // Optional: You can transform the data here if needed
    enabled: Boolean(params?.checkIn && params?.checkOut && params?.rooms),
  });
};