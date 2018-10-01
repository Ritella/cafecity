from flask_table import Table, Col
 
class Results(Table):
    hood = Col('Neighborhood')
    phd = Col('Percent Higher Ed')
    medinc = Col('Median Income')
    daytime_pop = Col('Daytime Population')
    old_pop = Col('Population above 55')
    young_pop = Col('Population below 25')