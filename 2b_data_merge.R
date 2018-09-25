
# Breakpoint --------------------------------------------------------------

load(file="intermediate_codes")

# Transfer daytime density ------------------------------------------------

d = read.csv("./data/daytime_density.csv")

test = d %>% 
  dplyr::select(GEOID10, daytime_pop, daytime_density, travel_to, DP0010001) %>% 
  dplyr::rename(cen_code = GEOID10) %>% 
  merge(.,test,by="cen_code")


# Transfer RE vecs --------------------------------------------------------

d = read.csv(file="./data/realestate_all.csv")

test %<>% merge(d %>% dplyr::rename(zip = L1),by="zip", all=T)


# Transfer household income -----------------------------------------------
d = read.csv("./data/attainment_income_2016/ACS_16_5YR_S1903_with_ann.csv", stringsAsFactors = F) %>%
  dplyr::select(HC02_EST_VC02, HC02_EST_VC22, GEO.id2) %>%
  lapply(function(x) gsub("(X)|\\*\\*|-", NA, x)) %>% 
  data.frame %>% 
  dplyr::rename(medinc = HC02_EST_VC02, faminc = HC02_EST_VC22, cen_code = GEO.id2) %>% 
  mutate(cen_code = as.numeric(as.character(cen_code))) %>%
  mutate_at(vars(-cen_code),funs(as.numeric(as.character(.))))
test %<>% left_join(d)

# Transfer ed attainment --------------------------------------------------


d = read.csv("./data/attainment_income_2016/ACS_16_5YR_S1501_with_ann.csv", stringsAsFactors = F) %>%
  dplyr::select(HC02_EST_VC03, HC02_EST_VC06, HC02_EST_VC08,HC02_EST_VC15, HC01_EST_VC08, HC01_EST_VC02, GEO.id2) %>%
  dplyr::rename(b_hs = HC02_EST_VC03, hs = HC02_EST_VC06, ba = HC02_EST_VC08, phd = HC02_EST_VC15, oldpop = HC01_EST_VC08, youngpop = HC01_EST_VC02) %>%
  lapply(function(x) gsub("(X)|\\*\\*|-", NA, x)) %>%
  data.frame %>%
  dplyr::rename(cen_code = GEO.id2) %>%
  mutate(cen_code = as.numeric(as.character(cen_code))) %>%
  mutate_at(vars(-cen_code),funs(as.numeric(as.character(.))))
test %<>% left_join(d)

# Transfer rent vacancy ---------------------------------------------------



# Transfer total population -----------------------------------------------



# Get distance matrix and calculate neighbor rasters ----------------------

distmat = pointDistance(centroids[,1:2],lonlat=F)

base_distance = .0028
n_dim = 4732


distance_lookup = list(
  sapply(1:n_dim, function(x) which(distmat[x,1:x-1] <= base_distance)),
  sapply(1:n_dim, function(x) which(distmat[x,1:x-1] <= base_distance*2)),
  sapply(1:n_dim, function(x) which(distmat[x,1:x-1] <= base_distance*3)),
  sapply(1:n_dim, function(x) which(distmat[x,1:x-1] <= base_distance*4))
)

test$dist1 = test$code %>% 
  sapply(function(x) test$cafe[distance_lookup[[1]][x] %>% unlist()] %>% sum(na.rm=T))
test$dist2 = test$code %>% 
  sapply(function(x) test$cafe[distance_lookup[[2]][x] %>% unlist()] %>% sum(na.rm=T))
test$dist3 = test$code %>% 
  sapply(function(x) test$cafe[distance_lookup[[3]][x] %>% unlist()] %>% sum(na.rm=T))
test$dist4 = test$code %>% 
  sapply(function(x) test$cafe[distance_lookup[[4]][x] %>% unlist()] %>% sum(na.rm=T))


# Drop all cells not on land ----------------------------------------------

test %<>% drop_na(zone)

write.csv(test, "./data/raw_combined.csv")


# Modeling ----------------------------------------------------------------

mat = test %>% dplyr::select(-cen_code, -zip, -zone, -code, -hood, -x, -y, -bakery)
naind = mat %>% apply(2,function(x) is.na(x) %>% which() %>% length)

filtmat = mat[,(naind < 80)] %>% dplyr::select(-contains("MOE"))

filtmat %<>% mice::mice(1) %>% mice::complete()

filtmat$zone = as.factor(test$zone)
filtmat$hood = as.factor(test$hood)

write.csv(filtmat, "./data/filt_mat.csv")


mod_mat = model.matrix(formula(~ .), filtmat)

write.csv(mod_mat[,-7], "./data/test.csv")

write.csv(mod_mat[,7], "./data/cafes.csv")
