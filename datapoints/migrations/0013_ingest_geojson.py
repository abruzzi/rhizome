# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import json
from pprint import pprint

from django.db import models, migrations
from django.core.exceptions import ObjectDoesNotExist

from datapoints.models import Region, RegionPolygon

def ingest_geo(apps, schema_editor):

    GEO_JSON_DIR = '/Users/john/data/geo'

    for root, dirs, files in os.walk(GEO_JSON_DIR, topdown=False):
        for name in files:
            if name.endswith('adm0.geojson'):
                file_results = process_geo_json_file((os.path.join(root, name)))

def process_geo_json_file(file_path):

    print '==%s==' % file_path

    with open(file_path) as data_file:
        data = json.load(data_file)

    features = data['features']
    for feature in features:
        process_region(feature)

def process_region(geo_json):

    try:
        region_id = Region.objects.get(region_code = geo_json['properties']['ADM0_CODE'] ).id
    except ObjectDoesNotExist:
        print geo_json['properties']['ADM0_CODE'] + 'DOES NOT EXISTS'
        return

    rp = RegionPolygon.objects.create(
        region_id = region_id,
        geo_json = geo_json
    )

    print rp.id



class Migration(migrations.Migration):

    dependencies = [
    # DELETE FROM django_migrations WHERE name = '0013_ingest_geojson';
        ('datapoints', '0012_afg_pak_regions'),
    ]

    operations = [
        migrations.RunPython(ingest_geo)
    ]
