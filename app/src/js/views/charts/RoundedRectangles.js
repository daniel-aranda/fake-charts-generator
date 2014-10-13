$w.views.charts.RoundedRectangles = $w.views.charts.Abstract.extend({

    template : 'charts_donut',
    active: true,

    afterRender : function(){
        this._super();

        var mouse = [480, 250],
            count = 0;

        var svg = d3.select(this.$('svg')[0])
            .attr("width", 700)
            .attr("height", 500);

        var g = svg.selectAll("g")
            .data(d3.range(25))
            .enter().append("g")
            .attr("transform", "translate(" + mouse + ")");

        g.append("rect")
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x", -12.5)
            .attr("y", -12.5)
            .attr("width", 25)
            .attr("height", 25)
            .attr("transform", function(d, i) { return "scale(" + (1 - d / 25) * 20 + ")"; })
            .style("fill", d3.scale.category20c());

        g.datum(function(d) {
            return {center: [0, 0], angle: 0};
        });

        svg.on("mousemove", function() {
            mouse = d3.mouse(this);
        });

        d3.timer(function() {
            count++;
            g.attr("transform", function(d, i) {
                d.center[0] += (mouse[0] - d.center[0]) / (i + 5);
                d.center[1] += (mouse[1] - d.center[1]) / (i + 5);
                d.angle += Math.sin((count + i) / 10) * 7;
                return "translate(" + d.center + ")rotate(" + d.angle + ")";
            });
        });

    },

    changeData : function(){
//        Donut3D.transition(this.chartNode, this.randomData(), 230, 200, 50, 0.4);
    },

    randomData: function(){
//        return this.salesData.map(function(d){
//            return {label:d.label, value:1000*Math.random(), color:d.color};
//        });
    }

});