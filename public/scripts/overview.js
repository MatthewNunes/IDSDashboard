async function loadSwatData() {
  const dataset = await d3.csv("../resources/SWaT/data2017_time_SWaT.csv");
  dataset.forEach(function(row, index) {
    row["StartTime"] = new Date(row["StartTime"].split("-")[2].split(" ")[0], row["StartTime"].split("-")[1], row["StartTime"].split("-")[0], row["StartTime"].split(" ")[1].split(":")[0], row["StartTime"].split(" ")[1].split(":")[1], row["StartTime"].split(" ")[1].split(":")[2].split(".")[0]);
    row["LastTime"] = new Date(row["LastTime"].split("-")[2].split(" ")[0], row["LastTime"].split("-")[1], row["LastTime"].split("-")[0], row["LastTime"].split(" ")[1].split(":")[0], row["LastTime"].split(" ")[1].split(":")[1], row["LastTime"].split(" ")[1].split(":")[2].split(".")[0]);
    row["Trans"] = parseInt(row["Trans"]);
    row["RunTime"] = parseFloat(row["RunTime"]);
    row["IdleTime"] = parseFloat(row["IdleTime"]);
    row["Mean"] = parseFloat(row["Mean"]);
    row["StdDev"] = parseFloat(row["StdDev"]);
    row["Sum"] = parseFloat(row["Sum"]);
    row["Min"] = parseFloat(row["Min"]);
    row["Max"] = parseFloat(row["Max"]);
    row["SrcAddr"] = parseInt(row["SrcAddr"]);
    row["DstAddr"] = parseInt(row["DstAddr"]);
    row["Proto"] = parseInt(row["Proto"]);
    row["Sport"] = parseInt(row["Sport"]);
    row["Dport"] = parseInt(row["Dport"]);
    row["sTos"] = parseFloat(row["sTos"]);
    row["sDSb"] = parseFloat(row["sDSb"]);
    row["sTtl"] = parseFloat(row["sTtl"]);
    row["sHops"] = parseFloat(row["sHops"]);
    row["TotPkts"] = parseInt(row["TotPkts"]);
    row["SrcPkts"] = parseInt(row["SrcPkts"]);
    row["DstPkts"] = parseInt(row["DstPkts"]);
    row["TotBytes"] = parseInt(row["TotBytes"]);
    row["SrcBytes"] = parseInt(row["SrcBytes"]);
    row["DstBytes"] = parseInt(row["DstBytes"]);
    row["Load"] = parseFloat(row["Load"]);
    row["SrcLoad"] = parseFloat(row["SrcLoad"]);
    row["DstLoad"] = parseFloat(row["DstLoad"]);
    row["Loss"] = parseInt(row["Loss"]);
    row["SrcLoss"] = parseInt(row["SrcLoss"]);
    row["DstLoss"] = parseInt(row["DstLoss"]);
    row["pLoss"] = parseFloat(row["pLoss"]);
    row["Rate"] = parseFloat(row["Rate"]);
    row["SrcRate"] = parseFloat(row["SrcRate"]);
    row["DstRate"] = parseFloat(row["DstRate"]);
    row["Dir"] = parseInt(row["Dir"]);
    row["TcpRtt"] = parseFloat(row["TcpRtt"]);
    row["SynAck"] = parseFloat(row["SynAck"]);
    row["AckDat"] = parseFloat(row["AckDat"]);
    row["sMeanPktSz"] = parseFloat(row["sMeanPktSz"]);
    row["dMeanPktSz"] = parseFloat(row["dMeanPktSz"]);
    row["Flg-e"] = parseInt(row["Flg-e"]);
    row["Flg-g"] = parseInt(row["Flg-g"]);
    row["Flg-r"] = parseInt(row["Flg-r"]);
    row["Flg-d"] = parseInt(row["Flg-d"]);
    row["Flg-i"] = parseInt(row["Flg-i"]);
    row["Flg-s"] = parseInt(row["Flg-s"]);
    row["Flg-U"] = parseInt(row["Flg-U"]);
    row["Flg-&"] = parseInt(row["Flg-&"]);
    row["Flg-*"] = parseInt(row["Flg-*"]);
    row["Flg-*2"] = parseInt(row["Flg-*2"]);
    row["Start"] = parseInt(row["Start"]);
    row["Status"] = parseInt(row["Status"]);
    row["CON"] = parseInt(row["CON"]);
    row["ECO"] = parseInt(row["ECO"]);
    row["FIN"] = parseInt(row["FIN"]);
    row["INT"] = parseInt(row["INT"]);
    row["REQ"] = parseInt(row["REQ"]);
    row["RST"] = parseInt(row["RST"]);
    row["URN"] = parseInt(row["URN"]);
    row["URP"] = parseInt(row["URP"]);
    row["Classification"] = parseInt(row["Classification"]);
  });

  const ip_address_map = await d3.json("../resources/SWaT/unique_vals_ips_reversed_SWAT.json");
  const src_num = await d3.json("../resources/SWaT/2017_SWAT_src_ips.json");
  const dst_num = await d3.json("../resources/SWaT/2017_SWAT_dst_ips.json");
  const src_addresses = src_num.map(d => ip_address_map[d]);
  const dst_addresses = dst_num.map(d => ip_address_map[d]);
  drawScatter(dataset, ip_address_map, src_addresses, dst_addresses);
}


