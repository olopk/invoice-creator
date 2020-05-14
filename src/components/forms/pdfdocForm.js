import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logo from '../../assets/logo64base';
import num2word from '../../utils/num2word';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const createPDF = (props) => {
	const {invoice_nr, receipt_nr, payment, total_price, date, customer_nip, customer_city, customer_street, customer_name, order } = props;

	const items = order.map((el, index) => {
		return [
			{text: `${index +1}`, style: 'tableRow'},{text: `${el.product}`},
			{text: `szt. `, style: 'tableRow'},{text: `${el.quantity}`, style: 'tableRow'},
			{text: `${el.price_net}`, style: 'tableRow'},{text: `${el.vat == 0 ? 'zwol.' : el.vat}`, style: 'tableRow'},
			{text: `${el.total_price_net}`, style: 'tableRow'},{text: `${el.total_price_gross} `, style: 'tableRow'}
		]
	})

	
	let detailTab = [
		[{text: 'Stawka VAT', style: 'tableHeaderSM'},{text: 'Wartość netto', style: 'tableHeaderSM'},{text: 'Kwota VAT', style: 'tableHeaderSM'},{text: 'Wartość brutto', style: 'tableHeaderSM'}],
		[{text: `zwol.`, style: 'tableRowSM'},{text: 0, style: 'tableRowSM'},{text: 0, style: 'tableRowSM'},{text: 0, style: 'tableRowSM'}],
		[{text: `23%`, style: 'tableRowSM'},{text: 0, style: 'tableRowSM'},{text: 0, style: 'tableRowSM'},{text: 0, style: 'tableRowSM'}],
		[{text: 'Razem', style: 'tableRowSM'},{text: 0, style: 'tableRowSM'},{text: 0, style: 'tableRowSM'},{text: `${total_price}`, style: 'tableRowSM'}],
	]

	order.forEach((el, index) => {
		if(el.vat == 0){
			detailTab[1][1].text += el.total_price_net;
			detailTab[1][2].text += el.total_price_gross - el.total_price_net;
			detailTab[1][3].text += el.total_price_gross;
			
		}else if(el.vat == 23){
			detailTab[2][1].text += el.total_price_net;
			detailTab[2][2].text += el.total_price_gross - el.total_price_net;
			detailTab[2][3].text += el.total_price_gross;
		}
		detailTab[3][1].text += el.total_price_net;
		detailTab[3][2].text += el.total_price_gross - el.total_price_net;
		detailTab[3][3].text += el.total_price_gross;
	})


	let sellDocType = `Faktura nr ${invoice_nr}`;
	if(props.receipt_nr){
		sellDocType = `Dokument sprzedażowy nr ${receipt_nr}`
	}

	var dd = {
		content: [
			{
				columns: [
					{   image: logo, width: 100 },
					{
						table: {
						widths: ["*"],
						body: [
							[{text: sellDocType}],
							[{text: `Data wystawienia: ${date._i}`}],
							// [{text: `Termin płatności: ${date._i}`}],
							[{text: `Typ płatności: ${payment}`}],
        			    ]
        		    }
        	    },
			],
			columnGap: 210,
			},
			{
				columns: [
					[
						{	text: `Sprzedawca`, style: `header` },
						{	text: `OPTYK Barbara Pałosz` },
						{	text: `os. Długosza 37` },
						{	text: `77-300 Człuchów` },
						{	text: `NIP: 843-15-20-760` },
						{	text: `PKOBP` },
						{	text: `8888 8888 8888 8888 8888 8888 ` },
					],
					[
						{	text: `Nabywca`, style: `header` },
						{	text: customer_name ? `${customer_name}` : null },
						{	text: customer_street ? `${customer_street}` : null },
						{	text: customer_city ? `${customer_city}` : null },
						{	text: customer_nip ? `NIP: ${customer_nip}` : null },
					]
				]
				,
				margin: [0, 10, 0, 20]  
			},
			{
				style: 'tableExample',
				table: {
					widths: [15, "*", 20, 20, 40,30,60, 60],   
					body: [
						[{text: `Lp.`, style: 'tableHeader'},{text: `Nazwa`, style: 'tableHeader'},{text: `Jedn.`, style: 'tableHeader'},{text: `Ilość`, style: 'tableHeader'},{text: `Cena netto`, style: 'tableHeader'},{text: `Stawka VAT`, style: 'tableHeader'},{text: `Wartość netto`, style: 'tableHeader'},{text: `Wartość brutto`, style: 'tableHeader'}],
						...items
					]
				}
			},
			{
				columns: [
					{
						table: {
					 //   widths: ["*"],
						body: detailTab
						}
					},
					[
						 {
							 columns: [
							 [
								{text: 'Zapłacono' },
								{text: 'Do zapłaty' },
								{text: 'Razem' }  
							 ],
							 [
								{text: `${total_price} PLN`, alignment: 'right' },
								{text: `0 PLN`, alignment: 'right' },
								{text: `0 PLN`, alignment: 'right' }  
							 ]
							]
				 
						 },
					 {text: 'Słownie', alignment: 'right'},
					 {text: `${num2word(total_price)}`, alignment: 'right'}
						
					],
				],
				margin: [0, 10, 0, 20]
			},
				{text: 'Uwagi: '},
			{
				margin: [0, 40, 0, 20],
				fontSize: 7 ,
				alignment: 'center',
				 columns: [
				 [
					{text: '......................................... ',fontSize: 10  },
					{text: 'Imię i nazwisko osoby uprawnionej '},
					{text: 'do wystawiania faktury' }
				 ],
				 [
					{text: '.......................................... ',fontSize: 10 },
					{text: 'Imię i nazwisko osoby uprawnionej ' },
					{text: 'do odbioru faktury' }
				 ],
				]   
			},
		],
		styles: {
			tableExample: {
				margin: [0, 5, 0, 15]
			},
			tableHeader: {
				bold: true,
				fontSize: 8,
				color: 'black',
				alignment: 'center'
			},
			tableRow: {
				color: 'black',
				alignment: 'center'
			},
			tableHeaderSM: {
				bold: true,
				fontSize: 7,
				color: 'black',
				alignment: 'center'
			},
			tableRowSM: {
				color: 'black',
				fontSize: 7,
			},
			header: {
				fontSize: 12,
				bold: true
			},
			
		},
		defaultStyle: {
			columnGap: 50,
			fontSize: 10
		}
	}
	
	pdfMake.createPdf(dd).download();
}

export default createPDF;