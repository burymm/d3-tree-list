var init = {
    x: 0,
    y: 0,
    element: null,
};

let container;
let isDragging = false;
let elementToDrag;
let sourceList;
let targetList;
let targetElement;
let linkList = [];

const lineColor = 'blue';

window.circles = [];
window.functions = [];

function getList() {
    return linkList;
}

function dragstarted(d) {
    //d3.select(this).raise().classed("active", true);
    this.classList.add('dragging');
    //console.log('drag', this);
    init.x = this.style.left;
    init.y = this.style.top;
    init.element = this;
    isDragging = true;

    sourceList = this.parentElement.parentElement;
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    this.style.left = d3.event.x;
    this.style.top = d3.event.y;
    // console.log('dragged', d3.event.x, d3.event.y);
}

function drawFunction() {
    const rectWidth = 200;
    const rectHeight = 100;
    const xStart = Math.abs(this.x1.baseVal.value + this.x2.baseVal.value) / 2 - (rectWidth / 2);
    const yStart = Math.abs(this.y1.baseVal.value + this.y2.baseVal.value) / 2 - ( rectHeight / 2);
    var rect = container.append("rect")
        .attr("x", xStart)
        .attr("y", yStart)
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .style('fill', 'yellow');

    container.append("text")
        .classed('data', true)
        .attr("x", xStart + rectWidth / 2)
        .attr("y", yStart + rectHeight / 2)
        .attr("fill", "#000")
        .style("stroke-width", 1)
        .style({"font-size": "18px", "z-index": "999999999"})
        .style("text-anchor", "middle")
        .text(function (d) {
            return "test";
        });

    d3.select(rect).data(rect).enter().append('text').text(function (d) {
        return d;
    });
    window.functions.push(rect);
    console.log('clicked line', d3.event, d3.select(this));
}

function drawLink(sourceElement, targetElement) {
    const sourceList = sourceElement.parentElement.parentElement;
    const arrowLength = 70;
    const x1 = Math.round(sourceList.clientLeft + sourceList.clientWidth) + arrowLength;
    const y1 = Math.round(parseInt(sourceElement.style.top));
    const x2 = Math.round(targetElement.offsetParent.offsetLeft) - arrowLength;
    const y2 = Math.round(targetElement.offsetTop) + window.scrollY  - 5;
    // const k = (y1 - y2) / (x1 - x2);
    // const b = y1 - k * x1;
    // const minX = Math.abs(x1 - x2) * 0.4;
    // const xn = Math.round(Math.round(Math.random() * (Math.abs(x1 - x2) + minX)) + x1 - minX);
    // const yn = Math.round(xn * k + b) - 20;
    var lineData = [{
        "x": x1 - arrowLength,
        "y": y1,
    },
        {
            'x': x1 + arrowLength,
            'y': y1
        },
        {
            "x": x2,
            "y": y2,
        }, {
            'x': x2 + arrowLength,
            'y': y2,
        }];

    var lineFunction = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("cardinal");

    var lineGraph = container.append("path")
        .attr("marker-end", "url(#triangle)")
        .attr("d", lineFunction(lineData))
        .attr("stroke", lineColor)
        .attr("stroke-width", 2)
        .attr("fill", "none");
}

function dragended(d) {
    this.style.left = init.x;
    this.style.top = init.y;
    this.classList.remove('dragging');
    isDragging = false;
    linkList.push({
        source: this.getAttribute('xpath'),
        target: targetElement.getAttribute('xpath'),
    });
    console.log('connection from', this, ' to ', targetElement);
    console.log('list', linkList);

    if (!!sourceList && !!targetList && sourceList !== targetList) {
        drawLink(init.element, targetElement);
    }
}

function mouseMoving(d) {
    if (isDragging) {
        elementToDrag = this;
        //console.log(this, 'mouseMoving', new Date(), d);
    }
}

function getElementByXpath(xpath, prefix) {
    return document.querySelector(`${prefix ? prefix + ' ' : ''}[xpath=${xpath.replace('\\', '\\\\')}]`);
}

function drawLinks(data) {
    data.forEach((item) => {
       drawLink(getElementByXpath(item.source, '#list1'), getElementByXpath(item.target, '#list2'));
    });
}


document.addEventListener('DOMContentLoaded', () => {
    container = d3.select("body").append("svg")
        .attr('class',  'container')
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

     // add arrows
    container.append("svg:defs").append("svg:marker")
        .attr("id", "triangle")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 30)
        .attr("markerHeight", 30)
        .attr("markerUnits","userSpaceOnUse")
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 12 6 0 12 3 6")
        .style("fill", lineColor);

   // drawTree();

    Promise.all([
        loadTarget(),
        loadSource(),
        loadLinks(),
    ]).then(([targetData, sourceData, linkData]) => {
        var targetContainer = d3.select("#list1").append("ul").classed("treelist", "true");

        var sourceContainer = d3.select("#list2").append("ul").classed("treelist", "true");

        drawTree(targetData, targetContainer);
        drawTree(sourceData, sourceContainer);
        setTimeout( () => {
            drawLinks(linkData);
        }, 1000);
        console.log('load from promise', targetData, sourceData, linkData);
    });
   // drawLinks();
});

function loadTarget() {
    return new Promise((resolve, reject) => {
        d3.json('data-r.json', function(err, data) {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
}

function loadSource() {
    return new Promise((resolve, reject) => {
        d3.json('data-r2.json', function(err, data) {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
}

function loadLinks() {
    return new Promise((resolve, reject) => {
        d3.json('links.json', function(err, data) {
            if (err) {
                reject(err);
            }

            resolve(data);
        });
    });
}

function drawTree(data, treeContainer) {
    var id = 0;
        var tree = d3.layout.treelist()
            .childIndent(10)
            .nodeHeight(30);


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
                .attr('xpath', function(d) {
                    return d.xpath || 'root';
                })
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
                        //console.log(this);
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


        const renderData = Object.assign({}, data);
        renderData.children = renderData.data;

        render(renderData, renderData, treeContainer);
}


