document.addEventListener("DOMContentLoaded", function() {
    const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRKThHlMqeFndU4d5T3tgVZ3AyPXep2aN0W_hkk-kkz9JNIhUjoBHPEz-Mf6l2bkHC5N_vFm580vP-K/pub?output=csv";

    async function fetchData() {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        let rows = data.split("\n").map(row => row.split(","));
        let salesData = rows.slice(1).map(row => ({
            quarter: row[0],
            sales: parseFloat(row[1])
        }));

        drawChart(salesData);
    }

    function drawChart(data) {
        const svg = d3.select("#salesChart"),
              width = 600, height = 300,
              margin = {top: 20, right: 20, bottom: 40, left: 60};

        svg.attr("width", width)
           .attr("height", height);

        const x = d3.scaleBand()
                    .domain(data.map(d => d.quarter))
                    .range([margin.left, width - margin.right])
                    .padding(0.2);

        const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.sales)])
                    .nice()
                    .range([height - margin.bottom, margin.top]);

        svg.append("g")
           .attr("transform", `translate(0,${height - margin.bottom})`)
           .call(d3.axisBottom(x));

        svg.append("g")
           .attr("transform", `translate(${margin.left},0)`)
           .call(d3.axisLeft(y));

        svg.selectAll(".bar")
           .data(data)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("x", d => x(d.quarter))
           .attr("y", d => y(d.sales))
           .attr("height", d => height - margin.bottom - y(d.sales))
           .attr("width", x.bandwidth())
           .attr("fill", "steelblue");
    }

    function handleStepEnter(response) {
        const step = response.element.dataset.step;

        d3.selectAll(".bar")
          .transition()
          .duration(500)
          .attr("fill", (d, i) => i == step ? "orange" : "steelblue");
    }

    const scroller = scrollama();
    scroller.setup({
        step: ".step",
        offset: 0.5,
        debug: false
    }).onStepEnter(handleStepEnter);

    fetchData();
});
