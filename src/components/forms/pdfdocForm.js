import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import {numToWords} from 'num2words';
import num2word from '../../utils/num2word';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const createPDF = (props) => {
	const {invoice_nr, total_price, date, customer_nip, customer_city, customer_street, customer_name, order } = props;

	const items = order.map((el, index) => {
		return [
			{text: `${index +1}`, style: 'tableRow'},{text: `${el.product}`},
			{text: `szt. `, style: 'tableRow'},{text: `${el.quantity}`, style: 'tableRow'},
			{text: `${el.price_net}`, style: 'tableRow'},{text: `${el.vat}`, style: 'tableRow'},
			{text: `${el.total_price_net}`, style: 'tableRow'},{text: `${el.total_price_gross} `, style: 'tableRow'}
		]
	})

	var dd = {
		content: [
			{
				columns: [
					// {   image: `sampleImage.jpg`, width: 200 }
					{text: 'tu bedzie logo'}
					,
					{
						table: {
						widths: ["*"],
						body: [
							[{text: `Faktura nr ${invoice_nr}`}],
							[{text: `Data wystawienia: ${date._i}`}],
							[{text: `Termin płatności: ${date._i}`}],
							]
						}
					},
				]
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
						{	text: `${customer_name}` },
						{	text: `${customer_street}` },
						{	text: `${customer_city}` },
						{	text: `NIP: ${customer_nip}` },
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
						[{text: `Lp.`, style: 'tableHeader'},{text: `Nazwa`, style: 'tableHeader'},{text: `Jedn.`, style: 'tableHeader'},{text: `Ilość`, style: 'tableHeader'},{text: `Cena netto`, style: 'tableHeader'},{text: `Stawka`, style: 'tableHeader'},{text: `Wartość netto`, style: 'tableHeader'},{text: `Wartość brutto`, style: 'tableHeader'}],
						...items
					]
				}
			},
			{
				columns: [
					{
						table: {
					 //   widths: ["*"],
						body: [
							[{text: 'Stawka VAT', style: 'tableHeaderSM'},{text: 'Wartość netto', style: 'tableHeaderSM'},{text: 'Kwota VAT', style: 'tableHeaderSM'},{text: 'Wartość brutto', style: 'tableHeaderSM'}],
							[{text: `23%`, style: 'tableRowSM'},{text: `0`, style: 'tableRowSM'},{text: `0`, style: 'tableRowSM'},{text: `55`, style: 'tableRowSM'}],
							[{text: 'Razem', style: 'tableRowSM'},{text: `30c`, style: 'tableRowSM'},{text: `25`, style: 'tableRowSM'},{text: `${total_price}`, style: 'tableRowSM'}],
							]
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
				margin: [0, 5, 0, 15],
			}
		},
		styles: {
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