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



        console.log(data);
        // ´*100 for procent
        var jan = { Month: "January", Buche: 0, Birke: 1, other: 2 };
        var feb = { Month: "February", Buche: 0, Birke: 1, other: 2 };
        var mar = { Month: "March", Buche: 0.3, Birke: 1, other: 2 };
        var apr = { Month: "April", Buche: 0.6, Birke: 1, other: 2 };
        var mai = { Month: "Mai", Buche: 1, Birke: 1, other: 2 };
        var jun = { Month: "June", Buche: 1, Birke: 1, other: 2 };
        var jul = { Month: "July", Buche: 1, Birke: 1, other: 2 };
        var aug = { Month: "August", Buche: 1, Birke: 1, other: 2 };
        var sep = { Month: "September", Buche: 0.6, Birke: 1, other: 2 };
        var oct = { Month: "October", Buche: 0.3, Birke: 1, other: 2 };
        var nov = { Month: "November", Buche: 0, Birke: 1, other: 2 };
        var dec = { Month: "December", Buche: 0, Birke: 0, other: 0 };

       
        var columns = ["Month", "Birke", "Buche","other"];
        data[0] = (jan);
        data[1] = (feb);
        data[2] = (mar);
        data[3] = (apr);
        data[4] = (mai);
        data[5] = (jun);
        data[6] = (jul);
        data[7] = (aug);
        data[8] = (sep);
        data[9] = (oct);
        data[10] = (nov);
        data[11] = (dec);
        data["columns"] = columns;
        console.log(data);


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
            .text("Population");

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