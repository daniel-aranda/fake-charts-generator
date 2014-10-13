Rickshaw.namespace('Rickshaw.Graph.Renderer.AnimatedArea');

Rickshaw.Graph.Renderer.AnimatedArea = Rickshaw.Class.create( Rickshaw.Graph.Renderer.Area, {

    name: 'animated_area',

    _rendered : false,
    animate : true,

    defaults: function($super) {

        return Rickshaw.extend( $super(), {
            unstack: false,
            fill: false,
            stroke: false,
            animate : false
        } );
    },

    createDOMElements : function(args){
        var graph = this.graph;
        var series = args.series || graph.series;

        var vis = args.vis || graph.vis;
        vis.selectAll('*').remove();

        // insert or stacked areas so strokes lay on top of areas
        var method = this.unstack ? 'append' : 'insert';

        var data = series
            .filter(function(s) { return !s.disabled; })
            .map(function(s) { return s.stack; });

        var nodes = vis.selectAll("path")
            .data(data)
            .enter()[method]("svg:g", 'g');

        nodes.append("svg:path")
            .attr("class", 'area')
            .attr("d", this.seriesPathFactory());

        if (this.stroke) {
            nodes.append("svg:path")
                .attr("d", this.seriesStrokeFactory())
                .attr("class", 'line');
        }

        vis.append("svg:g")
            .attr("class", 'item-renderer');

        var i = 0;
        series.forEach( function(series) {
            if (series.disabled) return;
            series.path = nodes[0][i++];
            this._styleSeries(series);
        }, this );

        this._rendered = true;
    },

    itemRenderer: function(serieIndex) {

        var graph = this.graph;

        var serie = graph.series[serieIndex];
        var d = serie.data;
        var dotSize = 5;
        var renderSerie = d3.select(this.graph.element).selectAll('.item-renderer');

        var dataFilter = d.filter( function(d) { return d.star; } );

        var icon = 'img/icons/star.png';

        _.each(dataFilter, function(item, index){
            var x = graph.x(item.x);
            var y = graph.y(item.y);
            var width = 22;
            var height = 20;

            var img_x = x - width * 0.5;
            var img_y = y - (height + 12);

            var circle = renderSerie
                .append("svg:circle")
                .style('pointer-events', 'all')
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 5)
                .attr("fill", 'white')
                .attr("stroke", serie.color)
                .attr("stroke-width", '3')
                .attr("class", 'campaign');
            if( true ){
                circle.
                    style('opacity', 0)
                    .transition()
                    .delay(300 + index * 600)
                    .duration(1000)
                    .style('opacity', 1);
            }

            item = renderSerie
                .append("svg:image")
                .style('pointer-events', 'all')
                .attr("xlink:href", icon)
                .attr("width", width)
                .attr("height", height)
                .attr("class", 'campaign');
            if( true ){
                item
                    .attr("x", img_x)
                    .attr("y", 0)
                    .attr("opacity", 0)
                    .transition()
                    .delay(300 + index * 600)
                    .duration(1000)
                    .attr("opacity", 1)
                    .attr("y", img_y);
            }else{
                item
                    .attr("x", img_x)
                    .attr("opacity", 1)
                    .attr("y", img_y);
            }

        }, this);

    },

    render: function(args) {

        args = args || {};
        var vis = args.vis || this.graph.vis;

        if( !this._rendered ){
            this.createDOMElements(args);
        }else{
            vis.selectAll('.x_ticks_d3').remove();
            vis.selectAll('.x_grid_d3').remove();
            vis.selectAll('.y_ticks').remove();
            vis.selectAll('.y_grid').remove();
            vis.selectAll('.y_grid').remove();
        }

        var data = this.graph.series
            .filter(function(s) { return !s.disabled; })
            .map(function(s) { return s.stack; });

        var areas = vis.selectAll("path.area")
            .data(data);

        if( this.animate ){
            areas = areas
                .transition()
                .duration(750);
        }

        areas.attr("d", this.seriesPathFactory());

        if (this.stroke) {
            var lines = vis.selectAll("path.line")
                .data(data);

            if( this.animate ){
                lines = lines
                    .transition()
                    .duration(750);
            }
            lines.attr("d", this.seriesStrokeFactory());
        }

        var seriesLength = this.graph.series.length;
        var itemRendererContainer = d3.select(this.graph.element).selectAll('.item-renderer');
        itemRendererContainer.selectAll('*').remove();

        for(var i=0; i<seriesLength; i++){
            this.itemRenderer(i);
        }

    },

    _styleSeries: function(series) {

        var result = Rickshaw.Graph.Renderer.Area.prototype._styleSeries.call(this, series);

        if( series.dotted ){
            d3.select(series.path).select('.line').style("stroke-dasharray", (series.dotted));
        }
        if( series.opacity ){
            d3.select(series.path).select('.area').style("opacity", series.opacity);
        }

        return result;

    }

} );