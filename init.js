var init = {
    x: 0,
    y: 0,
};

let container;
let isDragging = false;
let elementToDrag;
let sourceList;
let targetList;
let targetElement;

window.circles = [];
window.functions = [];

function dragstarted(d) {
    //d3.select(this).raise().classed("active", true);
    this.classList.add('dragging');
    //console.log('drag', this);
    init.x = this.style.left;
    init.y = this.style.top;
    isDragging = true;

    sourceList = this.parentElement.parentElement;
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    this.style.left = d3.event.x;
    this.style.top = d3.event.y;
    // console.log('dragged', d3.event.x, d3.event.y);
}

function dragended(d) {
    // d3.select(this).classed("active", false);
    // console.log('dragended');
    this.style.left = init.x;
    this.style.top = init.y;
    this.classList.remove('dragging');
    isDragging = false;
    //console.log(elementToDrag, 'drag element', d, this);

    if (!!sourceList && !!targetList && sourceList !== targetList) {
        var circle = container.append("line")
            .attr("x1", sourceList.clientLeft + sourceList.clientWidth)
            .attr("y1", init.y)
            .attr("x2", targetElement.offsetParent.offsetLeft)
            .attr("y2", d3.event.sourceEvent.clientY)
            .attr("stroke-width", 10)
            .attr("stroke", "black");

        circle.on('click', function (e) {
            const rectSize = 10;
            const xStart = Math.abs(this.x1.baseVal.value - this.x2.baseVal.value) / 2;
            const yStart = Math.abs(this.y1.baseVal.value - this.y2.baseVal.value) / 2;
            var rect = container.append("rect")
                .attr("x", (xStart - rectSize) / 2)
                .attr("y", (this.y1.baseVal.value - yStart) - rectSize / 2)
                .attr("width", xStart + rectSize / 2)
                .attr("height", yStart + rectSize / 2)
                .style('fill', 'yellow');

            container.append("text")
                .classed('data', true)
                .attr("x", (xStart - rectSize) / 2 + 30)
                .attr("y", (this.y1.baseVal.value - yStart) - rectSize / 2 + 30)
                .attr("fill", "#000")
                .style("stroke-width", 1)
                .style({"font-size": "18px", "z-index": "999999999"})
                .style("text-anchor", "middle")
                .text(function (d) {
                    return "test";
                });

            // this.append('text')
            //     .attr("class", "text")
            //     .attr("text-anchor", "middle")
            //     .attr("dx", 0)
            //     .attr("dy", ".35em")
            //     .text("text");
            //
            // this.insert("rect","text")
            //     .attr("width", function(d){return d.bbox.width})
            //     .attr("height", function(d){return d.bbox.height})
            //     .style("fill", "yellow");

            d3.select(rect).data(rect).enter().append('text').text(function (d) {
                return d;
            });
            window.functions.push(rect);
            console.log('clicked line', d3.event, d3.select(this));
        });

        window.circles.push(circle);
    }
}

function mouseMoving(d) {
    if (isDragging) {
        elementToDrag = this;
        //console.log(this, 'mouseMoving', new Date(), d);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    container = d3.select("body").append("svg")
        .attr('class',  'container')
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
       /* .on('click', (e) => {
            console.log(e);
        })*/;
});

var id = 0;
d3.json("data.json", function (err, data) {
    var tree = d3.layout.treelist()
        .childIndent(10)
        .nodeHeight(30);
    var ul1 = d3.select("#list1").append("ul").classed("treelist", "true");

    var ul2 = d3.select("#list2").append("ul").classed("treelist", "true");

    function render(data, parent, element) {
        var nodes = tree.nodes(data),
            duration = 250;

        function toggleChildren(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else if (d._children) {
                d.children = d._children;
                d._children = null;
            }
        }

        var nodeEls = element.selectAll("li.node").data(nodes, function (d) {
            d.id = d.id || ++id;
            return d.id;
        });
        //entered nodes
        var entered = nodeEls.enter().append("li").classed("node", true)
            .style("top", parent.y + "px")
            .style("opacity", 0)
            .style("height", tree.nodeHeight() + "px")
            .on("click", function (d) {
                toggleChildren(d);
                render(data, d);
            })
            .on("mouseover", function (d) {
                targetElement = this;
                targetList = this.parentElement.parentElement;
                d3.select(this).classed("selected", true);
                if (!!targetList && !!sourceList && targetList !== sourceList) {
                    console.log(this);
                }
            })
            .on("mouseout", function (d) {
                d3.selectAll(".selected").classed("selected", false);
            });

        entered.call(d3.behavior.drag()
                .on("drag", dragged)
                .on('dragstart',  dragstarted)
                .on('dragend', dragended));

        var w = d3.select(window)
            .on("mousemove", mouseMoving);
        //add arrows if it is a folder
        entered.append("span").attr("class", function (d) {
            var icon = d.children ? " glyphicon-chevron-down"
                : d._children ? "glyphicon-chevron-right" : "";
            return "caret glyphicon " + icon;
        });
        //add icons for folder for file
        entered.append("span").attr("class", function (d) {
            var icon = d.children || d._children ? "glyphicon-folder-close"
                : "glyphicon-file";
            return "glyphicon " + icon;
        });
        //add text
        entered.append("span").attr("class", "filename")
            .html(function (d) {
                return d.name;
            });
        //update caret direction
        nodeEls.select("span.caret").attr("class", function (d) {
            var icon = d.children ? " glyphicon-chevron-down"
                : d._children ? "glyphicon-chevron-right" : "";
            return "caret glyphicon " + icon;
        });
        //update position with transition
        nodeEls.transition().duration(duration)
            .style("top", function (d) {
                return (d.y - tree.nodeHeight()) + "px";
            })
            .style("left", function (d) {
                return d.x + "px";
            })
            .style("opacity", 1);
        nodeEls.exit().remove();
    }

    render(data, data, ul1);
    render(data, data, ul2);

});
