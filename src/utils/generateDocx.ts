import { before } from "node:test";

const {
    Document,
    Packer,
    Paragraph,
    Header,
    ImageRun,
    Footer,
    AlignmentType,
    TextRun,
    TableRow,
    TableCell,
    Table,
    WidthType,
    BorderStyle,
    ShadingType,
} = require('docx');
const fs = require('fs');

export function generateDocx(userName, asset) {
    asset.devices = JSON.parse(asset.devices)
    try {
        const headerImage = new ImageRun({
            type: 'png',
            data: fs.readFileSync("./public/PanasonicLogo.png"),
            transformation: {
                width: 150,
                height: 30,
            },
        });
        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 720, // 0.5 inch (720 twips)
                                right: 720, // 0.5 inch (720 twips)
                                bottom: 720, // 0.5 inch (720 twips)
                                left: 720, // 0.5 inch (720 twips)
                            },
                        },
                    },
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    children: [headerImage],
                                }),
                            ],
                        }),
                    },
                    children: [
                        generateTitle,
                        new Paragraph({
                            children: [
                                new TextRun({
                                    break: 2
                                }),
                            ]
                        }),

                        userinfotable(asset),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    break: 1
                                }),
                            ]
                        }),
                        deviceinfotable(asset),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    break: 1
                                }),
                            ]
                        }),
                        signTIColaboratortable(asset),
                        new Paragraph({
                            thematicBreak: true,
                            indent: {
                                left: 700, // Margen izquierdo (en twips)
                                right: 700, // Margen derecho (en twips)
                            },
                            children: [
                                new TextRun({
                                    break: 2
                                }),
                            ],

                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: "Exclusivo para salida de las instalaciones de Panasonic Centroamericana S.A",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                            ],
                            spacing: {
                                before: 600,
                                after: 150, // Margen inferior en TWIP (1/20 de un punto)
                            },
                        }),
                        authorizations(asset),
                        new Paragraph({
                        }),
                        signAuthorizations(),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: "               Panasonic Centroamericana, S.A.",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                            ],
                            spacing: {
                                before: 400,
                            },
                        }),
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [
                                new TextRun({
                                    text: "               Registro: RIF09X01   Versión 1",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                            ],
                        }),
                    ],
                    footers: {
                        default: new Footer({
                            children: [new Paragraph("PANASONIC")],
                        }),
                    },

                },
            ],
        });
        const documentName = `${Date.now()}-AssetDocument-${userName}.docx`;
        const documentPath = `../uploads/assetsRequest/documents/`;
        
        // Verificar si la ruta existe, si no existe, crearla
        if (!fs.existsSync(documentPath)) {
          fs.mkdirSync(documentPath, { recursive: true });
        }
        
        Packer.toBuffer(doc).then((buffer) => {
          fs.writeFileSync(`${documentPath}${documentName}`, buffer);
        });

        return { documentName: documentName, isPassed: true }
    } catch (error) {
        console.log(error)
        return { documentName: null, isPassed: false }
    }
}

const generateTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
        before: 10,
        after: 10,
    },
    children: [
        new TextRun({
            text: "PANASONIC CENTROAMERICANA S.A",
            font: 'Calibri (Body)',
            size: 28,
            bold: true,
            color: '0047AB', // Azul fuerte
        }),
        new TextRun({
            text: "SALIDA DE EQUIPO ELECTRÓNICO (LAPTOPS, OTROS)",
            font: 'Calibri (Body)',
            size: 28,
            bold: true,
            color: '0047AB', // Azul fuerte
            break: 1
        })
    ]
})

