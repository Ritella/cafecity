library(googleway)
library(rgdal)
library(dplyr)
library(ggplot2)
library(magrittr)
library(reshape)
library(raster)
library(Quandl)
library(rgeos)
library(ggmap)
library(RColorBrewer)
library(tidyverse)
library(httr)
library(tidyr)
library(gridExtra)
library(leaflet)
library(geosphere)
library(reshape2)

# Load yelp ---------------------------------------------------------------

places_coords <- read.csv("./data/places_coords.csv")

# Load Quandl -------------------------------------------------------------

transfer_realestate <- read.csv("./data/realestate_all.csv")

# Load sample grid from scrape 

load(file="./data/shapefile_samples")

# Blank out data frame

test = NA


# Load shapefile for sampling ---------------------------------------------

test_shape = readOGR("./Neighborhoods/StatePlane/", "Neighborhoods")

myshp_proj = spTransform(test_shape, CRS("+proj=longlat +datum=WGS84"))

# Grid assignment ---------------------------------------------------------

# Create the sample grid 
bb = bbox(myshp_proj)
sq_d = (47.73416 - 47.49551) / 100
cs = c(sq_d, sq_d) 
cc = bb[, 1] + (cs/2) 
cd = ceiling(diff(t(bb))/cs)  # number of cells per direction
grd = GridTopology(cellcentre.offset=cc, cellsize=cs, cells.dim=cd)
grd

sp_grd = SpatialGridDataFrame(grd,
                              data=data.frame(id=1:prod(cd)),
                              proj4string=CRS(proj4string(myshp_proj)))

centroid = gCentroid(sp_grd %>% as(., "SpatialPolygonsDataFrame"))
centroids = gCentroid(sp_grd %>% as(., "SpatialPolygonsDataFrame"),byid = TRUE) %>% as.data.frame()
centroids$code = 1:dim(centroids)[1]

check_grid = function(coord,master_shape){
  coord %>% 
    SpatialPoints(.,proj4string = CRS(proj4string(master_shape))) %over% 
    master_shape %>%
    as.numeric
}

polys = fortify(sp_grd %>% as(., "SpatialPolygonsDataFrame")) 


# Places assignment -------------------------------------------------------

places_coords$code = places_coords %>% 
  apply(1, function(x) check_grid(data.frame(long = as.numeric(x[5]), lat = as.numeric(x[4])), sp_grd))

test = places_coords %>%
  filter() %>%
  group_by(code,type) %>%
  summarise(count = n()) %>%
  dcast(code ~ type) %>%
  merge(.,centroids, by="code", all.y=T) %>%
  replace(is.na(.),0)


# Zip assignment ----------------------------------------------------------

check_zip = function(coord,master_shape){
  coord %>% 
    SpatialPoints(.,proj4string = CRS(proj4string(master_shape))) %over% 
    master_shape %>%
    pull(ZIP) %>%
    as.character()
}

test_shape = readOGR("./data/Zipcodes_for_King_County_and_Surrounding_Area_Shorelines__zipcode_shore_area/", "Zipcodes_for_King_County_and_Surrounding_Area_Shorelines__zipcode_shore_area")

myshp_proj = spTransform(test_shape, CRS("+proj=longlat +datum=WGS84"))

test$zip = test %>% 
  apply(1, function(x) check_zip(data.frame(long = as.numeric(x[5]), lat = as.numeric(x[6])), myshp_proj))


# Census assignment -------------------------------------------------------

check_census = function(coord,master_shape){
  coord %>% 
    SpatialPoints(.,proj4string = CRS(proj4string(master_shape))) %over% 
    master_shape %>% 
    pull(GEOID) %>% 
    as.character()
}

test_shape = readOGR("./data/cb_2017_53_tract_500k/", "cb_2017_53_tract_500k")

myshp_proj = spTransform(test_shape, CRS("+proj=longlat +datum=WGS84"))

test$cen_code = test %>% 
  apply(1, function(x) check_census(data.frame(long = as.numeric(x[5]), lat = as.numeric(x[6])), myshp_proj))


# Zone assignment ---------------------------------------------------------

check_zone = function(coord,master_shape){
  coord %>% 
    SpatialPoints(.,proj4string = CRS(proj4string(master_shape))) %over% 
    master_shape %>% 
    pull(ZONELUT_DE) %>%
    as.character()
}

test_shape = readOGR("./data/City_of_Seattle_Zoning/StatePlane/", "City_of_Seattle_Zoning")

myshp_proj = spTransform(test_shape, CRS("+proj=longlat +datum=WGS84"))

test$zone = test %>% 
  apply(1, function(x) check_zone(data.frame(long = as.numeric(x[5]), lat = as.numeric(x[6])), myshp_proj))


# Neighborhood assignment ---------------------------------------------------------

check_hood = function(coord,master_shape){
  coord %>% 
    SpatialPoints(.,proj4string = CRS(proj4string(master_shape))) %over% 
    master_shape %>% 
    pull(S_HOOD) %>%
    as.character()
}

test_shape = readOGR("./data/Neighborhoods/StatePlane/", "Neighborhoods")

myshp_proj = spTransform(test_shape, CRS("+proj=longlat +datum=WGS84"))

test$hood = test %>% 
  apply(1, function(x) check_hood(data.frame(long = as.numeric(x[5]), lat = as.numeric(x[6])), myshp_proj))



save(test, file="intermediate_codes")


