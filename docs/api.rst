API
===

Response Format
---------------

The default format for responses is JSON. Each response is a JSON object
containing three parameters: ``meta``, ``objects``, and ``errors``:

The following response format applies for GET and POST requests.

.. code-block:: json

   {
       meta: {},
       objects: [],
       errors: {}
   }

``meta``
  An object containing metadata about the request such as the original request
  parameters and pagination information

``objects``
  An array containing the requested data. The contents of the array vary with
  the different requests

``errors``
  An object mapping an error type to an error message


Want Pull Data from Rhizome?
----------------------------

Step 1. Contact dingeej@gmail.com to get an API key

.. code-block:: json

   {
       meta: {},
       objects: [],
       errors: {}
   }
  



GET
===

Global Parameters and Query Filters
-----------------------------------

``limit``
  default: 20

``offset``
  default: 0

  The offset into the list of matched objects. For example, if ``offset=10`` is
  passed to an endpoint, the first 10 records that match the query will not be
  returned, the response will begin with the 11th object

  *note - For the /v1 api, the limit / offset is applied after the queryset is
  returned.  Since most of the object lists are small this isnt a huge issue
  , however it is to be of note when querying the location endpoint which returns
  20k+ results*

``format``
  default: ``json``

  One of either ``json`` or ``csv`` that determines the format of the response

``simple_evaluation``

.. code-block:: json

  /api/v1/indicator/?id=21
  /api/v1/indicator/?slug=number-of-all-missed-children


``__in``

pass a list of values and retrieve one result for each match

.. code-block:: json

    /api/v1/indicator/?id__in=21,164


``__gt; __lt; __gte; __lte``

.. code-block:: json

    /api/v1/campaign/?start_date__lte=2015-01-01
    /api/v1/campaign/?start_date__gte=2015-01-01
    /api/v1/office/?id__gt=2
    /api/v1/office/?id__lt=2

``__contains; __starts_with``

filter resources with simple string functions.

.. code-block:: json

  /api/v1/indicator/?name__startswith=Number
  /api/v1/indicator/?name__contains=polio


* Note - These query parameters are taken directly from the Django ORM.  For
  more on how these work see here:*
    https://docs.djangoproject.com/en/1.8/topics/db/queries/#field-lookups

``/api/v1/datapoint/``
++++++++++++++++++++++

Return datapoints grouped by unique pairs of location and campaign. If no data is
stored for a requested location, the value is computed by aggregating sub-locations.

Parameters
~~~~~~~~~~

``indicator__in``
  A comma-separated list of indicator IDs to fetch. By default, all indicators
  are collected in a single object for each unique pair of location and campaign

``location__in``
  A comma-separated list of location IDs

``campaign_start``
  format: ``YYYY-MM-DD``

  Include only datapoints from campaigns that began on or after the supplied
  date

``campaign_end``
  format: ``YYYY-MM-DD``

  Include only datapoints from campaigns that ended on or before the supplied
  date

``campaign__in``
  A comma-separated list of campaign IDs. Only datapoints attached to one of the
  listed campaigns will be returned

  Return only one datapoint per object. Instead of collecting all requested
  indicators into a single object, return one object per location, campaign,
  indicator set.


Response Format
~~~~~~~~~~~~~~~

.. code-block:: json

  {
    meta: {
      limit: ...,
      offest: ...,
      total_count: ...,
      parameters_requested: {...}
    },

    objects: [{
      location: ...,
      campaign: ...,
      indicators: [{
        indicator: ...,
        value: ...
      }, {
        indicator: ...,
        value: ...
      }]
    }],

    errors: { ..}
  }

``location``
  The location for this set of data. location will be the ID of the resource.

``campaign``
  The campaign for this set of data. Campaign will be the ID of the resource.

``indicators``
  An array of the values for the requested indicators. This will always be an
  array, even if the ``no_pivot`` parameter is passed

``indicator``
  The ID of the indicator represented by the object

``value``
  The value of the indicator