function userinfotable(data) {
    const dateOfLeaving = new Date(data.dateOfLeaving)
    const return_Date = new Date(data.return_Date)
    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            top: 50,
                            left: 200,
                            bottom: 50,
                        },
                        borders: {
                            bottom: { style: BorderStyle.NIL },
                            right: { style: BorderStyle.NIL }
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Nombre del colaborador: ${data.collaboratorName}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                    }),
                    new TableCell({
                        margins: {
                            left: 100,
                        },
                        borders: {
                            bottom: { style: BorderStyle.NIL },
                            left: { style: BorderStyle.NIL },
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Departamento: ${data.workArea}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL },
                            bottom: { style: BorderStyle.NIL },
                            right: { style: BorderStyle.NIL }
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Nº de Activo: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                                ...data.devices.flatMap((device, index) => [
                                    index !== 0
                                        ? new TextRun({
                                            text: ", ",
                                            font: "Calibri (Body)",
                                            size: 22,
                                        })
                                        : null,
                                    new TextRun({
                                        text: `${device.assetPlateNumber}`,
                                        font: "Calibri (Body)",
                                        size: 22,
                                    })
                                ]).filter(Boolean)
                            ]
                        })],
                        alignment: AlignmentType.LEFT,
                    }),
                    new TableCell({
                        margins: {
                            left: 100,
                            bottom: 50,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL },
                            bottom: { style: BorderStyle.NIL },
                            left: { style: BorderStyle.NIL },
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Fecha de salida: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                                new TextRun({
                                    text: `${dateOfLeaving.getDate().toString().padStart(2, '0')}/${(dateOfLeaving.getMonth() + 1).toString().padStart(2, '0')}/${dateOfLeaving.getFullYear()}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: false,
                                }),
                            ]
                        })],
                        alignment: AlignmentType.LEFT,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL },
                            bottom: { style: BorderStyle.NIL },
                            right: { style: BorderStyle.NIL }
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Gerente del área: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                                new TextRun({
                                    text: `${data.managerArea}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: false,
                                }),
                            ]
                        })],
                        alignment: AlignmentType.LEFT,
                    }),
                    new TableCell({
                        margins: {
                            left: 100,
                            bottom: 50,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL },
                            bottom: { style: BorderStyle.NIL },
                            left: { style: BorderStyle.NIL },
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Tipo de salida: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                                new TextRun({
                                    text: `${data.outputType}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: false,
                                }),
                            ]
                        })],
                        alignment: AlignmentType.LEFT,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL },
                            bottom: { style: BorderStyle.NIL },
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Motivo de salida: ${data.reasonForLeaving}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                            ]
                        })],
                        alignment: AlignmentType.LEFT,
                        columnSpan: 2, // Esta celda se expande sobre tres columnas
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        borders: {
                            top: { style: BorderStyle.NIL },
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Fecha de regreso: ${return_Date.getDate().toString().padStart(2, '0')}/${(return_Date.getMonth() + 1).toString().padStart(2, '0')}/${return_Date.getFullYear()}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                            ]
                        })],
                        alignment: AlignmentType.LEFT,
                        columnSpan: 2, // Esta celda se expande sobre tres columnas

                    }),
                ],
            }),
        ],
    });
}

function deviceinfotable(data) {
    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            top: 50,
                            bottom: 100,
                        },
                        width: {
                            size: 1200,
                            type: WidthType.DXA,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Cantidad",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                    new TableCell({
                        margins: {
                            top: 50,
                            bottom: 100,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Descripción",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                ],
            }),
            ...data.devices.map((device, index) => {
                return new TableRow({
                    children: [
                        new TableCell({
                            margins: {
                                top: 25,
                                bottom: 25,
                            },
                            children: [new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "1",
                                        font: "Calibri (Body)",
                                        size: 22,
                                        bold: true,
                                    }),
                                ],
                                alignment: AlignmentType.CENTER,
                            })],
                        }),
                        new TableCell({
                            margins: {
                                top: 25,
                                left: 100,
                                bottom: 25,
                            },
                            children: [new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `${device.deviceBrand} - ${device.deviceModel} - ${device.deviceSerialNumber}`,
                                        font: "Calibri (Body)",
                                        size: 22,
                                    }),
                                ]
                            })],
                            alignment: AlignmentType.LEFT,
                        }),
                    ],
                });
            }),
        ],
    });
}
function signTIColaboratortable(data) {
    return new Table({
        alignment: AlignmentType.CENTER,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: {
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Autorización IT",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: { // Agrega fondo azul
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Colaborador",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    bold: true,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                ],
            }),
        ],
    });
}

function authorizations(data) {
    const dateOfLeaving = new Date(data.dateOfLeaving)
    const return_Date = new Date(data.return_Date)
    return new Table({
        alignment: AlignmentType.CENTER,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 9000,
                            type: WidthType.DXA,
                        },
                        shading: {
                            fill: "244072",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Autorizaciones",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                        columnSpan: 2,
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Nombre del colaborador: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                                new TextRun({
                                    text: `${data.collaboratorName}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                        columnSpan: 2,
                    }),

                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Motivo de salida: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                                new TextRun({
                                    text: `${data.reasonForLeaving}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                        columnSpan: 2,
                    }),

                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Equipo : ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                                new TextRun({
                                    text: "(Marca - Modelo - Número de serie): ",
                                    font: "Calibri (Body)",
                                    size: 14,
                                }),
                                ...data.devices.flatMap((device, index, array) => {
                                    const deviceInfo = `${device.deviceBrand} - ${device.deviceModel} - ${device.deviceSerialNumber}`;

                                    if (array.length === 1) {
                                        // Si solo hay un dispositivo, no se usan paréntesis
                                        return [
                                            new TextRun({
                                                text: deviceInfo,
                                                font: "Calibri (Body)",
                                                size: 22,
                                            })
                                        ];
                                    } else {
                                        // Si hay más de un dispositivo, se usan paréntesis y comas
                                        return [
                                            new TextRun({
                                                text: "(",
                                                font: "Calibri (Body)",
                                                size: 22,
                                            }),
                                            new TextRun({
                                                text: deviceInfo,
                                                font: "Calibri (Body)",
                                                size: 22,
                                            }),
                                            new TextRun({
                                                text: ")",
                                                font: "Calibri (Body)",
                                                size: 22,
                                            }),
                                            index < array.length - 1
                                                ? new TextRun({
                                                    text: ", ",
                                                    font: "Calibri (Body)",
                                                    size: 22,
                                                })
                                                : null
                                        ];
                                    }
                                }).filter(Boolean)
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                        columnSpan: 2,
                    }),

                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        borders: {
                            right: { style: BorderStyle.NIL },
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Fecha de salida: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                                new TextRun({
                                    text: `${dateOfLeaving.getDate().toString().padStart(2, '0')}/${(dateOfLeaving.getMonth() + 1).toString().padStart(2, '0')}/${dateOfLeaving.getFullYear()}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                    }),
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        borders: {
                            left: { style: BorderStyle.NIL },
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Fecha de regreso: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                                new TextRun({
                                    text: `${return_Date.getDate().toString().padStart(2, '0')}/${(return_Date.getMonth() + 1).toString().padStart(2, '0')}/${return_Date.getFullYear()}`,
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                    }),

                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            left: 200,
                            bottom: 50,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Número de activo: ",
                                    font: "Calibri (Body)",
                                    size: 22,
                                }),
                                ...data.devices.flatMap((device, index) => [
                                    index !== 0
                                        ? new TextRun({
                                            text: ", ",
                                            font: "Calibri (Body)",
                                            size: 22,
                                        })
                                        : null,
                                    new TextRun({
                                        text: `${device.assetPlateNumber}`,
                                        font: "Calibri (Body)",
                                        size: 22,
                                    })
                                ]).filter(Boolean)
                            ],
                            alignment: AlignmentType.LEFT,
                        })],
                        columnSpan: 2,
                    }),

                ],
            }),

        ],
    });
}
function signAuthorizations() {
    return new Table({
        alignment: AlignmentType.CENTER,
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: {
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "IT",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: { // Agrega fondo azul
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Responsable de activos fijos",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: { // Agrega fondo azul
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Gerente del área",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: {
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Gerente Contable",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: { // Agrega fondo azul
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Gerente General - Director",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                    new TableCell({
                        width: {
                            size: 3000,
                            type: WidthType.DXA,
                        },
                        shading: { // Agrega fondo azul
                            fill: "2d508f",
                            type: ShadingType.CLEAR,
                        },
                        children: [new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Seguridad",
                                    font: "Calibri (Body)",
                                    size: 22,
                                    color: "FFFFFF",
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                        })],
                    }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                    new TableCell({
                        margins: {
                            bottom: 800,
                        },
                        children: [new Paragraph({
                        })],
                    }),
                ],
            }),
        ],
    })
} 