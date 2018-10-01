# -*- coding: utf-8 -*-

import pandas as pd
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template
from flask import request

import json

import geopandas as gpd
import pickle

from shapely.ops import cascaded_union

data_path = './input/'
n_samples = 30000

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'], )
def index():
    zone_class = ['Neighborhoods', 'Zips', 'Census', 'Zones', 'Grid', 'Neighborhoods_Predict']
    type_class = ['daytime_density', 'daytime_pop', 'medinc', 
    'hs', 'phd', 'oldpop', 'youngpop', 'brewery_sum', 'cafe_sum',
    'pred_p', 'pred_6mo', 'pred_1yr', 'pred_2yr', 'change_p', 
    'change_6mo', 'change_1yr', 'change_2yr', 'cafe']


    all_df = pd.read_csv('./input/neighborhood_index_pred.csv')
    table = all_df[['hood', 'phd', 'medinc']]

    return render_template("index.html", zone_class  = zone_class, type_class  = type_class)

@app.route("/dir")
def get_dir():

    all_df = pd.read_csv('./input/zip_index.csv')
    return all_df

@app.route("/data")
def get_data():
    df = pd.read_csv(data_path + 'filt_mat.csv')

    df_clean = df[['daytime_density', 'daytime_pop', 'medinc', 'hs', 'phd', 'oldpop', 'youngpop', 'brewery_sum', 'cafe_sum']]

    return df_clean.to_json()

@app.route("/Zips")
def get_zips():

    epsg_utm = 26910 #utm zone 10n
    census = gpd.read_file('./input/zips.geojson')
    census['zip'] = census['ZIP'].astype(float)
    all_df = pd.read_csv('./input/zip_index.csv')
    all_df['zip'] = all_df['zip'].astype(float)
    gdf = census.merge(all_df, how='inner', on='zip')
    return gdf.to_json()

@app.route("/Census")
def get_census():

    epsg_utm = 26910 #utm zone 10n
    census = gpd.read_file('./input/census.geojson')
    all_df = pd.read_csv('./input/cencode_index.csv')
    census['cen_code'] = census['GEOID'].astype(int)
    gdf = census.merge(all_df, how='right', on='cen_code')
    wa = gpd.read_file('./input/neighborhoods.geojson')
    polygons = wa['geometry'].values
    wash = gpd.GeoSeries(cascaded_union(polygons)).iloc[0]
    gdf['geometry'] = gdf.intersection(wash)
    return gdf.to_json()

@app.route("/Neighborhoods")
def get_hood():

    epsg_utm = 26910 #utm zone 10n
    census = gpd.read_file('./input/neighborhoods.geojson')
    all_df = pd.read_csv('./input/neighborhood_index.csv')
    census['hood'] = census['S_HOOD'].astype(str)
    gdf = census.merge(all_df, how='left', on='hood')
    return gdf.to_json()

@app.route("/Zones")
def get_zones():

    epsg_utm = 26910 #utm zone 10n
    census = gpd.read_file('./input/zones.geojson')
    census['zone'] = census['ZONELUT_DE'].astype(str)
    all_df = pd.read_csv('./input/zone_index.csv')
    all_df['zone'] = all_df['zone'].astype(str)
    gdf = census.merge(all_df, how='inner', on='zone')
    return gdf.to_json()

@app.route("/Grid")
def get_grid():

    epsg_utm = 26910 #utm zone 10n
    census = gpd.read_file('./input/grid.geojson')
    all_df = pd.read_csv('./input/raw_combined.csv')
    gdf = census.merge(all_df, left_on='id', right_on='code', how='left')
    return gdf.to_json()

@app.route("/Neighborhoods_Predict")
def get_pred():
    epsg_utm = 26910 #utm zone 10n
    census = gpd.read_file('./input/neighborhoods.geojson')
    all_df = pd.read_csv('./input/neighborhood_index_pred.csv')
    census['hood'] = census['S_HOOD'].astype(str)
    gdf = census.merge(all_df, how='left', on='hood')
    return gdf.to_json()


@app.route("/mini_win", methods = ['GET', 'POST'])
def mini_win():
    text = str(request.data)
    print(text[9:26])
    print(text[33:52])
    select = request.form.get('zone_class')
    return(str(select)) # just to see what select is

@app.route("/pred", methods=['GET', 'POST'])
def get_feature():

    return(0)

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)