``Filter By Date of Campaign``

  The API will let you filter a campaign, or a specific campaign to query on, but
  you also have the option to pass in the start and end date.

  If you pass only start date, you will receive datapoints after (and including)
  the date passed in.

  If you pass only end date, you will receive datapoints befre (and including) the
  date passed in.

  If you pass in both start and end, you will get the data relevant to the
  campaigns in between the two dates.

  Please Pass the date format as 'YYYY-MM-DD'

.. code-block:: python
   :linenos:

    http://localhost:8000/api/v1/datapoint/?campaign_start=2014-06-01&campaign_end=2014-09-01

``/api/v1/campaign/``
+++++++++++++++++++++

Return a list of campaign definitions.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      name: <String>,
      slug: <String>,
      start_date: "YYYY-MM-DD",
      end_date: "YYYY-MM-DD",
      office: <reference>,
      resource_uri: <String>,
      created_at: "YYYY-MM-DDTHH:MM:SS.sss"
    }],

    errors: {...}
  }

``office``
  A reference to the office under which the campaign was conducted. This will be
  an ID (``Number``), name (``String``), slug (``String``), or URI (``String``)
  for the office depending on the value of the ``uri_format`` parameter

``/api/v1/indicator/``
++++++++++++++++++++++

Return a list of indicator definitions, as well as their Bounds, and Tags.
The indicator_bound json tells the application what the low and high bounds are
of a particular indicator's value.  For instance, if we want to say that
> 20% missed childredn is 'Bad', between 10-20% is 'Ok' and less than t0% is
'Good' we would incode that in the database as such and return that json data
in the indicator bound object.

The indicator Tag json, simply contains a list of IDs, the display name for
each can be found via the ``indicator_tag`` endpoint.

The Indicator endpoint is one of the meta data models that relies on a
transformation of the data from its original state ( the indicator table) into
a more abstracted and prepared data structure which is found in the
indicator_abstracted table.

Custom Parameters
~~~~~~~~~~~~~~~~~

