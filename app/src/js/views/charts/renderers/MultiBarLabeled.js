Rickshaw.namespace('Rickshaw.Graph.Renderer.MultiBarLabeled');

Rickshaw.Graph.Renderer.MultiBarLabeled = Rickshaw.Class.create( Rickshaw.Graph.Renderer.Bar, {

    name : 'multi-bar-labeled',

    render : function(args){

        if( this.unstack !== true ){
            throw new Error('Multi Bar does not support stacked Bars');
        }

        args = args || {};
        var graph = this.graph;

        var result = this.customRenderer(args);

        var vis = args.vis || graph.vis;

        vis.insert("svg:g", ':first-child')
            .attr("class", 'skin-background');
        vis.append("svg:g")
            .attr("class", 'item-renderer');

        var seriesLength = this.graph.series.active().length;

        this.xSkins = {};
        for(var i=0; i<seriesLength; i++){
            this.itemRenderer(i);
        }

        return result;
    },

    customRenderer : function(args){
        args = args || {};

        var graph = this.graph;
        var series = args.series || graph.series;

        var vis = args.vis || graph.vis;
        vis.selectAll('*').remove();

        var barWidth = this.barWidth(series.active()[0]);
        var barXOffset = 0;

        var activeSeriesCount = series.filter( function(s) { return !s.disabled; } ).length;
        var seriesBarWidth = this.unstack ? barWidth / activeSeriesCount : barWidth;

        var transform = function(d) {
            // add a matrix transform for negative values
            var matrix = [ 1, 0, 0, (d.y < 0 ? -1 : 1), 0, (d.y < 0 ? graph.y.magnitude(Math.abs(d.y)) * 2 : 0) ];
            return "matrix(" + matrix.join(',') + ")";
        };

        series.forEach( function(series) {

            if (series.disabled) return;

            var barWidth = this.barWidth(series);

            var nodes = vis.selectAll("path")
                .data(series.stack.filter( function(d) { return d.y !== null; } ))
                .enter().append("svg:rect")
                .attr("rx", 3)
                .attr("ry", 3)
                .attr("x", function(d) { return graph.x(d.x) + barXOffset + 3; })
                .attr("y", function(d) { return -30 + (graph.y(d.y0 + Math.abs(d.y))) * (d.y < 0 ? -1 : 1 ); })
                .attr("width", seriesBarWidth - 6)
                .attr("height", _.bind(this.calculateHeight, this))
                .attr("transform", transform);

            Array.prototype.forEach.call(nodes[0], function(n) {
                n.setAttribute('fill', series.color);
            } );

            if (this.unstack) barXOffset += seriesBarWidth;

        }, this );
    },

    calculateHeight : function(d){
        var graph = this.graph;
        var height = graph.y.magnitude(Math.abs(d.y));
        height += 30;

        return height;
    },

    itemRenderer : function(serieIndex){
        var graph = this.graph;
        var series = graph.series.active();
        var serie = series[serieIndex];
        var d = serie.data;
        var renderSerie = d3.select(graph.element).selectAll('.item-renderer');
        var skinBackground = d3.select(graph.element).selectAll('.skin-background');
        var barWidth = this.barWidth(serie);
        var seriesBarWidth = barWidth / series.length;
        this.xSkins = this.xSkins || {};

        skinBackground.append('svg:line')
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", graph.height)
            .attr('stroke', '#b1b1b1')
            .style('stroke-width', 1)
            .style("stroke-dasharray", ("3, 3"));

        _.each(d, function(item, index){
            var x = graph.x(item.x);
            var y = graph.y(item.y);

            if( !graph.hideSerieName ){
                renderSerie.append("text")
                    .attr("x", x + seriesBarWidth * serieIndex + seriesBarWidth / 2)
                    .attr("y", graph.height - 10)
                    .attr("font-size", "20px")
                    .style("width", seriesBarWidth)
                    .style("fill", "white")
                    .style("text-anchor", "middle")
                    .text(serie.name);
            }

            renderSerie.append("text")
                .attr("x", x + seriesBarWidth * serieIndex + seriesBarWidth / 2)
                .attr("y", y - 35)
                .attr("font-size", "16px")
                .style("width", seriesBarWidth)
                .style("fill", serie.color)
                .style("font-weight", "bold")
                .style("text-anchor", "middle")
                .text(item.y);

            if( !this.xSkins['skin_' + index] ){
                this.xSkins['skin_' + index] = true;
                skinBackground.append('svg:line')
                    .attr("x1", x + barWidth + 5)
                    .attr("x2", x + barWidth + 5)
                    .attr("y1", 0)
                    .attr("y2", graph.height)
                    .attr('stroke', '#b1b1b1')
                    .style('stroke-width', 1)
                    .style("stroke-dasharray", ("3, 3"));

                skinBackground.append("text")
                    .attr("x", x + barWidth / 2)
                    .attr("y", 20)
                    .attr("font-size", "16px")
                    .style("width", barWidth)
                    .style("fill", '#3c3c3c')
                    .style("text-anchor", "middle")
                    .text(graph.groups[index]);
            }

        }, this);

    }

});