function drawScatter(data, ip_address_map, src_addresses, dst_addresses) {

  const margin = {top: 20, right: 20, bottom: 90, left: 10};
  const width = 1060 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

  const svg = d3.select(".main_area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //.attr("viewBox", [0, 0, width, height])
    //.attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const div = d3.select(".main_area")
    .append("div")
    	.attr("class", "tooltip")
    	.style("opacity", 0);
  var x1Accessor = d => ip_address_map[d.SrcAddr];

  var x2Accessor = d => ip_address_map[d.DstAddr];

  var y1Accessor = d => d.Sport;

  var y2Accessor = d => d.Dport;

  var r1Accessor = d => d.SrcBytes;

  var r2Accessor = d => d.DstBytes;

  var xScale1 = d3.scalePoint()
    .domain(src_addresses);

  var xScale2 = d3.scalePoint()
    .domain(dst_addresses);
    //.paddingInner(0.5);

  const y1Scale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.Sport));

  const y2Scale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Dport));

  const r1Scale = d3.scaleLinear()
          .domain(d3.extent(data, d=>d.SrcBytes))
          .range([5, 15])

  const r2Scale = d3.scaleLinear()
            .domain(d3.extent(data, d=>d.DstBytes))
            .range([5, 15])


  var config1 = {
    top: 10,
    left: 80,
    width: 450,
    height: height,
    dotClassName: "dot1",
    xLabel: "Source IP Address",
    tickSize: 0,
    domainOpacity: 0,
    xAxisOffset: 10,
    yAxisOffset: 10,
    yTicks: null,
    drawingName: "drawingAreaFirst",
    fill: "#ffb4d9"
  };

  var config2 = {
    top: 10,
    left: 600,
    width: 450,
    height: height,
    dotClassName: "dot2",
    xLabel: "Destination IP Address",
    tickSize: 0,
    domainOpacity: 0,
    xAxisOffset: 10,
    yAxisOffset: 10,
    yTicks: 3,
    drawingName: "drawingAreaSecond",
    fill: "#90bcf9"
  };

  // Draws a scatter plot
  var plot1 = scatterPlot(svg, config1, xScale1, y1Scale, r1Scale, x1Accessor, y1Accessor, r1Accessor, src_addresses);

  var plot2 = scatterPlot(svg, config2, xScale2, y2Scale, r2Scale, x2Accessor, y2Accessor, r2Accessor, dst_addresses);

  function scatterPlot(mysvg, cfg, x, y, r, xAcc, yAcc, rAcc, used_addresses) {

      var plot = mysvg.append("g")
      	.attr("class", "scatter-plot")
      	.attr("transform", "translate(" + [cfg.left, cfg.top] + ")");

      // plot.append("g")
      // 	.attr("class", "chart-background")
      // 	.attr("width", cfg.width)
      // 	.attr("height", cfg.height);

			x.range([0, cfg.width]);
      y.range([cfg.height, 0]);

      var xAxis = d3.axisBottom(x)
      	.ticks(used_addresses.length);
        //.tickSize(-cfg.height, 0)
        //.tickFormat("")
        //.orient("top")

      var xAxisGroup = plot.append("g")
      	.attr("transform", "translate(" + [0, cfg.height + cfg.xAxisOffset] + ")")
      	.call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      var xLabel = plot.append("g")
      	.append("text")
      	.attr("class", "axis-label")
      	.attr("text-anchor", "middle")
      	.attr("transform", "translate(" + [cfg.width / 2, cfg.height + 100] +")")
      	.text(cfg.xLabel);

      xAxisGroup.select(".domain").style("opacity", cfg.domainOpacity);

      var yAxis = d3.axisLeft(y.nice());

      var yAxisGroup = plot.append("g")
      	.attr("transform", "translate(" + [-cfg.yAxisOffset, 0] + ")")
      	.call(yAxis);

      yAxisGroup.select(".domain").style("opacity", cfg.domainOpacity);

      plot.append("g")
        .attr("class", cfg.drawingName);

      // var gridLinesX = plot.append("g")
      // 	.selectAll("line")
      // 	.data(x.ticks(cfg.xTicks).slice(1, -1))
      // 	.enter().append("line")
      // 		.attr("class", "grid-line")
      // 		.attr("x1", d => x(d))
      // 		.attr("y1", d => 0)
      // 		.attr("x2", d => x(d))
      // 		.attr("y2", d => cfg.height);

      // var gridLinesY = plot.append("g")
      // 	.selectAll("line")
      // 	.data(y.ticks(cfg.yTicks).slice(1, -1))
      // 	.enter().append("line")
      // 		.attr("class", "grid-line")
      // 		.attr("x1", d => 0)
      // 		.attr("y1", d => y(d))
      // 		.attr("x2", d => cfg.width)
      // 		.attr("y2", d => y(d));

      //addDots(dataset, plot, cfg, x, y, r, xAcc, yAcc, rAcc);
     // plot.append("g")
      return plot;

    }


    // function showLabel(d) {
    //   var coords = [d3.event.clientX, d3.event.clientY];
    //   var top = coords[1] + 30,
    //       left = coords[0] - 50;

    //   div.transition()
    //     .duration(200)
    //     .style("opacity", 1);

    //   div.html("<b>" + d.name + "</b></br>" +
    //           "Students: " + uniLookup[d.name].students + "</br>" +
    //           "Staff: " + uniLookup[d.name].nonAcademicStaff)
    //   	.style("top", top + "px")
    //   	.style("left", left + "px");
    // }

    // function moveLabel() {
    //   var coords = [d3.event.clientX, d3.event.clientY];

    //   var top = coords[1] + 30,
    //       left = coords[0] - 50;

    //   div.style("top", top + "px")
    //   	.style("left", left + "px");
    // }

    // function hideLabel(d) {
    // 	div.transition()
    //     .duration(200)
    //     .style("opacity", 0);
    // }
  var newData = data.filter(function(val, index, array){
    return val.StartTime.getTime() === data[0]["StartTime"].getTime();
  });
  console.log(newData);
  addDots(newData, plot1, config1, xScale1, y1Scale, r1Scale, x1Accessor, y1Accessor, r1Accessor);
  addDots(newData, plot2, config2, xScale2, y2Scale, r1Scale, x2Accessor, y2Accessor, r1Accessor);

  return svg;

}

