import { ParkingSpot } from "../types/parkingSpot";

export const fetchParkingSpots = async (): Promise<ParkingSpot[]> => {
  const query = {
    query: `
    query GetAllCarParks {
      carParks {
        carParkId
        name
        lat
        lon
        maxCapacity
        spacesAvailable
      }
    }
  `,
  };
  try {
    const response = await fetch("https://api.oulunliikenne.fi/proxy/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      console.log("Response status:", response.status);
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data.carParks.map((spot: ParkingSpot) => ({
      name: spot.name,
      lat: spot.lat,
      lon: spot.lon,
      spacesAvailable: spot.spacesAvailable,
      maxCapacity: spot.maxCapacity,
      carParkId: spot.carParkId,
    }));
  } catch (error) {
    console.error("Error fetching parking spots:", error);
    return [];
  }
};

export const fetchParkingSpotById = async (
  id: number,
): Promise<ParkingSpot | null> => {
  const query = {
    query: `
    {
      carPark(id: "${id}") {
        maxCapacity
        spacesAvailable
        carParkId
        name
        lat
        lon
      }
    }
  `,
  };

  try {
    console.log("Fetching parking spot with ID:", id);

    const response = await fetch("https://api.oulunliikenne.fi/proxy/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(query),
    });

    // Lue response vain KERRAN
    const text = await response.text();
    console.log("Response status:", response.status);
    console.log("Response body:", text);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${text}`);
    }

    const result = JSON.parse(text);

    return result.data.carPark
      ? {
          spacesAvailable: result.data.carPark.spacesAvailable,
          maxCapacity: result.data.carPark.maxCapacity,
          carParkId: result.data.carPark.carParkId,
          name: result.data.carPark.name,
          lat: result.data.carPark.lat,
          lon: result.data.carPark.lon,
        }
      : null;

  } catch (error) {
    console.error("Error fetching parking spot by ID:", error);
    return null;
  }
};


export const oulunPysakointiApi = {
  fetchParkingSpots: fetchParkingSpots,
  fetchParkingSpotById: fetchParkingSpotById,
};
