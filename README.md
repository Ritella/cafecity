# Cafecity

Cafecity is a data aggregation, modeling, and forecasting tool for estimating high-growth areas for cafe placement. The underlying model calibration and workflow is extensible to any combination of businesses/locations/areas, but in this instance the specific application is on predicting the growth of coffee shops on a neighborhood-basis in the city of Seattle. 

Scraping and geospatial wrangling are handled in R, model fitting and geoJSON generation are handled in Python, and the interface is constructed with JS/HTML/CSS, primarily using Leaflet.js to serve output from Flask. 

Underlying tech: 
1. Python (pandas, shapely, flask, numpy, geopandas, pickle, pyGAM)
2. R (rgdal, dplyr, magrittr, reshape2, raster, Quandl, rgeos, tidyverse, httr, tidyr, geosphere)
3. Javascript (Leaflet, D3, DC, JQuery, Keen, Queue, Crossfilter, Underscore)
4. HTML/CSS (Bootstrap, Keen)

## Data sources

Data for the Seattle implementation are collected from several sources: 

1. The United States Census Bureau, from `https://lehd.ces.census.gov/data/` and `https://www.census.gov/geo/maps-data/data/tiger-geodatabases.html`, for tract shapes, demographic and employment information

2. The Quandl API, from `https://www.quandl.com/tools/api`, for real estate pricing and trends information

3. Seattle Open Data, from `https://data.seattle.gov/`, for zoning, permits, and neighborhood shapes

4. Google Places and Yelp API, from `https://developers.google.com/places/web-service/intro` and `https://www.yelp.com/developers`, for current locations of cafes and their characteristics (data are collated and transformed to raster counts before storage)

## Data process

1. APIs and shapefiles are pulled from sources listed above, combined, and rasterized into a coordinate-based model matrix for analysis

2. Collinear/irrelevant features are eliminated from the model matrix using conditional random forests for feature selection

3. Spatial autocorrelative features are added to the feature space by convolving across a lat/long/cafe-count matrix with sub-matrices of varying sizes, creating n-nearest cell neighbor cafe sums

4. The modified model matrix is used to train a generalized additive model, using pyGAM's GridSearch algorithm to perform cross-validation and hyperparameter smoothing

5. The trained model is pickled to file

6. Residual estimation and prediction is performed by first taking marginal predictions independent of autocorrelative features. After the first prediction instance, autocorrelation features are re-generation using the convolve method in step 3 and repeated until predictions stabilize (10 iterations is more than enough)

7. For forecasting, step 6 is conducted on an underlying forecast of city data. This is conducted via weighted assignment of growth rates based on building permit and real estate data, which takes Puget Sound Planning Authority growth rate estimates and distributes them across the city to plausible growth hotspots. Neighborhoods with stronger weights are transformed more per time period (month), and the converse is true. 


