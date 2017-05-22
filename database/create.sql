-- Database: "NASAWIND"
--------------------------------------------

CREATE DATABASE "NASAWIND"
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'German_Germany.1252'
       LC_CTYPE = 'German_Germany.1252'
       CONNECTION LIMIT = -1;
	   
	   
--------------------------------------------



-- Enable POSTGIS
--------------------------------------------

CREATE EXTENSION POSTGIS;


-- Tables
-------------------------------------------

--- Table: public.treecataster ---

CREATE TABLE public.treecataster
(
  type text,
  object_id text,
  street text,
  jear integer,
  diameter text,
  north double precision,
  east double precision,
  tree_id integer NOT NULL DEFAULT nextval('treecataster_tree_id_seq'::regclass),
  tree_area_id integer,
  CONSTRAINT treecataster_pkey PRIMARY KEY (tree_id),
  CONSTRAINT treecataster_tree_area_id_fkey FOREIGN KEY (tree_area_id)
      REFERENCES public.tree_area (area_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.treecataster
  OWNER TO postgres;


--- Table: public.tree_area ---

CREATE TABLE public.tree_area
(
  area_id integer NOT NULL,
  tree_type text,
  type_number integer,
  area geometry,
  north double precision,
  east double precision,
  CONSTRAINT tree_area_pkey PRIMARY KEY (area_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.tree_area
  OWNER TO postgres;
  
  
  
--- Table: public.spreadout_area ---

CREATE TABLE public.spreadout_area
(
  so_id integer NOT NULL,
  so_area geometry,
  so_date date,
  tree_area_id integer,
  CONSTRAINT spreadout_area_pkey PRIMARY KEY (so_id),
  CONSTRAINT spreadout_area_tree_area_id_fkey FOREIGN KEY (tree_area_id)
      REFERENCES public.tree_area (area_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.spreadout_area
  OWNER TO postgres;

  
  
--- Table: public.wind_from_service ---

CREATE TABLE public.wind_from_service
(
  wfs_id integer NOT NULL DEFAULT nextval('wind_from_service_wfs_id_seq'::regclass),
  city text,
  north double precision,
  east double precision,
  speed double precision,
  direction double precision,
  in_date timestamp without time zone DEFAULT now(),
  CONSTRAINT wind_from_service_pkey PRIMARY KEY (wfs_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.wind_from_service
  OWNER TO postgres;

  
-- Table: public.wind_interpolated

CREATE TABLE public.wind_interpolated
(
  wind_id integer NOT NULL DEFAULT nextval('wind_interpolated_wind_id_seq'::regclass),
  east double precision,
  north double precision,
  cityset_id integer,
  speed double precision,
  direction double precision,
  CONSTRAINT wind_interpolated_pkey PRIMARY KEY (wind_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.wind_interpolated
  OWNER TO postgres;

  
  
  
  
  
-- Views
---------------------------


-- View: public.windset

CREATE OR REPLACE VIEW public.windset AS 
 SELECT wind_from_service.wfs_id,
    wind_from_service.city,
    wind_from_service.north,
    wind_from_service.east,
    wind_from_service.speed,
    wind_from_service.direction,
    wind_from_service.in_date
   FROM wind_from_service;

ALTER TABLE public.windset
  OWNER TO postgres;

  
  
  
  
  
 







  
  
  
  
  
  
  
  
  
  
  
  









