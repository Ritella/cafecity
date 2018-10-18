# Cafecity

Cafecity is a data aggregation, modeling, and forecasting tool for estimating high-growth areas for cafe placement. The underlying model calibration and workflow is potentially extensible to any combination of businesses/locations/areas, but in this instance the specific application is on predicting the growth of coffee shops on a neighborhood-basis in the city of Seattle. 

## Data sources

Data for the Seattle implementation are collected from several sources: 

1. The United States Census Bureau, from `https://lehd.ces.census.gov/data/` and `https://www.census.gov/geo/maps-data/data/tiger-geodatabases.html`, for tract shapes, demographic and employment information

2. The Quandl API, from `https://www.quandl.com/tools/api`, for real estate pricing and trends information

3. Seattle Open Data, from `https://data.seattle.gov/`, for zoning, permits, and neighborhood shapes

4. Google Places and Yelp API, from `https://developers.google.com/places/web-service/intro` and `https://www.yelp.com/developers`, for current locations of cafes and their characteristics (data are collated and transformed to raster counts before storage)

## 


