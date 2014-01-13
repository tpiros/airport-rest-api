# REST API to query airport information

## Installation

<ul><li>git clone to desired location.</li>
<li>npm install</li>
<li>node app.js</li>
</ul>

## Import data to mongodb
use mongoimport to import dataset from <b>data.json</b>

## Deploy to AppFog
Read http://tamas.io/deploy-node-js-mongodb-app-to-appfog/ in order to deploy this app to AppFog

## REST Endpoints

<table border="1" cellpadding="5">
<tr><td>Endpoint</td><td>Action</td><td>Example</td></tr>
<tr><td>/</td><td>Returns all data from the database</td><td>/</td></tr>
<tr><td>/?sort=[fieldname]</td><td>Sorts the dataset by fieldname</td><td>/?sort=iata_code</td></tr>
<tr><td>/?sort=[fieldname]&order=[ASC|DESC]</td><td>Sorts the dataset by fieldname and orders either ascending or descending. (order won't work without sort)</td><td>/
/?sort=iata_code&order=desc</td></tr>
<tr><td>/?fields=[field1,fieldN]</td><td>Returns only specified fields (that are required to be comma separated values)</td><td>/?fields=iata_code,name</td></tr>
<tr><td colspan="3" align="center">sorts and fields can be added to any query above and can be combined such as ?sort=name&order=asc&fields=iata_code,name</td></tr>
<tr><td>/airport/iata/[VALUE]</td><td>Searches dataset for given IATA codes and returns <i>one</i> result</td><td>/airport/iata/LHR</td></tr>
<tr><td>/airport/distance/[value]?lat=[value_lat]&lng=[value_lng]</td><td>Returns list of airports based on distance specified from given LAT/LNG pair. Distance is in KMs</td><td>Airports in a 30km radius of Los Angeles: /airport/distance/30?lat=34.0500&lng=-118.2500<br>Airports in a 45km radius of London, showing name and IATA code only, ordered by IATA Code descending: /airport/distance/45?lat=51.5072&lng=-0.1275&fields=name,iata_code&sort=iata_code&order=desc</td></tr>
</table>
