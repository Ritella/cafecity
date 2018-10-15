

# API keys ----------------------------------------------------------------

# Get samples from Seattle nhoods shapefile -------------------------------
## Might fail depending on RNG in spsample()

test_shape = readOGR("./data/Neighborhoods/StatePlane/", "Neighborhoods")

myshp_proj = spTransform(test_shape, CRS("+proj=longlat +datum=WGS84"))

centroid = gCentroid(myshp_proj)
centroids = gCentroid(myshp_proj,byid = TRUE) %>% as.data.frame() %>% mutate(name = myshp_proj$S_HOOD)

polys = fortify(myshp_proj) 
# merge(.,data.frame(id = 0:(length(myshp_proj$S_HOOD)-1), neighborhood = myshp_proj$S_HOOD))

n = 1000

samples = spsample(myshp_proj, n, type = "regular", nsig = 2) %>% 
  as.data.frame %>% 
  mutate(id = 1:(n-1))

save(samples,file="./data/shapefile_samples")

# Sampling Yelp -----------------------------------------------------------

res <- POST("https://api.yelp.com/oauth2/token",
            body = list(grant_type = "client_credentials",
                        client_id = client_id,
                        client_secret = client_secret))

yelp_searcher <- function(term,location){
  
  yelp <- "https://api.yelp.com"
  categories <- NULL
  limit <- 50
  radius <- 1000
  url <- modify_url(yelp, path = c("v3", "businesses", "search"),
                    query = list(term = term, latitude = location[1],
                                 longitude = location[2], 
                                 limit = limit,
                                 radius = radius))
  res <- GET(url, add_headers(Authorization = paste("Bearer", client_secret)))
  
  fromJSON(content(res,type="text"))
  
}

cafe_list_yelp <- samples %>% 
  apply(1, function(x) places_searcher("coffee", x[2:1] %>% as.numeric))

brewery_list_yelp <- samples %>% 
  apply(1, function(x) places_searcher("brewery", x[2:1] %>% as.numeric))

bakery_list_yelp <- samples %>% 
  apply(1, function(x) places_searcher("bakery", x[2:1] %>% as.numeric))

artisan_list_yelp <- samples %>% 
  apply(1, function(x) places_searcher("artisan, craft", x[2:1] %>% as.numeric))


artisan_coords <- map(artisan_list_yelp, function(x) { list(place_id = x$place_id, 
                                                            name = x$name, 
                                                            lat = x$geometry$location$lat, 
                                                            long = x$geometry$location$lng, 
                                                            rating = x$rating)}) %>% 
  rbindlist %>%
  dplyr::distinct(place_id, .keep_all = TRUE)




cafe_coords <- map(cafe_list_yelp, function(x) { list(place_id = x$place_id, 
                                                      name = x$name, 
                                                      lat = x$geometry$location$lat, 
                                                      long = x$geometry$location$lng, 
                                                      rating = x$rating, 
                                                      price_level = x$price_level,
                                                      formatted_address = x$formatted_address)}) %>% 
  rbindlist %>%
  dplyr::distinct(place_id, .keep_all = TRUE)
cafe_coords$type = "cafe"


brewery_coords <- map(brewery_list_yelp, function(x) { list(place_id = x$place_id, 
                                                            name = x$name, 
                                                            lat = x$geometry$location$lat, 
                                                            long = x$geometry$location$lng, 
                                                            rating = x$rating, 
                                                            price_level = x$price_level,
                                                            formatted_address = x$formatted_address)}) %>% 
  rbindlist %>%
  dplyr::distinct(place_id, .keep_all = TRUE)
brewery_coords$type = "brewery"


bakery_coords <- map(bakery_list_yelp, function(x) { list(place_id = x$place_id, 
                                                          name = x$name, 
                                                          lat = x$geometry$location$lat, 
                                                          long = x$geometry$location$lng, 
                                                          rating = x$rating, 
                                                          price_level = x$price_level,
                                                          formatted_address = x$formatted_address)}) %>% 
  rbindlist %>%
  dplyr::distinct(place_id, .keep_all = TRUE)
bakery_coords$type = "bakery"


places_coords <- rbind(cafe_coords, brewery_coords, bakery_coords)

write.csv(places_coords, file="./data/places_coords.csv")




# Sampling Zillow data from Quandl ----------------------------------------


## Lookup table for codes and neighborhoods --------------------------------

