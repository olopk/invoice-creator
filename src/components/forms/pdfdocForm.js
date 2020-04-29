import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const createPDF = (props) => {

// , total_price, date, customer_nip, customer_city, customer_street, customer_name, order

// name: el.product,
// unit: 'szt.',
// quantity: el.quantity,
// price: el.price,
// total_price: el.total_price

	var dd = {
		content: [
			{
				columns: [
					{   image: 'sampleImage.jpg', width: 200 }
					,
					{
						table: {
						widths: ["*"],
						body: [
							[{text: 'Faktura nr '}],
							[{text: 'Data wystawienia: 2020-04-20'}],
							[{text: 'Termin płatności: 2020-04-27'}],
							]
						}
					},
				]
			},
			{
				columns: [
					[
						{	text: 'Sprzedawca', style: 'header' },
						{	text: 'Przedsiębiorstwo Wielobranżowe OpenIT Leszek Kaźmierczak' },
						{	text: 'os. Witosa 18/7' },
						{	text: '77-300 Człuchów' },
						{	text: 'NIP: 8431548646' },
						{	text: 'mBank' },
						{	text: '81 1140 2004 0000 3702 7042 3504' },
					],
					[
						{	text: 'Nabywca', style: 'header' },
						{	text: 'Przedsiębiorstwo Wielobranżowe OpenIT Leszek Kaźmierczak' },
						{	text: 'os. Witosa 18/7' },
						{	text: '77-300 Człuchów' },
						{	text: 'NIP: 8431548646' },
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
						[{text: 'Lp.', style: 'tableHeader'},{text: 'Nazwa', style: 'tableHeader'},{text: 'Jedn.', style: 'tableHeader'},{text: 'Ilość', style: 'tableHeader'},{text: 'Cena netto', style: 'tableHeader'},{text: 'Stawka', style: 'tableHeader'},{text: 'Wartość netto', style: 'tableHeader'},{text: 'Wartość brutto', style: 'tableHeader'}],
						[{text: '1', style: 'tableRow'},{text: 'Okulary'},{text: 'szt.', style: 'tableRow'},{text: '2', style: 'tableRow'},{text: '15', style: 'tableRow'},{text: '23%', style: 'tableRow'},{text: '15', style: 'tableRow'},{text: '55', style: 'tableRow'}],
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
							[{text: '23%', style: 'tableRowSM'},{text: '30', style: 'tableRowSM'},{text: '25', style: 'tableRowSM'},{text: '55', style: 'tableRowSM'}],
							[{text: 'Razem', style: 'tableRowSM'},{text: '30c', style: 'tableRowSM'},{text: '25', style: 'tableRowSM'},{text: '55', style: 'tableRowSM'}],
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
								{text: '55', alignment: 'right' },
								{text: '0', alignment: 'right' },
								{text: '0', alignment: 'right' }  
							 ]
							]
				 
						 },
					 {text: 'Słownie', alignment: 'right'},
					 {text: 'tysiac pincet sto dziewiecset', alignment: 'right'}
						
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