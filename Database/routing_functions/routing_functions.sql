
-- This function calculates the fastest way from one node to another node

-- INPUT: geocoded start and end point -> each lat and lon coordinates (enter here datatype)
-- RETURN: table -> id, lat and lon coordinates of route nodes
-- --------------------------------------------------------------------------------------------


drop function if exists get_route_standard
	(inXStart text,		-- Latitude of geocoded route start point 
	 inYStart text,		-- Longitude of geocoded route start point
	 inXEnd text,		-- Latitude of geocoded route end point 
	 inYEnd text);		-- Longitude of geocoded route end point 

create or replace function get_route_standard
	(inXStart text,		-- Latitude of geocoded route start point 
	 inYStart text,		-- Longitude of geocoded route start point
	 inXEnd text,		-- Latitude of geocoded route end point 
	 inYEnd text)		-- Longitude of geocoded route end point 

returns table 
	(id integer,
	 x_coord double precision,
	 y_coord double precision)
	 
as $$

declare
	vStartNodeId bigint;
	vEndNodeId bigint;

begin

	-- Workflow:
	-- ---------
	-- 1) find clothest network node to geocoded start end end point (geocoded points)
	-- 2) generate a temporary table (tmp_route_nodes) to insert all route nodes:
	-- 3) insert the geocoded start point into the tmp_route_nodes table
	-- 4) take the two network nodes two calculate the shortest path
	--    -> get all route nodes and insert them into the tmp_route_nodes table
	-- 5) insert the geocoded end point into the tmp_route_nodes table
	-- 6) return the node table
	-- 7) exception handling
	-- ----------------------------------------------------------------------------------


	
	-- 1) find clothest network node to geocoded start end end point (geocoded points)
	-- ----------------------------------------------------------------------------------
	
	-- start node 
	select nyc_street_edges_vertices_pgr.id into vStartNodeId 
	from nyc_street_edges_vertices_pgr 
	order by nyc_street_edges_vertices_pgr.the_geom <-> (select st_geomfromtext('point(' || inXStart::text || ' ' || inYStart::text || ')''', 4326))
	limit 1;
	
	-- end node
	select nyc_street_edges_vertices_pgr.id into vEndNodeId 
	from nyc_street_edges_vertices_pgr 
	order by nyc_street_edges_vertices_pgr.the_geom <-> (select st_geomfromtext('point(' || inXEnd::text || ' ' || inYEnd::text || ')''', 4326))
	limit 1;
	
	
	
	-- 2) generate a temporary table (tmp_route_nodes) to insert all route nodes
	-- ----------------------------------------------------------------------------------

	drop table if exists tmp_route_nodes; 
	create table tmp_route_nodes	
		(id serial,
		 x_coord double precision,
		 y_coord double precision);



	-- 3) insert the geocoded start point into the tmp_route_nodes table
	-- ----------------------------------------------------------------------------------
	
	insert into tmp_route_nodes (x_coord, y_coord)
	values (inXStart::double precision, inYStart::double precision);



	-- 4) take the two network nodes two calculate the shortest path
	--    -> get all route nodes and insert them into the tmp_route_nodes table
	-- ----------------------------------------------------------------------------------
	
	insert into tmp_route_nodes (x_coord, y_coord)
	select 
		st_x(node.the_geom),
		st_y(node.the_geom)
	from 
		(SELECT * FROM pgr_dijkstra(
			'SELECT id, source, target, cost, reverse_cost FROM nyc_street_edges',
			vStartNodeId, 
			vEndNodeId
		)) dij
	join nyc_street_edges edge
	on edge.id = dij.edge
	join nyc_street_edges_vertices_pgr node
	on edge.target = node.id;

	
	
	-- 5) insert the geocoded end point into the tmp_route_nodes table
	-- ----------------------------------------------------------------------------------

	insert into tmp_route_nodes (x_coord, y_coord)
	values (inXEnd::double precision, inYEnd::double precision);



	-- 6) return the node table
	-- ----------------------------------------------------------------------------------

	-- final return table goes here
	return query
		select nodes.id, nodes.x_coord, nodes.y_coord from tmp_route_nodes nodes;



	-- 7) exception handling
	-- ----------------------------------------------------------------------------------
	
	exception when others then 
		
		-- generate here a on row null null null table
		return query
			select null, null, null; 
	

	
end;
$$ language plpgsql; 







-- This function calculates the fastest way from one node to another node by avoiding trees

-- INPUT: geocoded start and end point -> each lat and lon coordinates (enter here datatype)
-- RETURN: table -> id, lat and lon coordinates of route nodes
-- --------------------------------------------------------------------------------------------


drop function if exists get_route_tree_avoiding
	(inXStart text,			-- Latitude of geocoded route start point 
	 inYStart text,			-- Longitude of geocoded route start point
	 inXEnd text,			-- Latitude of geocoded route end point 
	 inYEnd text,			-- Longitude of geocoded route end point
	 inTreeClause text);	-- Tree avoiding where statement	 

create or replace function get_route_tree_avoiding
	(inXStart text,			-- Latitude of geocoded route start point 
	 inYStart text,			-- Longitude of geocoded route start point
	 inXEnd text,			-- Latitude of geocoded route end point 
	 inYEnd text,			-- Longitude of geocoded route end point
	 inTreeClause text)	-- Tree avoiding where statement

