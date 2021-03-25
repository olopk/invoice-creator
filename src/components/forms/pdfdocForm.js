import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from "../../assets/logo64base";
import num2word from "../../utils/num2word";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const createPDF = (props) => {
  const {
    invoice_nr,
    receipt_nr,
    pay_method,
    pay_date,
    total_price,
    date,
    customer_nip,
    customer_city,
    customer_street,
    customer_name,
    order,
  } = props;

  const DocName = invoice_nr ? `FV_${invoice_nr}` : `Paragon_${receipt_nr}`;

  let pay_methodParsed;

  if (pay_method === "transfer") {
    pay_methodParsed = "przelew";
  } else if (pay_method === "card") {
    pay_methodParsed = "karta";
  } else if (pay_method === "cash") {
    pay_methodParsed = "gotówka";
  }

  const items = order.map((el, index) => {
    return [
      { text: `${index + 1}`, style: "tableRow" },
      { text: `${el.product}` },
      { text: `szt. `, style: "tableRow" },
      { text: `${el.quantity}`, style: "tableRow" },
      { text: `${el.price_gross}`, style: "tableRow" },
      { text: `${el.vat === 0 ? "zw." : el.vat}`, style: "tableRow" },
      { text: `${el.total_price_net}`, style: "tableRow" },
      { text: `${el.total_price_gross} `, style: "tableRow" },
    ];
  });

  const items2 = order.map((el, index) => {
    return [
      { text: `${index + 1}`, style: "tableRow" },
      { text: `${el.product}` },
      { text: `szt. `, style: "tableRow" },
      { text: `${el.quantity}`, style: "tableRow" },
      { text: `${el.price_gross}`, style: "tableRow" },
      { text: `${el.vat === 0 ? "zw." : el.vat}`, style: "tableRow" },
      { text: `${el.total_price_net}`, style: "tableRow" },
      { text: `${el.total_price_gross} `, style: "tableRow" },
    ];
  });

  let detailTab = [
    [
      { text: "Stawka VAT", style: "tableHeaderSM" },
      { text: "Wartość netto", style: "tableHeaderSM" },
      { text: "Kwota VAT", style: "tableHeaderSM" },
      { text: "Wartość brutto", style: "tableHeaderSM" },
    ],
    [
      { text: `zw.`, style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: 0, style: "tableRowSM" },
    ],
    [
      { text: `8%`, style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: 0, style: "tableRowSM" },
    ],
    [
      { text: `23%`, style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: 0, style: "tableRowSM" },
    ],
    [
      { text: "Razem", style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: 0.0, style: "tableRowSM" },
      { text: `${total_price}`, style: "tableRowSM" },
    ],
  ];

  order.forEach((el, index) => {
    if (el.vat === 0) {
      detailTab[1][1].text += el.total_price_net;
      // detailTab[1][2].text += el.total_price_gross - el.total_price_net;
      detailTab[1][3].text += el.total_price_gross;
    } else if (el.vat === 8) {
      detailTab[2][1].text =
        Math.round(
          (parseFloat(detailTab[2][1].text) + el.total_price_net) * 100
        ) / 100;
      detailTab[2][2].text =
        Math.round(
          (parseFloat(detailTab[2][2].text) +
            (el.total_price_gross - el.total_price_net)) *
            100
        ) / 100;
      detailTab[2][3].text =
        Math.round(
          (parseFloat(detailTab[2][3].text) + el.total_price_gross) * 100
        ) / 100;
    } else if (el.vat === 23) {
      detailTab[3][1].text =
        Math.round(
          (parseFloat(detailTab[3][1].text) + el.total_price_net) * 100
        ) / 100;
      detailTab[3][2].text =
        Math.round(
          (parseFloat(detailTab[3][2].text) +
            (el.total_price_gross - el.total_price_net)) *
            100
        ) / 100;
      detailTab[3][3].text =
        Math.round(
          (parseFloat(detailTab[3][3].text) + el.total_price_gross) * 100
        ) / 100;
    }
    detailTab[4][1].text += el.total_price_net;
    detailTab[4][2].text =
      Math.round(
        (detailTab[2][2].text +
          detailTab[3][3].text +
          (el.total_price_gross - el.total_price_net)) *
          100
      ) / 100;
  });

  let sellDocType = `Faktura nr ${invoice_nr}`;
  if (props.receipt_nr) {
    sellDocType = `Dokument sprzedażowy nr ${receipt_nr}`;
  }

  var dd = {
    content: [
      {
        columns: [
          [
            { image: logo, width: 80 },
            { text: `Sprzedawca`, style: `header`, margin: [0, 10, 0, 10] },
            { text: `OPTYK Barbara Pałosz` },
            { text: `ul. Długosza 37, 77-300 Człuchów` },
            { text: `NIP: 843-152-07-60` },
            { text: `PKO BP: 65 1020 4665 0000 3302 0042 9027` },
          ],
          [
            {
              table: {
                widths: ["*"],
                body: [
                  [{ text: sellDocType }],
                  [{ text: `Data wystawienia: ${date.format("YYYY-MM-DD")}` }],
                  [
                    {
                      text: `Termin płatności: ${
                        pay_date
                          ? pay_date.format("YYYY-MM-DD")
                          : date.format("YYYY-MM-DD")
                      }`,
                    },
                  ],
                  [{ text: `Typ płatności: ${pay_methodParsed}` }],
                ],
              },
            },
            { text: `Nabywca`, style: `header`, margin: [0, 32, 0, 10] },
            { text: customer_name ? `${customer_name}` : null },
            { text: customer_street ? `${customer_street}` : null },
            { text: customer_city ? `${customer_city}` : null },
            { text: customer_nip ? `NIP: ${customer_nip}` : null },
          ],
        ],
        columnGap: 100,
      },
      {
        style: "tableExample",
        table: {
          widths: [15, "*", 20, 20, 40, 30, 60, 60],
          body: [
            [
              { text: `Lp.`, style: "tableHeader" },
              { text: `Nazwa`, style: "tableHeader" },
              { text: `Jedn.`, style: "tableHeader" },
              { text: `Ilość`, style: "tableHeader" },
              { text: `Cena brutto`, style: "tableHeader" },
              { text: `Stawka VAT`, style: "tableHeader" },
              { text: `Wartość netto`, style: "tableHeader" },
              { text: `Wartość brutto`, style: "tableHeader" },
            ],
            ...items,
          ],
        },
      },
      {
        columns: [
          {
            table: {
              //   widths: ["*"],
              body: [{}],
            },
          },
          [
            {
              columns: [
                [
                  { text: "Zapłacono" },
                  { text: "Do zapłaty" },
                  { text: "Razem" },
                ],
                [
                  {
                    text: `${
                      pay_method === "transfer" ? "0.00" : total_price
                    } PLN`,
                    alignment: "right",
                  },
                  {
                    text: `${
                      pay_method === "transfer" ? total_price : "0.00"
                    } PLN`,
                    alignment: "right",
                  },
                  { text: `${total_price} PLN`, alignment: "right" },
                ],
              ],
            },
            { text: "Słownie", alignment: "right" },
            { text: `${num2word(total_price)}`, alignment: "right" },
          ],
        ],
        margin: [0, 0, 0, 14],
      },
      {
        text:
          "UWAGI: SPRZEDAWCA ZWOLNIONY PODMIOTOWO Z PODATKU OD TOWARÓW I USŁUG [ DOSTAWA TOWARÓW LUB ŚWIADCZENIE USŁUG ZWOLNIONE NA PODSTAWIE ART.113 UST.1 (ALBO UST. 9) USTAWY Z DNIA 11 MARCA 2004 R. O PODATKU OD TOWARÓW I USŁUG DZ.U. Z 2011 R. NR 177 ,POZ 1054,Z PÓŹN.ZM.)",
        fontSize: 7,
      },
      {
        margin: [0, 40, 0, 20],
        fontSize: 7,
        alignment: "center",
        columns: [
          [
            {
              text: "......................................... ",
              fontSize: 10,
            },
            { text: "Imię i nazwisko osoby uprawnionej " },
            { text: "do wystawiania faktury" },
          ],
          [
            {
              text: ".......................................... ",
              fontSize: 10,
            },
            { text: "Imię i nazwisko osoby uprawnionej " },
            { text: "do odbioru faktury" },
          ],
        ],
      },
      {
        columns: [
          [
            { image: logo, width: 80 },
            { text: `Sprzedawca`, style: `header`, margin: [0, 10, 0, 10] },
            { text: `OPTYK Barbara Pałosz` },
            { text: `ul. Długosza 37, 77-300 Człuchów` },
            { text: `NIP: 843-152-07-60` },
            { text: `PKO BP: 65 1020 4665 0000 3302 0042 9027` },
          ],
          [
            {
              table: {
                widths: ["*"],
                body: [
                  [{ text: sellDocType }],
                  [{ text: `Data wystawienia: ${date.format("YYYY-MM-DD")}` }],
                  [
                    {
                      text: `Termin płatności: ${
                        pay_date
                          ? pay_date.format("YYYY-MM-DD")
                          : date.format("YYYY-MM-DD")
                      }`,
                    },
                  ],
                  [{ text: `Typ płatności: ${pay_methodParsed}` }],
                ],
              },
            },
            { text: `Nabywca`, style: `header`, margin: [0, 32, 0, 10] },
            { text: customer_name ? `${customer_name}` : null },
            { text: customer_street ? `${customer_street}` : null },
            { text: customer_city ? `${customer_city}` : null },
            { text: customer_nip ? `NIP: ${customer_nip}` : null },
          ],
        ],
        columnGap: 100,
      },
      {
        style: "tableExample",
        table: {
          widths: [15, "*", 20, 20, 40, 30, 60, 60],
          body: [
            [
              { text: `Lp.`, style: "tableHeader" },
              { text: `Nazwa`, style: "tableHeader" },
              { text: `Jedn.`, style: "tableHeader" },
              { text: `Ilość`, style: "tableHeader" },
              { text: `Cena brutto`, style: "tableHeader" },
              { text: `Stawka VAT`, style: "tableHeader" },
              { text: `Wartość netto`, style: "tableHeader" },
              { text: `Wartość brutto`, style: "tableHeader" },
            ],
            ...items2,
          ],
        },
      },
      {
        columns: [
          {
            table: {
              //   widths: ["*"],
              body: [{}],
            },
          },
          [
            {
              columns: [
                [
                  { text: "Zapłacono" },
                  { text: "Do zapłaty" },
                  { text: "Razem" },
                ],
                [
                  {
                    text: `${
                      pay_method === "transfer" ? "0.00" : total_price
                    } PLN`,
                    alignment: "right",
                  },
                  {
                    text: `${
                      pay_method === "transfer" ? total_price : "0.00"
                    } PLN`,
                    alignment: "right",
                  },
                  { text: `${total_price} PLN`, alignment: "right" },
                ],
              ],
            },
            { text: "Słownie", alignment: "right" },
            { text: `${num2word(total_price)}`, alignment: "right" },
          ],
        ],
        margin: [0, 0, 0, 14],
      },
      {
        text:
          "UWAGI: SPRZEDAWCA ZWOLNIONY PODMIOTOWO Z PODATKU OD TOWARÓW I USŁUG [ DOSTAWA TOWARÓW LUB ŚWIADCZENIE USŁUG ZWOLNIONE NA PODSTAWIE ART.113 UST.1 (ALBO UST. 9) USTAWY Z DNIA 11 MARCA 2004 R. O PODATKU OD TOWARÓW I USŁUG DZ.U. Z 2011 R. NR 177 ,POZ 1054,Z PÓŹN.ZM.)",
        fontSize: 7,
      },
      {
        margin: [0, 40, 0, 20],
        fontSize: 7,
        alignment: "center",
        columns: [
          [
            {
              text: "......................................... ",
              fontSize: 10,
            },
            { text: "Imię i nazwisko osoby uprawnionej " },
            { text: "do wystawiania faktury" },
          ],
          [
            {
              text: ".......................................... ",
              fontSize: 10,
            },
            { text: "Imię i nazwisko osoby uprawnionej " },
            { text: "do odbioru faktury" },
          ],
        ],
      },
    ],
    styles: {
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 7,
        color: "black",
        alignment: "center",
      },
      tableRow: {
        color: "black",
        alignment: "center",
      },
      tableHeaderSM: {
        bold: true,
        fontSize: 5,
        color: "black",
        alignment: "center",
      },
      tableRowSM: {
        color: "black",
        fontSize: 7,
      },
      header: {
        fontSize: 11,
        bold: true,
      },
    },
    defaultStyle: {
      columnGap: 50,
      fontSize: 8,
    },
  };

  pdfMake.createPdf(dd).open();
};

export default createPDF;
