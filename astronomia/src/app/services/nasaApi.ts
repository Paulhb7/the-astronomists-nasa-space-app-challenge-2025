export interface ExoplanetData {
  pl_name: string;
  pl_letter: string;
  hostname: string;
  discoverymethod: string;
  disc_year: number;
  pl_orbper: number; // Orbital period in days
  pl_orbpererr1: number;
  pl_orbpererr2: number;
  pl_orbsmax: number; // Semi-major axis in AU
  pl_orbsmaxerr1: number;
  pl_orbsmaxerr2: number;
  pl_rade: number; // Planetary radius in Earth radii
  pl_radeerr1: number;
  pl_radeerr2: number;
  pl_masse: number; // Planetary mass in Earth masses
  pl_masseerr1: number;
  pl_masseerr2: number;
  pl_eqt: number; // Equilibrium temperature in K
  pl_eqterr1: number;
  pl_eqterr2: number;
  pl_insol: number; // Insolation flux
  pl_insolerr1: number;
  pl_insolerr2: number;
  st_teff: number; // Stellar effective temperature
  st_tefferr1: number;
  st_tefferr2: number;
  st_rad: number; // Stellar radius
  st_raderr1: number;
  st_raderr2: number;
  st_mass: number; // Stellar mass
  st_masserr1: number;
  st_masserr2: number;
  sy_dist: number; // Distance in parsecs
  sy_disterr1: number;
  sy_disterr2: number;
  pl_controv_flag: number; // Controversy flag
  pl_pubdate: string;
  rowupdate: string;
}

export interface NasaApiResponse {
  data: ExoplanetData[];
  error?: string;
}

export async function fetchExoplanetData(planetName: string): Promise<NasaApiResponse> {
  try {
    console.log('Starting fetch for planet:', planetName);
    
    // Use our Next.js API route to avoid CORS issues
    const url = `/api/exoplanet?name=${encodeURIComponent(planetName)}`;

    console.log('Fetching from Next.js API route:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error response:', errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API response:', result);

    if (result.error) {
      return { data: [], error: result.error };
    }

    return { data: result.data || [] };
  } catch (error) {
    console.error('Error fetching exoplanet data:', error);
    console.error('Error type:', typeof error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return { 
      data: [], 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Helper function to format values with errors
export function formatValueWithError(value: number, err1: number, err2: number, unit: string = ''): string {
  if (!value || isNaN(value)) return 'N/A';
  
  const error = err1 || err2 || 0;
  if (error === 0) {
    return `${value.toFixed(2)}${unit}`;
  }
  
  return `${value.toFixed(2)}±${error.toFixed(2)}${unit}`;
}

// Helper function to format temperature
export function formatTemperature(kelvin: number): string {
  if (!kelvin || isNaN(kelvin)) return 'N/A';
  const celsius = kelvin - 273.15;
  return `${celsius.toFixed(1)}°C (${kelvin.toFixed(1)}K)`;
}

// Helper function to format distance
export function formatDistance(parsecs: number): string {
  if (!parsecs || isNaN(parsecs)) return 'N/A';
  const lightYears = parsecs * 3.26156;
  return `${parsecs.toFixed(2)} pc (${lightYears.toFixed(2)} ly)`;
}