returns table 
	(id integer,
	 x_coord double precision,
	 y_coord double precision)
	 
as $$

declare
	vStartNodeId bigint;
	vEndNodeId bigint;
	vXMin double precision;
	vYMin double precision;
	vXMax double precision;
	vYMax double precision;
	vDijkstraQuery text; 
	
begin

	-- Workflow:
	-- ---------
	-- 1) find clothest network node to geocoded start end end point (geocoded points)
	-- 2) generate a temporary table (tmp_route_nodes) to insert all route nodes:
	-- 3) insert the geocoded start point into the tmp_route_nodes table
	-- 4) take the two network nodes two calculate the shortest path
	--    -> get all route nodes and insert them into the tmp_route_nodes table
	-- 5) insert the geocoded end point into the tmp_route_nodes table
	-- 6) return the node table
	-- 7) exception handling
	-- ----------------------------------------------------------------------------------


	
	-- 1) find clothest network node to geocoded start end end point (geocoded points)
	-- ----------------------------------------------------------------------------------
	
	-- start node 
	select nyc_street_edges_vertices_pgr.id into vStartNodeId 
	from nyc_street_edges_vertices_pgr 
	order by nyc_street_edges_vertices_pgr.the_geom <-> (select st_geomfromtext('point(' || inXStart::text || ' ' || inYStart::text || ')''', 4326))
	limit 1;
	
	-- end node
	select nyc_street_edges_vertices_pgr.id into vEndNodeId 
	from nyc_street_edges_vertices_pgr 
	order by nyc_street_edges_vertices_pgr.the_geom <-> (select st_geomfromtext('point(' || inXEnd::text || ' ' || inYEnd::text || ')''', 4326))
	limit 1;
	
	
	
	-- 2) generate a temporary table (tmp_route_nodes) to insert all route nodes
	-- ----------------------------------------------------------------------------------

	drop table if exists tmp_route_nodes; 
	create table tmp_route_nodes	
		(id serial,
		 x_coord double precision,
		 y_coord double precision);



	-- 3) insert the geocoded start point into the tmp_route_nodes table
	-- ----------------------------------------------------------------------------------
	
	insert into tmp_route_nodes (x_coord, y_coord)
	values (inXStart::double precision, inYStart::double precision);



	-- 4) take the two network nodes two calculate the shortest path
	--    -> get all route nodes and insert them into the tmp_route_nodes table
	-- ----------------------------------------------------------------------------------
	
	
	-- get min and max X and Y
	select least(inXStart::double precision, inXEnd::double precision) into vXMin;
	select least(inYStart::double precision, inYEnd::double precision) into vYMin;
	select greatest(inXStart::double precision, inXEnd::double precision) into vXMax;
	select greatest(inYStart::double precision, inYEnd::double precision) into vYMax;
	
	-- generate tmp tree tabel
	drop table if exists buffer_tree;
	execute 
		'create table buffer_tree as
		select gid, treetype, st_buffer(trees_wgs84.geom, 0.001) geom
		from trees_wgs84 '
		|| inTreeClause 
		|| ' and ('
		|| 'ST_Intersects(ST_MakeEnvelope('|| vXMin::text || ', ' || vYMin::text || ', ' || vXMax::text || ', ' || vYMax::text || ', 4326) , trees_wgs84.geom))';


	-- -------------------------------------
	
	-- construct the dijkstra query
	vDijkstraQuery := 
		'SELECT id, source, target, cost, reverse_cost FROM nyc_street_edges
				where id in 
					(select edg.id
					from 
						(select * from nyc_street_edges where ST_Intersects(ST_MakeEnvelope('|| vXMin::text || ', ' || vYMin::text || ', ' || vXMax::text || ', ' || vYMax::text || ', 4326) , nyc_street_edges.geom)) edg
					where id not in 
						(select edg.id
						from 
							(select * from nyc_street_edges where ST_Intersects(ST_MakeEnvelope('|| vXMin::text || ', ' || vYMin::text || ', ' || vXMax::text || ', ' || vYMax::text || ', 4326) , nyc_street_edges.geom)) edg, 
							buffer_tree buf
						where st_intersects(buf.geom, edg.geom)))'; 
	
	
	-- inster dijkstra route
	insert into tmp_route_nodes (x_coord, y_coord)
	select 
		st_x(node.the_geom),
		st_y(node.the_geom)
	from 
		(SELECT * FROM pgr_dijkstra(
			vDijkstraQuery,
			vStartNodeId, 
			vEndNodeId
		)) dij
	join nyc_street_edges edge
	on edge.id = dij.edge
	join nyc_street_edges_vertices_pgr node
	on edge.target = node.id;

	
	
	-- 5) insert the geocoded end point into the tmp_route_nodes table
	-- ----------------------------------------------------------------------------------

	insert into tmp_route_nodes (x_coord, y_coord)
	values (inXEnd::double precision, inYEnd::double precision);

	
	-- 6) return the node table
	-- ----------------------------------------------------------------------------------

	-- final return table goes here
	return query
		select nodes.id, nodes.x_coord, nodes.y_coord from tmp_route_nodes nodes;



	-- 7) exception handling
	-- ----------------------------------------------------------------------------------
	
	exception when others then 
		
		-- generate here a on row null null null table
		return query
			select null, null, null; 
	

	
end;
$$ language plpgsql; 




















