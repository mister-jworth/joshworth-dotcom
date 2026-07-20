/*jslint */
/*global AdobeEdge: false, window: false, document: false, console:false, alert: false */
(function (compId) {

    "use strict";
    var im='images/',
        aud='media/',
        vid='media/',
        js='js/',
        fonts = {
            'lato, sans-serif': '<script src=\"http://use.edgefonts.net/lato:n9,i4,n1,i7,i9,n7,i1,i3,n4,n3:all.js\"></script>'        },
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [
        ],
        scripts = [
        ],
        symbols = {
            "stage": {
                version: "6.0.0",
                minimumCompatibleVersion: "5.0.0",
                build: "6.0.0.400",
                scaleToFit: "none",
                centerStage: "none",
                resizeInstances: false,
                content: {
                    dom: [
                        {
                            id: 'sailboat',
                            type: 'image',
                            rect: ['8.6%', '-147px', '70px', '95px', 'auto', 'auto'],
                            fill: ["rgba(0,0,0,0)",im+"sailboat.svg",'0px','0px']
                        },
                        {
                            id: 'sea',
                            type: 'rect',
                            rect: ['0px', '150px', '100%', '60.9%', 'auto', 'auto'],
                            opacity: '1',
                            fill: ["rgba(13,152,206,1)"],
                            stroke: [0,"rgba(0,0,0,1)","none"]
                        },
                        {
                            id: 'beach',
                            type: 'rect',
                            rect: ['0px', 'auto', '100%', '25%', 'auto', '0%'],
                            opacity: '1',
                            fill: ["rgba(224,205,153,1.00)"],
                            stroke: [0,"rgba(0,0,0,1)","none"]
                        },
                        {
                            id: 'title',
                            type: 'text',
                            rect: ['0px', '44%', '100%', '16.8%', 'auto', 'auto'],
                            opacity: '0',
                            text: "<p style=\"margin:0px\"><span style=\"font-size: 46px;\">unTIDE</span></p>",
                            align: "center",
                            font: ['lato, sans-serif', [18, "px"], "rgba(255,255,255,1.00)", "300", "none", "", "break-word", "normal"],
                            textStyle: ["", "", "", "10px", ""]
                        },
                        {
                            id: 'location-dark',
                            type: 'image',
                            rect: ['auto', 'auto', '30px', '35px', '10px', '13px'],
                            fill: ["rgba(0,0,0,0)",im+"location-dark.svg",'0px','0px']
                        },
                        {
                            id: 'Rectangle',
                            type: 'rect',
                            rect: ['0px', '0px', '100%', '100%', 'auto', 'auto'],
                            overflow: 'visible',
                            opacity: '0',
                            fill: ["rgba(0,142,204,1.00)"],
                            stroke: [0,"rgb(0, 0, 0)","none"]
                        },
                        {
                            id: 'menutext',
                            type: 'group',
                            rect: ['-4px', '24', '421', '550', 'auto', 'auto'],
                            overflow: 'visible',
                            opacity: '0',
                            c: [
                            {
                                id: 'location-text',
                                type: 'image',
                                rect: ['51px', '0px', '370px', '550px', 'auto', 'auto'],
                                fill: ["rgba(0,0,0,0)",im+"location-text.svg",'0px','0px']
                            },
                            {
                                id: 'markerarrow',
                                type: 'image',
                                rect: ['0px', '1px', '40px', '35px', 'auto', 'auto'],
                                fill: ["rgba(0,0,0,0)",im+"markerarrow.svg",'0px','0px']
                            }]
                        },
                        {
                            id: 'add-loc',
                            type: 'image',
                            rect: ['auto', 'auto', '40px', '35px', '4px', '19px'],
                            overflow: 'visible',
                            opacity: '0',
                            fill: ["rgba(0,0,0,0)",im+"add-loc.svg",'0px','0px']
                        },
                        {
                            id: 'Text',
                            type: 'text',
                            rect: ['0px', '10px', '100%', '53px', 'auto', 'auto'],
                            opacity: '0.000000',
                            text: "<p style=\"margin: 0px;\">​<span style=\"color: rgb(102, 226, 255);\">Enter a city or zip code</span></p>",
                            align: "center",
                            font: ['lato, sans-serif', [18, "px"], "rgba(255,255,255,1)", "300", "none", "normal", "break-word", "normal"],
                            textStyle: ["", "", "", "", "none"]
                        },
                        {
                            id: 'Rectangle2',
                            type: 'rect',
                            rect: ['28px', '51px', '89.3%', '40px', 'auto', 'auto'],
                            opacity: '0.000000',
                            fill: ["rgba(255,255,255,1.00)"],
                            stroke: [0,"rgb(0, 0, 0)","none"]
                        },
                        {
                            id: 'location-text2',
                            type: 'image',
                            rect: ['28px', '117px', '270px', '400px', 'auto', 'auto'],
                            opacity: '0.000000',
                            fill: ["rgba(0,0,0,0)",im+"location-text.svg",'0px','0px']
                        },
                        {
                            id: 'zip',
                            type: 'image',
                            rect: ['36px', '59px', '374px', '53px', 'auto', 'auto'],
                            opacity: '0',
                            fill: ["rgba(0,0,0,0)",im+"zip.svg",'0px','0px']
                        },
                        {
                            id: 'closeX',
                            type: 'image',
                            rect: ['auto', '10px', '23px', '23px', '10px', 'auto'],
                            opacity: '0',
                            fill: ["rgba(0,0,0,0)",im+"closeX.svg",'0px','0px']
                        },
                        {
                            id: 'locationlist-btn',
                            type: 'rect',
                            rect: ['auto', 'auto', '70px', '67px', '0px', '3px'],
                            cursor: 'pointer',
                            opacity: '0',
                            fill: ["rgba(0,142,204,1)"],
                            stroke: [0,"rgb(0, 0, 0)","none"]
                        },
                        {
                            id: 'addloc-btn',
                            type: 'rect',
                            rect: ['auto', 'auto', '1px', '67px', '1px', '3px'],
                            cursor: 'pointer',
                            opacity: '0',
                            fill: ["rgba(0,142,204,1)"],
                            stroke: [0,"rgb(0, 0, 0)","none"]
                        },
                        {
                            id: 'close-btn',
                            type: 'rect',
                            rect: ['auto', '1px', '75px', '53px', '0px', 'auto'],
                            cursor: 'pointer',
                            opacity: '0',
                            fill: ["rgba(0,142,204,1)"],
                            stroke: [0,"rgb(0, 0, 0)","none"]
                        },
                        {
                            id: 'Rectangle7',
                            type: 'rect',
                            rect: ['37px', '17px', '318px', '338px', 'auto', 'auto'],
                            cursor: 'pointer',
                            opacity: '0',
                            fill: ["rgba(0,142,204,1)"],
                            stroke: [0,"rgb(0, 0, 0)","none"]
                        },
                        {
                            id: 'Text2',
                            type: 'text',
                            rect: ['1px', '139px', '100%', '80px', 'auto', 'auto'],
                            opacity: '0',
                            text: "<p style=\"margin: 0px;\">​(primary wave / tide data UI)</p>",
                            align: "center",
                            font: ['lato, sans-serif', [18, "px"], "rgba(255,255,255,1)", "300", "none", "normal", "break-word", "normal"],
                            textStyle: ["", "", "", "", "none"]
                        }
                    ],
                    style: {
                        '${Stage}': {
                            isStage: true,
                            rect: ['null', 'null', '100%', '100%', 'auto', 'auto'],
                            overflow: 'hidden',
                            fill: ["rgba(71,210,252,1.00)"]
                        }
                    }
                },
                timeline: {
                    duration: 10724,
                    autoPlay: true,
                    labels: {
                        "wave": 6294,
                        "locations": 6658,
                        "addlocation": 8000
                    },
                    data: [
                        [
                            "eid63",
                            "scaleX",
                            2000,
                            2216,
                            "easeInCubic",
                            "${title}",
                            '1',
                            '1.68'
                        ],
                        [
                            "eid93",
                            "opacity",
                            0,
                            0,
                            "easeInCubic",
                            "${add-loc}",
                            '0',
                            '0'
                        ],
                        [
                            "eid102",
                            "opacity",
                            6658,
                            144,
                            "easeInCubic",
                            "${add-loc}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid111",
                            "opacity",
                            7926,
                            74,
                            "easeInCubic",
                            "${add-loc}",
                            '1',
                            '0'
                        ],
                        [
                            "eid26",
                            "left",
                            0,
                            5000,
                            "linear",
                            "${sailboat}",
                            '8.55%',
                            '18.78%'
                        ],
                        [
                            "eid53",
                            "left",
                            5000,
                            5724,
                            "linear",
                            "${sailboat}",
                            '18.78%',
                            '164.04%'
                        ],
                        [
                            "eid114",
                            "background-color",
                            7926,
                            74,
                            "easeInCubic",
                            "${Rectangle}",
                            'rgba(0,142,204,1.00)',
                            'rgba(2,115,178,1.00)'
                        ],
                        [
                            "eid87",
                            "top",
                            0,
                            0,
                            "easeInCubic",
                            "${title}",
                            '44%',
                            '44%'
                        ],
                        [
                            "eid80",
                            "top",
                            2000,
                            2216,
                            "easeInCubic",
                            "${title}",
                            '44%',
                            '16.9%'
                        ],
                        [
                            "eid169",
                            "width",
                            0,
                            0,
                            "easeInCubic",
                            "${add-loc}",
                            '40px',
                            '40px'
                        ],
                        [
                            "eid178",
                            "width",
                            6725,
                            0,
                            "easeInCubic",
                            "${Rectangle7}",
                            '318px',
                            '318px'
                        ],
                        [
                            "eid127",
                            "opacity",
                            8000,
                            20,
                            "easeInCubic",
                            "${zip}",
                            '0',
                            '1'
                        ],
                        [
                            "eid122",
                            "opacity",
                            8000,
                            20,
                            "easeInCubic",
                            "${location-text2}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid124",
                            "opacity",
                            8000,
                            20,
                            "easeInCubic",
                            "${Text}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid182",
                            "opacity",
                            6398,
                            102,
                            "easeInCubic",
                            "${Text2}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid184",
                            "opacity",
                            6500,
                            158,
                            "easeInCubic",
                            "${Text2}",
                            '1',
                            '0'
                        ],
                        [
                            "eid92",
                            "opacity",
                            0,
                            0,
                            "easeInCubic",
                            "${Rectangle}",
                            '0',
                            '0'
                        ],
                        [
                            "eid101",
                            "opacity",
                            6658,
                            144,
                            "easeInCubic",
                            "${Rectangle}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid86",
                            "top",
                            2000,
                            3000,
                            "easeInCubic",
                            "${sailboat}",
                            '76px',
                            '-147px'
                        ],
                        [
                            "eid46",
                            "height",
                            2000,
                            3000,
                            "easeInCubic",
                            "${sailboat}",
                            '74px',
                            '41px'
                        ],
                        [
                            "eid47",
                            "width",
                            2000,
                            3000,
                            "easeInCubic",
                            "${sailboat}",
                            '54px',
                            '30px'
                        ],
                        [
                            "eid123",
                            "opacity",
                            8000,
                            20,
                            "easeInCubic",
                            "${Rectangle2}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid176",
                            "width",
                            6738,
                            64,
                            "easeInCubic",
                            "${addloc-btn}",
                            '1px',
                            '70px'
                        ],
                        [
                            "eid154",
                            "opacity",
                            8000,
                            20,
                            "linear",
                            "${closeX}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid91",
                            "opacity",
                            0,
                            0,
                            "easeInCubic",
                            "${menutext}",
                            '0',
                            '0'
                        ],
                        [
                            "eid100",
                            "opacity",
                            6658,
                            144,
                            "easeInCubic",
                            "${menutext}",
                            '0.000000',
                            '1'
                        ],
                        [
                            "eid109",
                            "opacity",
                            7926,
                            74,
                            "easeInCubic",
                            "${menutext}",
                            '1',
                            '0'
                        ],
                        [
                            "eid64",
                            "scaleY",
                            2000,
                            2216,
                            "easeInCubic",
                            "${title}",
                            '1',
                            '1.68'
                        ],
                        [
                            "eid172",
                            "width",
                            6725,
                            13,
                            "easeInCubic",
                            "${locationlist-btn}",
                            '70px',
                            '1px'
                        ],
                        [
                            "eid85",
                            "top",
                            2000,
                            3000,
                            "easeInCubic",
                            "${sea}",
                            '150px',
                            '-106px'
                        ],
                        [
                            "eid57",
                            "opacity",
                            0,
                            500,
                            "easeOutQuad",
                            "${title}",
                            '0',
                            '1'
                        ],
                        [
                            "eid71",
                            "opacity",
                            2000,
                            2216,
                            "easeOutQuad",
                            "${title}",
                            '1',
                            '0'
                        ],
                        [
                            "eid34",
                            "height",
                            2000,
                            3307,
                            "easeInCubic",
                            "${beach}",
                            '25%',
                            '100.03%'
                        ]
                    ]
                }
            }
        };

    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);

    if (!window.edge_authoring_mode) AdobeEdge.getComposition(compId).load("opening_edgeActions.js");
})("EDGE-30496544");
