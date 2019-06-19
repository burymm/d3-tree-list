const TreeListMapper = window.TreeListMapper;

document.addEventListener('DOMContentLoaded', () => {
    const instance = TreeListMapper();
    instance.initData({
        sourceData: {
            "id": "5cfe3e11d44bb7ff0940762d",
            "name": "pacs.008",
            "description": "tratata",
            "family": "isoxml",
            "version": 0,
            "data": [
                {
                    "name": "FIToFICstmrCdtTrf",
                    "minItems": 1,
                    "maxItems": 1,
                    "type": "FIToFICustomerCreditTransferV02",
                    "xpath": "FIToFICstmrCdtTrf",
                    "children": [
                        {
                            "name": "GrpHdr",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "FIToFICstmrCdtTrf\\GrpHdr"
                        },
                        {
                            "name": "AgglomerativeCluster",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "FIToFICstmrCdtTrf\\AgglomerativeCluster"
                        },
                        {
                            "name": "MergeEdge",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "FIToFICstmrCdtTrf\\MergeEdge"
                        }
                    ]
                }, {
                    "name": "optimization",
                    "minItems": 1,
                    "maxItems": 1,
                    "type": "FIToFICustomerCreditTransferV02",
                    "xpath": "optimization",
                    "children": [{
                        "name": "Easing",
                        "minItems": 1,
                        "maxItems": 1,
                        "type": "GroupHeader33",
                        "xpath": "optimization\\Easing"
                    }, {
                        "name": "ArrayInterpolator",
                        "minItems": 1,
                        "maxItems": 1,
                        "type": "GroupHeader33",
                        "xpath": "optimization\\ArrayInterpolator"
                    },
                        {
                            "name": "MaxFlowMinCut",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "MaxFlowMinCut",
                            "children": [
                                {
                                    "name": "RectangleInterpolator",
                                    "minItems": 1,
                                    "maxItems": 1,
                                    "type": "GroupHeader33",
                                    "xpath": "MaxFlowMinCut\\RectangleInterpolator"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        targetData: {
            "id": "5cfe3e11d44bb7ff0940762d",
            "name": "pacs.008",
            "description": "tratata",
            "family": "isoxml",
            "version": 0,
            "data": [
                {
                    "name": "FIToFICstmrCdtTrf",
                    "minItems": 1,
                    "maxItems": 1,
                    "type": "FIToFICustomerCreditTransferV02",
                    "xpath": "FIToFICstmrCdtTrf",
                    "children": [
                        {
                            "name": "GrpHdr",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "FIToFICstmrCdtTrf\\GrpHdr"
                        },
                        {
                            "name": "AgglomerativeCluster",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "FIToFICstmrCdtTrf\\AgglomerativeCluster"
                        },
                        {
                            "name": "MergeEdge",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "FIToFICstmrCdtTrf\\MergeEdge"
                        }
                    ]
                }, {
                    "name": "optimization",
                    "minItems": 1,
                    "maxItems": 1,
                    "type": "FIToFICustomerCreditTransferV02",
                    "xpath": "optimization",
                    "children": [{
                        "name": "Easing",
                        "minItems": 1,
                        "maxItems": 1,
                        "type": "GroupHeader33",
                        "xpath": "optimization\\Easing"
                    }, {
                        "name": "ArrayInterpolator",
                        "minItems": 1,
                        "maxItems": 1,
                        "type": "GroupHeader33",
                        "xpath": "optimization\\ArrayInterpolator"
                    },
                        {
                            "name": "MaxFlowMinCut",
                            "minItems": 1,
                            "maxItems": 1,
                            "type": "GroupHeader33",
                            "xpath": "MaxFlowMinCut",
                            "children": [
                                {
                                    "name": "RectangleInterpolator",
                                    "minItems": 1,
                                    "maxItems": 1,
                                    "type": "GroupHeader33",
                                    "xpath": "MaxFlowMinCut\\RectangleInterpolator"
                                },
                                {
                                    "name": "Comparison",
                                    "minItems": 1,
                                    "maxItems": 1,
                                    "type": "GroupHeader33",
                                    "xpath": "MaxFlowMinCut\\Comparison"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        linksData: [
            {
                "source": "MaxFlowMinCut\\RectangleInterpolator",
                "target": "MaxFlowMinCut"
            },
            {
                "source": "FIToFICstmrCdtTrf\\AgglomerativeCluster",
                "target": "FIToFICstmrCdtTrf\\AgglomerativeCluster"
            },
            {
                "source": "FIToFICstmrCdtTrf\\GrpHdr",
                "target": "optimization\\Easing"
            },
            {
                "source": "FIToFICstmrCdtTrf\\MergeEdge",
                "target": "FIToFICstmrCdtTrf\\GrpHdr"
            }
        ],
    });
});
