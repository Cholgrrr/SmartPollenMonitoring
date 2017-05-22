SELECT *
FROM trees
WHERE ST_DistanceSphere(geom, ST_MakePoint(473537, 5548755)) < 2000000;