function addDots(dataset, plot, cfg, x, y, r, xAcc, yAcc, rAcc) {
  //console.log(plot.selectAll(".drawingArea"));
  const t = plot.transition()
        .duration(750);
  plot
    .select("."+cfg.drawingName)
    .selectAll("circle")
    .data(dataset, d => d.StartTime.getTime() + d.SrcAddr + d.Sport + d.Dport + d.DstAddr)
    // .join("circle")
    //     .attr("class", function(d) {
    //       let startTime = d.StartTime.getTime()
    //       return cfg.dotClassName +" _"+ startTime + "_" + d.SrcAddr + "_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr
    //     })
    //     .attr("cx", function(d, i) {
    //       if (Math.random < 0.5) {
    //         return x(xAcc(d)) - (Math.random() * x.step());
    //       } else {
    //         return x(xAcc(d)) + (Math.random() * x.step());
    //       }
    //     })
    //     .attr("cy", d => y(yAcc(d)))
    //     .attr("r", d => 0)
    //     .call(enter => enter.transition(t)
    //           .attr("r", d => r(rAcc(d)))
    //          )
    //     .on("mouseover", function(event, d) {
    //       let startTime = d.StartTime.getTime()
    //       let className = "_" + startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
    //       d3.selectAll("circle." + className)
    //         .transition()
    //         .style("stroke-width", 2.5)
    //         .style("stroke", "black");
    //       showLabel(event, d, div);
    //     })
    //     .on("mouseout", function(event, d) {
    //       let startTime = "_" + d.StartTime.getTime()
    //       let className = startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
    //       d3.selectAll("circle." + className)
    //         .transition()
    //         .style("stroke-width", 0)
    //         .style("stroke", "none");
    //       hideLabel(div);
    //     })
    .join(
         enter => enter
            .append("circle")
            .attr("class", function(d) {
              let startTime = d.StartTime.getTime()
              return cfg.dotClassName +" _"+ startTime + "_" + d.SrcAddr + "_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr
            })
            .attr("cx", function(d, i) {
              return x(xAcc(d))
              // if (Math.random < 0.5) {
              //   return x(xAcc(d)) - (Math.random() * x.step());
              // } else {
              //   return x(xAcc(d)) + (Math.random() * x.step());
              // }
            })
            .attr("cy", d => y(yAcc(d)))
            .attr("r", 0)
            .call(enter => enter.transition(d3.transition().duration(750))
                      .attr("r", d => r(rAcc(d)))
                      .attr("fill", cfg.fill)
                  )
            .on("mouseover", function(event, d) {
              let startTime = d.StartTime.getTime();
              let className = "_" + startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
              d3.selectAll("circle." + className)
                .transition()
                .style("stroke-width", 2.5)
                .style("stroke", "black");
              showLabel(event, d);
            })
            .on("mouseout", function(event, d) {
              let startTime = "_" + d.StartTime.getTime();
              let className = startTime +"_" + d.SrcAddr +"_" + d.Sport +"_" + d.Dport +"_" + d.DstAddr;
              d3.selectAll("circle." + className)
                .transition()
                .style("stroke-width", 0)
                .style("stroke", "none");
              hideLabel();
            }).selection(),
            //.on("mousemove", moveLabel)
       update => update
                .attr("fill","yellow")
                .selection(),
       exit => exit
          .call(exit => exit.transition(d3.transition().duration(750))
              .attr("r", 0)
              .attr("fill", "black")
              .remove()
              )

         )

}

function showLabel(event, d) {
  //console.log(d);
  var coords = [event.clientX, event.clientY];
  var top = coords[1] + 30,
    left = coords[0] - 50;
  const div = d3.select(".tooltip");
  div.transition()
    .duration(200)
    .style("opacity", 1);

  div.html("<b>Source Port: </b>" + d.Sport + "<br />"
          + "<b>Destination Port: </b>" + d.Dport)
    .style("top", top + "px")
    .style("left", left + "px");
}

function hideLabel(div) {
  d3.select(".tooltip")
    .transition()
    .duration(200)
    .style("opacity", 0);
}

loadSwatData();
