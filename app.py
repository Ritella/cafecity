# -*- coding: utf-8 -*-

import pandas as pd
from shapely.geometry import Point, shape
import numpy as np

from flask import Flask, session
from flask import render_template
from flask import request
from flask import jsonify

from scipy import signal

import json

import geopandas as gpd
import pickle

from shapely.ops import cascaded_union

import pickle

import operator

#data_path = './input/'
n_samples = 30000


app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'], )
def index():
    zone_class = ['Neighborhoods', 'Zips', 'Census', 'Zones', 'Grid']
    type_class = ['cafe', 'cafe_model', 'change', 'daytime_density', 'daytime_pop', 'medinc', 
    'hs', 'phd', 'oldpop', 'youngpop', 'brewery_sum', 'cafe_sum']

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

@app.route("/Neighborhoods", methods=['GET', 'POST'])
def get_hood():

    print(request.form)

    all_df = pd.read_csv('./input/raw_combined.csv')
    fil = all_df

    fil['weights_p'] = fil['permits']/np.max(fil['permits'])

    filename = 'finalized_model.sav'

    with open(filename, 'rb') as file:  
        pickle_model = pickle.load(file)

    lat = fil['x']
    lng = fil['y']

    grid = np.empty([100,83]) * 0 

    kernel_1 = np.array([[1,1,1],
                         [1,0,1],
                         [1,1,1]]) 

    kernel_2 = np.array([[1,1,1,1,1],
                       [1,1,1,1,1],
                       [1,1,0,1,1],
                       [1,1,1,1,1],
                       [1,1,1,1,1]]) 

    kernel_3 = np.array([[1,1,1,1,1,1,1],
                       [1,1,1,1,1,1,1],
                       [1,1,1,1,1,1,1],
                       [1,1,1,0,1,1,1],
                       [1,1,1,1,1,1,1],
                       [1,1,1,1,1,1,1],
                       [1,1,1,1,1,1,1]]) 

    i = ((lng - lng.min()) / 0.0023865).astype(int)
    j = ((lat - lat.min()) / 0.0023865).astype(int)

    catenc = pd.factorize(fil['zone'])

    fil['zone'] = catenc[0]

    fil['dist1'] = 0 
    fil['dist2'] = 0
    fil['dist3'] = 0

    if ('time' in request.form):
        print('Predicting...')
        time_up = float(request.form['time'])/12

        pop_up = float(request.form['pop']) * time_up * .01
        inc_up = float(request.form['inc']) * time_up * .01
        ed_up = float(request.form['ed']) * time_up * .01

        fil['daytime_density'] = fil['daytime_density'] * (1 + pop_up*fil['weights_p'])
        fil['daytime_pop'] = fil['daytime_pop'] * (1 + pop_up*fil['weights_p'])
        fil['medinc'] = fil['medinc'] * (1 + inc_up)
        fil['hs'] = fil['hs'] * (1 + ed_up)
        fil['phd'] = fil['phd'] * (1 + ed_up)
        fil['oldpop'] = fil['oldpop'] * (1 + pop_up*fil['weights_p'])
        fil['youngpop'] = fil['youngpop'] * (1 + pop_up*fil['weights_p'])
        fil['brewery'] = fil['brewery']
        fil['medincXphd'] = fil['medinc'] * fil['phd'] 
        fil['medincXhs'] = fil['medinc'] * fil['hs']
        fil['medincXyoungpop'] = fil['medinc'] * fil['youngpop']
        fil['medincXoldpop'] = fil['medinc'] * fil['oldpop']

        X = fil[['daytime_density', 'daytime_pop', 
         'medinc','hs', 
         'phd', 'oldpop', 
         'youngpop', 'brewery',
         'zone', 'dist1', 
         'dist2', 'dist3',
        'medincXphd', 'medincXhs', 
        'medincXyoungpop', 'medincXoldpop']].values
        
        print(np.argwhere(np.isnan(X)))

        fil['pred'] = pickle_model.predict(X)

        for x in range(6):
            grid[i,j] = fil['pred']
            print(np.argwhere(np.isnan(grid)))
            grid = np.nan_to_num(grid)
            print(np.argwhere(np.isnan(grid)))

            grid1 = signal.convolve2d(grid, kernel_1, boundary='wrap', mode='same')
            grid2 = signal.convolve2d(grid, kernel_2, boundary='wrap', mode='same')
            grid3 = signal.convolve2d(grid, kernel_3, boundary='wrap', mode='same')

            print(np.argwhere(np.isnan(grid1)))
            print(np.argwhere(np.isnan(grid2)))
            print(np.argwhere(np.isnan(grid3)))

            dist1 = grid1[i,j]
            dist2 = grid2[i,j]
            dist3 = grid3[i,j]

            dist1[dist1 >= 15] = 15
            dist2[dist2 >= 35] = 35
            dist3[dist3 >= 50] = 50

            fil['dist1'] = dist1
            fil['dist2'] = dist2
            fil['dist3'] = dist3

            X = fil[['daytime_density', 'daytime_pop', 
             'medinc','hs', 
             'phd', 'oldpop', 
             'youngpop', 'brewery',
             'zone', 'dist1', 
             'dist2', 'dist3',
            'medincXphd', 'medincXhs', 
            'medincXyoungpop', 'medincXoldpop']].values
            fil['pred'] = pickle_model.predict(X)

        p = pd.DataFrame({'change':list(map(operator.sub, fil['pred'], fil['cafe']))})

        fil['cafe'] = fil['pred']
        fil['change'] = p['change'].values

        all_df = pd.DataFrame(data = {
        'daytime_density': fil.groupby('hood')['daytime_density'].mean(),
        'daytime_pop':fil.groupby('hood')['daytime_pop'].mean(),
        'medinc':fil.groupby('hood')['medinc'].mean(),
        'hs':fil.groupby('hood')['hs'].mean(),
        'phd':fil.groupby('hood')['phd'].mean(),
        'oldpop':fil.groupby('hood')['oldpop'].mean(),
        'youngpop':fil.groupby('hood')['youngpop'].mean(),
        'brewery':fil.groupby('hood')['brewery'].sum(),
        'cafe_model':fil.groupby('hood')['cafe'].sum(),
        'change':fil.groupby('hood')['change'].sum()
        })

    else:
        all_df = pd.DataFrame(data = {
        'daytime_density': all_df.groupby('hood')['daytime_density'].mean(),
        'daytime_pop':all_df.groupby('hood')['daytime_pop'].mean(),
        'medinc':all_df.groupby('hood')['medinc'].mean(),
        'hs':all_df.groupby('hood')['hs'].mean(),
        'phd':all_df.groupby('hood')['phd'].mean(),
        'oldpop':all_df.groupby('hood')['oldpop'].mean(),
        'youngpop':all_df.groupby('hood')['youngpop'].mean(),
        'brewery_sum':all_df.groupby('hood')['brewery'].sum(),
        'cafe':all_df.groupby('hood')['cafe'].sum()
        })

    print(all_df.head())
    all_df['hood'] = list(all_df.index)
    del all_df.index.name

    epsg_utm = 26910 #utm zone 10n
    census = gpd.read_file('./input/neighborhoods.geojson')

    census['hood'] = census['S_HOOD'].astype(str)
    gdf = census.merge(all_df, how='left', on='hood')

    print(gdf)

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

if __name__ == "__main__":
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.run(host='0.0.0.0',port=5000,debug=True)






