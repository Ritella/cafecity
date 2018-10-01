# -*- coding: utf-8 -*-

import pandas as pd
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template
import json

import geopandas as gpd


data_path = './input/'
n_samples = 30000

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def get_data():
    df = pd.read_csv(data_path + 'filt_mat.csv')

    df_clean = df[['daytime_density', 'daytime_pop', 'medinc', 'hs', 'phd', 'oldpop', 'youngpop', 'brewery', 'zone']]

    return df_clean.to_json()

@app.route("/zips")
def get_zips():

    states = gpd.read_file('./input/zips.geojson')
    return states.to_json()

@app.route("/census")
def get_census():

    states = gpd.read_file('./input/census.geojson')
    return states.to_json()

@app.route("/neighborhood")
def get_hood():

    states = gpd.read_file('./input/neighborhoods.geojson')
    return states.to_json()

@app.route("/zones")
def get_zones():

    states = gpd.read_file('./input/zones.geojson')
    return states.to_json()

@app.route("/grid")
def get_grid():

    states = gpd.read_file('./input/grid.geojson')
    return states.to_json()


@app.route("/pred")
def get_grid():

    census = gpd.read_file('./input/grid.geojson')
    
    all_df = pd.read_csv('./input/raw_combined.csv')
    all_df['GEOID'] = all_df['cen_code']
    
    gdf = pd.merge(census, all_df, how='left', left_index=True, right_index=True)
    
    return census.to_json()

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)