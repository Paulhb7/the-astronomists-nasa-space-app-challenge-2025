import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('=== EXOPLANET API ROUTE START ===');
    console.log('Request URL:', request.url);
    
    const { searchParams } = new URL(request.url);
    const planetName = searchParams.get('name');
    
    console.log('Planet name from params:', planetName);

    if (!planetName) {
      console.log('No planet name provided');
      return NextResponse.json({ error: 'Planet name is required' }, { status: 400 });
    }

    console.log('Fetching exoplanet data for:', planetName);

    // NASA API key
    const apiKey = '4nwpzwVt7dtEFWbeOOKB1VgkbqDbnuEpAnA86dUS';
    
    // Use the TAP service for Planetary Systems (PS) table
    const query = `select pl_name,pl_letter,hostname,discoverymethod,disc_year,pl_orbper,pl_orbpererr1,pl_orbpererr2,pl_orbsmax,pl_orbsmaxerr1,pl_orbsmaxerr2,pl_rade,pl_radeerr1,pl_radeerr2,pl_masse,pl_masseerr1,pl_masseerr2,pl_eqt,pl_eqterr1,pl_eqterr2,pl_insol,pl_insolerr1,pl_insolerr2,st_teff,st_tefferr1,st_tefferr2,st_rad,st_raderr1,st_raderr2,st_mass,st_masserr1,st_masserr2,sy_dist,sy_disterr1,sy_disterr2,pl_controv_flag,pl_pubdate,rowupdate from ps where pl_name='${planetName}'`;
    const url = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(query)}&format=csv`;

    console.log('NASA API URL:', url);
    console.log('Query:', query);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
        'User-Agent': 'ExoplanetsHunter/1.0',
      },
    });

    console.log('NASA API response status:', response.status);
    console.log('NASA API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not read error response');
      console.error('NASA API error:', errorText);
      return NextResponse.json({ 
        error: `NASA API error: ${response.status} - ${errorText}` 
      }, { status: response.status });
    }

    const csvData = await response.text();
    console.log('NASA API response length:', csvData.length);
    console.log('NASA API response preview:', csvData.substring(0, 500));

    // Parse CSV data
    const lines = csvData.trim().split('\n');
    console.log('Number of lines:', lines.length);
    console.log('First few lines:', lines.slice(0, 3));
    
    if (lines.length < 2) {
      console.log('No data found - response too short');
      return NextResponse.json({ 
        data: [], 
        error: `No exoplanet data found for "${planetName}"` 
      });
    }

    const headers = lines[0].split(',');
    console.log('Headers:', headers);
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};

      for (let j = 0; j < headers.length; j++) {
        let value = values[j] || '';
        value = value.replace(/"/g, '');

        // Convert numeric values
        if (value && value !== '' && !isNaN(Number(value))) {
          try {
            row[headers[j]] = Number(value);
          } catch {
            row[headers[j]] = value;
          }
        } else {
          row[headers[j]] = value;
        }
      }

      data.push(row);
    }

    console.log('Successfully parsed data:', data);
    console.log('=== EXOPLANET API ROUTE SUCCESS ===');
    return NextResponse.json({ data });

  } catch (error) {
    console.error('=== EXOPLANET API ROUTE ERROR ===');
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
