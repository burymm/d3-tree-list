var init = {
    x: 0,
    y: 0,
};

let container;
let isDragging = false;
let elementToDrag;

function dragstarted(d) {
    //d3.select(this).raise().classed("active", true);
    this.classList.add('dragging');
    console.log('drag', this);
    init.x = this.style.left;
    init.y = this.style.top;
    isDragging = true;
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
    console.log(elementToDrag, 'drag element', d, this);
}

function mouseMoving(d) {
    if (isDragging) {
        elementToDrag = this;
        //console.log(this, 'mouseMoving', new Date(), d);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    container = d3.select("body").append("svg")
        .attr("width", 800)
        .attr("height", 600);
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
                d3.select(this).classed("selected", true);
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
