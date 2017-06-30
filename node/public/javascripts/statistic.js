function TreeStat() {
   
    var svg = d3.select("svg"),
        margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    

    //--------------------------------------------------------
    d3.csv("", function (d, i, columns) {
        //for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
        //return d;
    }, function (error, data) {
        //if (error) throw error;
       
        var columns = ["Month"];

        //##############################################################
        let mdata;
        mdata = getTreeBloomingAll();

	
		// ---- translate the tree_types -----
		
		for (i = 0; i < mdata.length; i++) {
			if (mdata[i].tree_type == 'Birke') {
				mdata[i].tree_type = 'Birch';
			} else if (mdata[i].tree_type == 'Erle') {
				mdata[i].tree_type = 'Alder';
			} else if (mdata[i].tree_type == 'Hasel') {
				mdata[i].tree_type = 'Hazel';
			} else if (mdata[i].tree_type == 'Ahorn') {
				mdata[i].tree_type = 'Maple';
			} else if (mdata[i].tree_type == 'Apfel') {
				mdata[i].tree_type = 'Apple';
			} else if (mdata[i].tree_type == 'Birne') {
				mdata[i].tree_type = 'Pear';
			} else if (mdata[i].tree_type == 'Buche') {
				mdata[i].tree_type = 'Beech';
			} else if (mdata[i].tree_type == 'Buchs') {
				mdata[i].tree_type = 'Buchs';
			} else if (mdata[i].tree_type == 'Eibe') {
				mdata[i].tree_type = 'Yew';
			} else if (mdata[i].tree_type == 'Eiche') {
				mdata[i].tree_type = 'Oak';
			} else if (mdata[i].tree_type == 'Esche') {
				mdata[i].tree_type = 'Ash';
			} else if (mdata[i].tree_type == 'Flieder') {
				mdata[i].tree_type = 'Lilac';
			} else if (mdata[i].tree_type == 'Goetterbaum') {
				mdata[i].tree_type = 'Ailanthus';
			} else if (mdata[i].tree_type == 'Holunder') {
				mdata[i].tree_type = 'Elder';
			} else if (mdata[i].tree_type == 'Eibe') {
				mdata[i].tree_type = 'Chestnut';
			} else if (mdata[i].tree_type == 'Kiefer') {
				mdata[i].tree_type = 'Pine';
			} else if (mdata[i].tree_type == 'Kirsche') {
				mdata[i].tree_type = 'Cherry';
			} else if (mdata[i].tree_type == 'Linde') {
				mdata[i].tree_type = 'Lime';
			} else if (mdata[i].tree_type == 'Pflaume') {
				mdata[i].tree_type = 'Plum';
			} else if (mdata[i].tree_type == 'Robinie') {
				mdata[i].tree_type = 'Robinie';
			} else if (mdata[i].tree_type == 'Schlafbaum') {
				mdata[i].tree_type = 'Sleeping-Tree';
			} else if (mdata[i].tree_type == 'Schnur') {
				mdata[i].tree_type = 'Schnur';
			} else if (mdata[i].tree_type == 'Tanne') {
				mdata[i].tree_type = 'Fir';
			} else if (mdata[i].tree_type == 'Ulme') {
				mdata[i].tree_type = 'Elm';
			} else if (mdata[i].tree_type == 'Walnuss') {
				mdata[i].tree_type = 'Walnut';
			} else if (mdata[i].tree_type == 'Weide') {
				mdata[i].tree_type = 'Pasture';
			} else if (mdata[i].tree_type == 'Zeder') {
				mdata[i].tree_type = 'Cedar';
			} else if (mdata[i].tree_type == 'Zypresse') {
				mdata[i].tree_type = 'Cypress';
			} else if (mdata[i].tree_type == 'other') {
				mdata[i].tree_type = 'other';
			} else {
				mdata[i].tree_type = mdata[i].tree_type;
			}	
		}
		// ---- end of translation -----
		
		

        //console.log(mdata);
        var jan = { Month: "January" };
        var feb = { Month: "February" };
        var mar = { Month: "March" };
        var apr = { Month: "April" };
        var may = { Month: "May" };
        var jun = { Month: "June" };
        var jul = { Month: "July" };
        var aug = { Month: "August" };
        var sep = { Month: "September" };
        var okt = { Month: "October" };
        var nov = { Month: "November" };
        var dez = { Month: "December" };

        for (i = 0; i < mdata.length; i++) {
            //console.log(i);
            columns.push(mdata[i].tree_type);
            jan[mdata[i].tree_type] = (mdata[i].jan * 100);
            //console.log(jan);

            feb[mdata[i].tree_type] = (mdata[i].feb * 100);
            //console.log(feb);

            mar[mdata[i].tree_type] = (mdata[i].mar * 100);
            //console.log(mar);
            apr[mdata[i].tree_type] = (mdata[i].apr * 100);

            may[mdata[i].tree_type] = (mdata[i].may * 100);
            //console.log(may)

            jun[mdata[i].tree_type] = (mdata[i].jun * 100);
            //console.log(jun);

            jul[mdata[i].tree_type] = (mdata[i].jul * 100);
            //console.log(jul);

            aug[mdata[i].tree_type] = (mdata[i].aug * 100);
            //console.log(aug);

            sep[mdata[i].tree_type] = (mdata[i].sep * 100);
            //console.log(sep);

            okt[mdata[i].tree_type] = (mdata[i].okt * 100);
            //console.log(okt);

            nov[mdata[i].tree_type] = (mdata[i].nov * 100);
            //console.log(nov);

            dez[mdata[i].tree_type] = (mdata[i].dez * 100);
            //console.log(dez);
        };
        //console.log(jan);

        data[0] = (jan);
        data[1] = (feb);
        data[2] = (mar);
        data[3] = (apr);
        data[4] = (may);
        data[5] = (jun);
        data[6] = (jul);
        data[7] = (aug);
        data[8] = (sep);
        data[9] = (okt);
        data[10] = (nov);
        data[11] = (dez);
        data["columns"] = columns;
        //console.log(data);

        //#############################################################

        var keys = data.columns.slice(1);

        x0.domain(data.map(function (d) { return d.Month; }));
        x1.domain(keys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();

        g.append("g")
          .selectAll("g")
          .data(data)
          .enter().append("g")
            .attr("transform", function (d) { return "translate(" + x0(d.Month) + ",0)"; })
          .selectAll("rect")
          .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
          .enter().append("rect")
            .attr("x", function (d) { return x1(d.key); })
            .attr("y", function (d) { return y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("height", function (d) { return height - y(d.value); })
            .attr("fill", function (d) { return z(d.key); });

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
          .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Percentage");

        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
          .selectAll("g")
          .data(keys.slice().reverse())
          .enter().append("g")
            .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .style('fill', 'white')
            .text(function (d) { return d; });

    }
    )};


// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
    d3.selectAll("svg > *").remove();
    TreeStat();
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}