`read_write``
  - default = r
  - This controls whether or not the application needs to see data a user can
    READ or WRITE to.
  - This comes in handy for the data entry page, in that we only want to pull
    indicators a user can write to.  This way we save the use case of the user
    getting indicators in the drop down that they can read from but not write
    to, only to get an error message when they try to enter data for that
    indicator

.. code-block:: json

  {
    meta: {...},

    objects: [{
      source_name: <Text>,
      name: <Text>,
      short_name: <Text>,
      bound_json: <Json>,
      id: <Number>,
      tag_json: <Json>
      slug: <Text>,
      description: <Text>,
    }],

    errors: {...}
  }

``/api/v1/location/``
+++++++++++++++++++

Return a list of location definitions in accordance to the schema melow.

This endpoint will only return locations that the user has permissions for.  In
this case, and in all other instances of GET requests dealing with locations,
and location_ids, we use the ``fn_get_authorized_locations_by_user`` stored
procedure which gets recursively the list of location_ids that a user can
access.


Custom Parameters
~~~~~~~~~~~~~~~~~

``depth_level``
  - default = 0
  - the depth parameter controls how far down the location tree the API should
    traverse when returning location data.
  - a parameter of 0 returns ALL data, while a parameter of 1 retreives
    locations at most one level underneath the locations avaliable to that user.
      -> that is if a user has permission to see Nigeria only, and they pass
         a depth=1 parameter, they will see data Nigeria, as well as for the
         provinces but not for districts, sub-districts and settlemnts.

``read_write``
  - default = r
  - This controls whether or not the application needs to see data a user can
    READ or WRITE to.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      name: <String>,
      slug: <String>
      latitude: <Number>,
      longitude: <Number>,
      location_code: <String>,
      location_type: <String>,
      shape_file_path: <String>,
      office: <reference>,
      parent_location: <reference>,
      resource_uri: <String>,
      created_at: "YYYY-MM-DDTHH:MM:SS.sss",
    }],

    errors: {...}
  }

Properties with type ``<reference>`` can contain an ID (``Number``), name, slug,
or URI (all of type ``String``) depending on the value of the ``uri_format``
parameter.

``/api/v1/office/``
+++++++++++++++++++

Return a list of office definitions. Offices are administrative concepts that
represent different parts of the organization that oversee locations. For example,
there might be an office for Nigeria that represents the Nigerian Country
Office. The location Nigeria that represents the country, as well as all of its
sub-locations, would be associated with the Nigeria office.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      name: <String>,
      resource_uri: <String>,
      created_at: "YYYY-MM-DDTHH:MM:SS.sss",
    }],

    errors: {...}
  }

``/api/v1/campaign_type/``
+++++++++++++++++++

A key to the 'campaign' resource, while all campaigns in the system are
"National Immunication Days" UNICEF/WHO do implement different types of
campaigns ( for instance a mop-up in the area surrounding a new case ).


.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      name:<String>,
    }],

    errors: {...}
  }

``/api/v1/location_type/``
+++++++++++++++++++

List of location types ( each location must have a location type ).  For now we are
dealing with Country, Province, District, Sub-District and Settlement.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      name:<String>,
    }],

    errors: {...}
  }


``/api/v1/indicator_tag/``
++++++++++++++++++++++++++

The list of tags that each indicator can be attributed to.  Notice the
parent_tag_id field, this is used to build the indicator heirarchy dropdown
implemented in the group edit page.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      tag_name:<String>,
      parent_tag_id:<Number>
    }],

    errors: {...}
  }


``/api/v1/location_map/``
+++++++++++++++++++

TODO - Needs documentation


``/api/v1/source_doc/``
+++++++++++++++++++
TODO - Needs documentation


``/api/v1/document_review/``
+++++++++++++++++++++++++++++

TODO - Needs documentation


``/api/v1/custom_dashboard/``
+++++++++++++++++++++++++++++

A list of custom dashboards, along with the JSON that allows the application
to build the dashboard as well as owner information.

*Permissions*

the ``apply_cust_dashboard_permissions`` function is less of a permission filter
than it is an opportunity for the API to add the data needed for the front end.
Specifically that refers to the owned_by_current_user and owner_username fields.
This function adds this information in addition to the data that comes
directly from the model ( which in this case is CustomDashboard ).


.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      default_office_id: <Number>,
      description: <Text>,
      title: <Text>,
      dashboard_json: <json>
      owned_by_current_user: <Boolean>,
      owner_username: <Text>,
      owner_id: <Number>,
    }],

    errors: {...}
  }


``/api/v1/group_permission/``
+++++++++++++++++++++++++++++

The list of indicators each group has permissions to and vice versa.
For instance to see what groups have permission to view indicator_id 21, simply
pass:

'/api/v1/group_permission/?indicator=21'

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      indicator_id <Number>,
      group_id <Number>,
    }],

    errors: {...}
  }


``/api/v1/group/``
++++++++++++++++++

The list of groups in the application.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      name: <Text>,
    }],

    errors: {...}
  }


``/api/v1/user/``
+++++++++++++++++

The list of users in the application.  All filters outlined above are avaliable
here to all of the fields included in the response.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      username: <Text>,
      first_name: <Text>,
      last_name: <Text>,
      is_active: <Boolean>,
      is_superuser: <Boolean>,
      is_staff: <Boolean>,
      last_login: <Datetime>,
      email: <Text>,
      date_joined:<Datetime>,
    }],

    errors: {...}
  }


``/api/v1/location_permission/``
++++++++++++++++++++++++++++++

This endpoint tells which locations a user has access to read or write to.
If you want only the locations that a user can WRITE to pass the read_write=w
parameter.  By default, this endpoint retreives the locations that a user can
read.

.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      read_write: <Text>,
      user_id: <Number>,
      location_id: <Number>
    }],

    errors: {...}
  }


``/api/v1/user_group/``
+++++++++++++++++++++++++

This endpoint tells which groups a user is in and vice versa.

For instance to see all the groups user_id 1 is in .. simply pass the following
url to the application:

'/api/v1/user_group/?user=1'


.. code-block:: json

  {
    meta: {...},

    objects: [{
      id: <Number>,
      group_id: <Number>,
      user_id: <Number>,
    }],

    errors: {...}
  }