all = readLines("./data/areas_neighborhood.txt") %>% 
  strsplit(split = "|", fixed= TRUE) %>%
  sapply(as.vector) %>% 
  t() %>% 
  as.data.frame() %>% 
  slice(-1) %>% 
  mutate(V1 = as.character(V1), V2 = as.integer(V2))

all_split = all %$% 
  strsplit(V1, split=",") %>%
  sapply(as.vector) %>% 
  t() %>% 
  as.data.frame() %>% 
  mutate(V1 = as.character(V1), 
         V2 = as.character(V2) %>% gsub(" ", "", ., fixed = TRUE),
         V3 = as.character(V3) %>% gsub(" ", "", ., fixed = TRUE)) %>%
  cbind(all,.) %>%
  setNames(c("area", "code", "hood", "city", "state"))

sea_n = all_split %>% dplyr::filter(city == "Seattle") %>% dplyr::select(hood, code)

codes = read.csv("indicators.csv", stringsAsFactors = FALSE) %$% 
  strsplit(INDICATOR.CODE, split = "|", fixed= TRUE) %>%
  sapply(as.vector) %>% 
  t() %>% 
  as.data.frame() %>%
  setNames(c("type", "code"))

sub_list = sapply(c(codes %$% as.character(code)),function(x) NULL)

all_list = all_split %>% 
  filter(city == "Seattle") %>% 
  pull(hood) %>% 
  sapply(.,function(x) NULL) %>%
  lapply(function(x) x$re = sub_list)

sea_n = all_split %>% 
  dplyr::filter(city == "Seattle") %>% 
  dplyr::select(hood, code)

list_n = as.list(sea_n %>% pull(code)) 
names(list_n) = sea_n$hood

# should revise this with mapply or map… hacky

for(n in 1:dim(sea_n)[1]) {
  all_list[[sea_n$hood[n]]] = sea_n[n,] %$% 
    paste0("ZILLOW/N",code,"_", codes$code %>% as.character) %>%
    sapply(function(x) tryCatch(Quandl(x, type="raw"), error = function(e) NA)) %>% 
    setNames(codes$code %>% as.character) %>% 
    merge(all_list[[sea_n$hood[n]]], .)
}


save(all_list, file="./data/real_estate_list")

## Generate point summaries of time-series

re_summary = function(z_df) {
  fit = lm(Value ~ Date, data= z_df)
  slope = fit$coefficients[2]
  pred = predict(fit, newdata = list(Date = as.Date("2019-01-01")))
  last = head(z_df,1)[2]
  list(slope = slope, pred = pred, last = last)
}

summary_list = map(all_list, function(x) map(x, function(y) tryCatch(re_summary(y), error = function(e) NA))) %>% 
  melt() %>%
  dplyr::select(L2, L1, L3, value)

save(summary_list, file="./data/summary_list")
write.csv(summary_list, file="./data/summary_list.csv")

transfer_realestate <- summary_list %>%
  dcast(L1 ~ L2 + L3) 

write.csv(transfer_realestate_census, "./data/realestate_all.csv")



# Zip real estate ---------------------------------------------------------

zips = 98100:98200

codes = read.csv("./data/indicators.csv", stringsAsFactors = FALSE) %$% 
  strsplit(INDICATOR.CODE, split = "|", fixed= TRUE) %>%
  sapply(as.vector) %>% 
  t() %>% 
  as.data.frame() %>%
  setNames(c("type", "code"))

sub_list = sapply(c(codes %$% as.character(code)),function(x) NULL)

all_list = zips %>%
  sapply(.,function(x) NULL) %>%
  lapply(function(x) x$re = sub_list)

names(all_list) <- zips


for(n in 1:length(zips)) {
  all_list[[zips[n] %>% as.character()]] = zips[n] %>%
    paste0("ZILLOW/Z", . ,"_", codes$code %>% as.character) %>%
    sapply(function(x) tryCatch(Quandl(x, type="raw"), error = function(e) NA)) %>% 
    setNames(codes$code %>% as.character) %>% 
    merge(all_list[[zips[n] %>% as.character()]], .)
  print(zips[n])
}


all_list = map(all_list, function(x) map(x, function(y) tryCatch(re_summary(y), error = function(e) NA))) %>% 
  melt() %>%
  dplyr::select(L2, L1, L3, value)

save(summary_list, file="./data/summary_list")
write.csv(summary_list, file="./data/summary_list.csv")

transfer_realestate <- all_list %>%
  reshape2::dcast(L1 ~ L2 + L3) 

write.csv(transfer_realestate, "./data/realestate_all.csv")




