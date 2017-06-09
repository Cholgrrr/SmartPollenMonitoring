-- Table: public.tree_blooming

DROP TABLE public.tree_blooming;

CREATE TABLE public.tree_blooming
(
  tt_id integer,
  tree_type text NOT NULL,
  jan double precision,
  feb double precision,
  mar double precision,
  apr double precision,
  may double precision,
  jun double precision,
  jul double precision,
  aug double precision,
  sep double precision,
  okt double precision,
  nov double precision,
  dez double precision,
  CONSTRAINT tree_blooming_pkey PRIMARY KEY (tree_type)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.tree_blooming
  OWNER TO postgres;

  
  
  
-------------------------------------------------


-- Table: public.trees_latlon

DROP TABLE public.trees_latlon;

CREATE TABLE public.trees_latlon
(
  gid integer NOT NULL DEFAULT nextval('xywgs84utm32_gid_seq'::regclass),
  baumnummer numeric(10,0),
  pflanzjahr numeric(10,0),
  kronendurc numeric(10,0),
  lat numeric,
  lon numeric,
  treetype character varying(50),
  geom geometry(Point),
  CONSTRAINT xywgs84utm32_pkey PRIMARY KEY (gid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.trees_latlon
  OWNER TO postgres;
COMMENT ON TABLE public.trees_latlon
  IS 'xywgs84utm32';

-- Index: public.xywgs84utm32_geom_idx

-- DROP INDEX public.xywgs84utm32_geom_idx;

CREATE INDEX xywgs84utm32_geom_idx
  ON public.trees_latlon
  USING gist
  (geom);

  
  
  
-------------------------------------------------------




-- Table: public.wind_from_service

DROP TABLE public.wind_from_service;

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
  
  
  
  
------------------------------------------------------
  
  
-- Table: public.wind_hist

DROP TABLE public.wind_hist;

CREATE TABLE public.wind_hist
(
  wh_id integer NOT NULL,
  city text,
  month integer,
  speed double precision, -- 
  direction double precision,
  CONSTRAINT wind_hist_pkey PRIMARY KEY (wh_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.wind_hist
  OWNER TO postgres;
COMMENT ON COLUMN public.wind_hist.speed IS '
';



