from astroquery.ipac.nexsci.nasa_exoplanet_archive import NasaExoplanetArchive

tab = NasaExoplanetArchive.query_criteria(
    table="pscomppars",
    select="pl_name,hostname,disc_year,discoverymethod,pl_orbper,pl_orbsmax,pl_orbeccen,pl_rade,pl_masse,pl_eqt,st_teff,st_mass,st_rad,sy_dist,ra,dec,sy_hmag,sy_hmagerr1,sy_hmagerr2",
    where="pl_name='K2-18 b'"
)
print(tab)  # 1 ligne attendue