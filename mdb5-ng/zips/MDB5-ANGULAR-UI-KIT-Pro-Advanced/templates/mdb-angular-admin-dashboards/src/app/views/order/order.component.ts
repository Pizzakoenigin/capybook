import { Component, OnInit, ViewChild } from '@angular/core';
import { MdbCheckboxChange } from 'mdb-angular-ui-kit/checkbox';
import { MdbTableDirective } from 'mdb-angular-ui-kit/table';

interface Order {
  orderId: string;
  customer: string;
  date: string;
  country: string;
  status: string;
  amount: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @ViewChild('table', { static: true }) table!: MdbTableDirective<Order>;

  lineChartData = [
    {
      label: 'Sales in $',
      data: [2112, 2343, 2545, 3423, 2365, 1985, 987],
    },
  ];
  lineChartLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday ',
  ];

  barChartData = [
    {
      label: 'Number of orders',
      data: [21, 23, 25, 34, 23, 19, 9],
    },
  ];
  barChartLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday ',
  ];

  headers = [
    { label: 'Order ID', value: 'orderId' },
    { label: 'Customer', value: 'customer' },
    { label: 'Date', value: 'date' },
    { label: 'Country', value: 'country' },
    { label: 'Status', value: 'status' },
    { label: 'Amount', value: 'amount' },
  ];

  dataSource: Order[] = [
    {
      orderId: '1',
      customer: 'Ezekiel Gibbs',
      date: '11-07-20',
      country: 'Anguilla',
      status: 'Paid',
      amount: '$72.48',
    },
    {
      orderId: '2',
      customer: 'Richard Fry',
      date: '22-06-20',
      country: 'Netherlands',
      status: 'Unpaid',
      amount: '$19.88',
    },
    {
      orderId: '3',
      customer: 'Forrest Gonzalez',
      date: '05-06-20',
      country: 'Slovenia',
      status: 'Unpaid',
      amount: '$72.61',
    },
    {
      orderId: '4',
      customer: 'Herrod Norman',
      date: '13-11-19',
      country: 'Slovakia',
      status: 'Paid',
      amount: '$40.36',
    },
    {
      orderId: '5',
      customer: 'Buckminster Richards',
      date: '11-11-20',
      country: 'Congo (Brazzaville)',
      status: 'Paid',
      amount: '$58.45',
    },
    {
      orderId: '6',
      customer: 'Conan Summers',
      date: '15-11-20',
      country: 'Saint Pierre and Miquelon',
      status: 'Paid',
      amount: '$18.10',
    },
    {
      orderId: '7',
      customer: 'Damon Collins',
      date: '21-06-20',
      country: 'Saint Vincent and The Grenadines',
      status: 'Paid',
      amount: '$50.10',
    },
    {
      orderId: '8',
      customer: 'Tyler Cobb',
      date: '02-04-21',
      country: 'Thailand',
      status: 'Unpaid',
      amount: '$25.76',
    },
    {
      orderId: '9',
      customer: 'Alvin Nunez',
      date: '20-08-21',
      country: 'Trinidad and Tobago',
      status: 'Unpaid',
      amount: '$16.24',
    },
    {
      orderId: '10',
      customer: 'Emerson Atkinson',
      date: '15-10-20',
      country: 'Syria',
      status: 'Paid',
      amount: '$32.15',
    },
    {
      orderId: '11',
      customer: 'Stewart Pratt',
      date: '29-03-20',
      country: 'Egypt',
      status: 'Unpaid',
      amount: '$56.17',
    },
    {
      orderId: '12',
      customer: 'Cooper Knowles',
      date: '01-07-20',
      country: 'Ukraine',
      status: 'Unpaid',
      amount: '$47.89',
    },
    {
      orderId: '13',
      customer: 'Jonah Pugh',
      date: '16-03-20',
      country: 'Heard Island and Mcdonald Islands',
      status: 'Unpaid',
      amount: '$58.31',
    },
    {
      orderId: '14',
      customer: 'Hedley Roy',
      date: '07-01-21',
      country: 'Cape Verde',
      status: 'Unpaid',
      amount: '$11.55',
    },
    {
      orderId: '15',
      customer: 'Elliott Rasmussen',
      date: '15-12-20',
      country: 'Liechtenstein',
      status: 'Paid',
      amount: '$40.44',
    },
    {
      orderId: '16',
      customer: 'Chandler Waters',
      date: '20-08-20',
      country: 'Israel',
      status: 'Paid',
      amount: '$58.81',
    },
    {
      orderId: '17',
      customer: 'Wayne Owen',
      date: '16-06-20',
      country: 'Lesotho',
      status: 'Unpaid',
      amount: '$64.20',
    },
    {
      orderId: '18',
      customer: 'Uriah Holloway',
      date: '12-03-20',
      country: 'Åland Islands',
      status: 'Paid',
      amount: '$53.30',
    },
    {
      orderId: '19',
      customer: 'Amery Bowman',
      date: '13-10-19',
      country: 'Egypt',
      status: 'Paid',
      amount: '$63.97',
    },
    {
      orderId: '20',
      customer: 'Charles Campbell',
      date: '04-11-19',
      country: 'Niger',
      status: 'Paid',
      amount: '$60.03',
    },
    {
      orderId: '21',
      customer: 'Mark Aguirre',
      date: '07-09-19',
      country: 'Indonesia',
      status: 'Unpaid',
      amount: '$40.73',
    },
    {
      orderId: '22',
      customer: 'Brady Cook',
      date: '09-04-21',
      country: 'Turkmenistan',
      status: 'Unpaid',
      amount: '$69.43',
    },
    {
      orderId: '23',
      customer: 'Evan Keith',
      date: '02-07-20',
      country: 'Botswana',
      status: 'Paid',
      amount: '$66.74',
    },
    {
      orderId: '24',
      customer: 'Hedley Chan',
      date: '11-12-19',
      country: 'Jamaica',
      status: 'Unpaid',
      amount: '$65.58',
    },
    {
      orderId: '25',
      customer: 'Chester Walker',
      date: '03-02-20',
      country: 'Congo, the Democratic Republic of the',
      status: 'Paid',
      amount: '$62.13',
    },
    {
      orderId: '26',
      customer: 'Allen Sheppard',
      date: '23-06-20',
      country: 'Zambia',
      status: 'Unpaid',
      amount: '$20.62',
    },
    {
      orderId: '27',
      customer: 'Garrison Larson',
      date: '24-01-20',
      country: 'United States Minor Outlying Islands',
      status: 'Paid',
      amount: '$36.99',
    },
    {
      orderId: '28',
      customer: 'Blake Stuart',
      date: '18-09-19',
      country: 'Argentina',
      status: 'Unpaid',
      amount: '$32.14',
    },
    {
      orderId: '29',
      customer: 'Isaac Morse',
      date: '10-08-20',
      country: 'Bahrain',
      status: 'Unpaid',
      amount: '$62.92',
    },
    {
      orderId: '30',
      customer: 'Maxwell Barton',
      date: '04-04-20',
      country: 'Djibouti',
      status: 'Paid',
      amount: '$6.02',
    },
    {
      orderId: '31',
      customer: 'Keegan Frazier',
      date: '03-11-19',
      country: 'Central African Republic',
      status: 'Unpaid',
      amount: '$81.48',
    },
    {
      orderId: '32',
      customer: 'Abraham Merritt',
      date: '30-07-20',
      country: 'Mali',
      status: 'Unpaid',
      amount: '$28.72',
    },
    {
      orderId: '33',
      customer: 'Matthew Vaughn',
      date: '17-03-21',
      country: 'Timor-Leste',
      status: 'Paid',
      amount: '$81.75',
    },
    {
      orderId: '34',
      customer: 'Dante Griffin',
      date: '15-12-19',
      country: 'Marshall Islands',
      status: 'Unpaid',
      amount: '$33.71',
    },
    {
      orderId: '35',
      customer: 'Zachary Stewart',
      date: '26-10-20',
      country: 'Korea, North',
      status: 'Unpaid',
      amount: '$67.54',
    },
    {
      orderId: '36',
      customer: 'Joshua Berg',
      date: '24-12-19',
      country: 'Palau',
      status: 'Unpaid',
      amount: '$63.99',
    },
    {
      orderId: '37',
      customer: 'Emery Flores',
      date: '05-07-21',
      country: 'Angola',
      status: 'Unpaid',
      amount: '$26.70',
    },
    {
      orderId: '38',
      customer: 'Tarik Dillon',
      date: '01-03-21',
      country: 'Canada',
      status: 'Unpaid',
      amount: '$23.64',
    },
    {
      orderId: '39',
      customer: 'Acton Blair',
      date: '05-08-20',
      country: 'Bhutan',
      status: 'Paid',
      amount: '$68.23',
    },
    {
      orderId: '40',
      customer: 'Edward Daniels',
      date: '08-01-21',
      country: 'Cayman Islands',
      status: 'Paid',
      amount: '$10.66',
    },
    {
      orderId: '41',
      customer: 'Austin Branch',
      date: '12-06-21',
      country: 'Bahamas',
      status: 'Paid',
      amount: '$77.53',
    },
    {
      orderId: '42',
      customer: 'Theodore Atkinson',
      date: '02-12-19',
      country: 'Saudi Arabia',
      status: 'Unpaid',
      amount: '$58.21',
    },
    {
      orderId: '43',
      customer: 'Fitzgerald Parsons',
      date: '09-04-21',
      country: 'Pitcairn Islands',
      status: 'Paid',
      amount: '$68.61',
    },
    {
      orderId: '44',
      customer: 'Damian Morton',
      date: '24-06-20',
      country: 'Monaco',
      status: 'Paid',
      amount: '$47.74',
    },
    {
      orderId: '45',
      customer: 'Isaiah Berry',
      date: '20-11-20',
      country: 'Bulgaria',
      status: 'Paid',
      amount: '$97.60',
    },
    {
      orderId: '46',
      customer: 'Samson Morrison',
      date: '19-10-20',
      country: 'Belarus',
      status: 'Paid',
      amount: '$10.67',
    },
    {
      orderId: '47',
      customer: 'Xavier Soto',
      date: '28-03-20',
      country: 'Malaysia',
      status: 'Unpaid',
      amount: '$81.85',
    },
    {
      orderId: '48',
      customer: 'Cade Castaneda',
      date: '09-08-20',
      country: 'Egypt',
      status: 'Paid',
      amount: '$36.72',
    },
    {
      orderId: '49',
      customer: 'Ivan Burke',
      date: '12-02-21',
      country: 'Albania',
      status: 'Unpaid',
      amount: '$60.59',
    },
    {
      orderId: '50',
      customer: 'Galvin Christian',
      date: '16-10-19',
      country: 'Mayotte',
      status: 'Paid',
      amount: '$94.28',
    },
    {
      orderId: '51',
      customer: 'Emmanuel Stephenson',
      date: '07-01-21',
      country: 'South Sudan',
      status: 'Paid',
      amount: '$99.83',
    },
    {
      orderId: '52',
      customer: 'Lars Mills',
      date: '27-01-21',
      country: 'Faroe Islands',
      status: 'Paid',
      amount: '$84.81',
    },
    {
      orderId: '53',
      customer: 'Baxter Lopez',
      date: '15-07-21',
      country: 'Myanmar',
      status: 'Unpaid',
      amount: '$99.65',
    },
    {
      orderId: '54',
      customer: 'Amir Roman',
      date: '07-10-19',
      country: 'Northern Mariana Islands',
      status: 'Unpaid',
      amount: '$27.39',
    },
    {
      orderId: '55',
      customer: 'Cole Carey',
      date: '03-09-20',
      country: 'Anguilla',
      status: 'Paid',
      amount: '$99.61',
    },
    {
      orderId: '56',
      customer: 'Ishmael Davenport',
      date: '21-10-20',
      country: 'Tonga',
      status: 'Unpaid',
      amount: '$81.94',
    },
    {
      orderId: '57',
      customer: 'Amal Simon',
      date: '24-04-21',
      country: 'Palau',
      status: 'Paid',
      amount: '$30.67',
    },
    {
      orderId: '58',
      customer: 'Oren Finley',
      date: '17-03-20',
      country: 'Belgium',
      status: 'Paid',
      amount: '$77.74',
    },
    {
      orderId: '59',
      customer: 'Harding Blankenship',
      date: '10-12-20',
      country: 'Saint Martin',
      status: 'Paid',
      amount: '$21.76',
    },
    {
      orderId: '60',
      customer: 'Garrett Logan',
      date: '06-04-20',
      country: 'Antarctica',
      status: 'Unpaid',
      amount: '$1.03',
    },
    {
      orderId: '61',
      customer: 'Ross Wilkinson',
      date: '23-04-21',
      country: 'Niue',
      status: 'Paid',
      amount: '$89.59',
    },
    {
      orderId: '62',
      customer: 'Graiden Curtis',
      date: '14-05-21',
      country: 'Ecuador',
      status: 'Unpaid',
      amount: '$1.42',
    },
    {
      orderId: '63',
      customer: 'Vladimir David',
      date: '16-05-21',
      country: 'Norway',
      status: 'Unpaid',
      amount: '$97.09',
    },
    {
      orderId: '64',
      customer: 'Tad Navarro',
      date: '30-12-20',
      country: 'Sint Maarten',
      status: 'Paid',
      amount: '$94.35',
    },
    {
      orderId: '65',
      customer: 'Stephen Spencer',
      date: '11-12-20',
      country: 'Netherlands',
      status: 'Paid',
      amount: '$55.91',
    },
    {
      orderId: '66',
      customer: 'Salvador Hendricks',
      date: '24-11-20',
      country: 'Namibia',
      status: 'Unpaid',
      amount: '$86.97',
    },
    {
      orderId: '67',
      customer: 'Tiger Ryan',
      date: '29-09-19',
      country: 'Saint Pierre and Miquelon',
      status: 'Paid',
      amount: '$52.88',
    },
    {
      orderId: '68',
      customer: 'Louis Wiggins',
      date: '19-03-21',
      country: 'Grenada',
      status: 'Paid',
      amount: '$90.50',
    },
    {
      orderId: '69',
      customer: 'Gareth Fleming',
      date: '08-05-20',
      country: 'Martinique',
      status: 'Unpaid',
      amount: '$80.61',
    },
    {
      orderId: '70',
      customer: 'Fitzgerald Burris',
      date: '10-02-20',
      country: 'Burkina Faso',
      status: 'Unpaid',
      amount: '$45.89',
    },
    {
      orderId: '71',
      customer: 'Jackson Ingram',
      date: '08-08-21',
      country: 'Korea, North',
      status: 'Unpaid',
      amount: '$5.06',
    },
    {
      orderId: '72',
      customer: 'Porter Barr',
      date: '12-01-21',
      country: 'Bulgaria',
      status: 'Paid',
      amount: '$22.54',
    },
    {
      orderId: '73',
      customer: 'Harlan Mcintyre',
      date: '11-04-20',
      country: 'Togo',
      status: 'Paid',
      amount: '$97.43',
    },
    {
      orderId: '74',
      customer: 'Dalton Olsen',
      date: '26-02-20',
      country: 'Armenia',
      status: 'Unpaid',
      amount: '$21.95',
    },
    {
      orderId: '75',
      customer: 'Sawyer Harper',
      date: '25-05-21',
      country: 'France',
      status: 'Unpaid',
      amount: '$91.47',
    },
    {
      orderId: '76',
      customer: 'Dennis Vaughn',
      date: '20-09-20',
      country: 'Bolivia',
      status: 'Unpaid',
      amount: '$45.12',
    },
    {
      orderId: '77',
      customer: 'Peter Townsend',
      date: '11-04-21',
      country: "Côte D'Ivoire (Ivory Coast)",
      status: 'Paid',
      amount: '$37.22',
    },
    {
      orderId: '78',
      customer: 'Damian Shelton',
      date: '28-01-20',
      country: 'Samoa',
      status: 'Unpaid',
      amount: '$92.59',
    },
    {
      orderId: '79',
      customer: 'Hector Cooke',
      date: '12-01-20',
      country: 'Virgin Islands, United States',
      status: 'Unpaid',
      amount: '$62.38',
    },
    {
      orderId: '80',
      customer: 'Davis Evans',
      date: '23-10-20',
      country: 'Falkland Islands',
      status: 'Unpaid',
      amount: '$8.31',
    },
    {
      orderId: '81',
      customer: 'Keane Casey',
      date: '20-02-20',
      country: 'Saint Vincent and The Grenadines',
      status: 'Unpaid',
      amount: '$24.31',
    },
    {
      orderId: '82',
      customer: 'Conan Lucas',
      date: '20-02-20',
      country: 'Jersey',
      status: 'Paid',
      amount: '$26.51',
    },
    {
      orderId: '83',
      customer: 'Aladdin Johnson',
      date: '15-09-20',
      country: 'Ethiopia',
      status: 'Unpaid',
      amount: '$41.53',
    },
    {
      orderId: '84',
      customer: 'Buckminster Stevenson',
      date: '20-08-21',
      country: 'United Arab Emirates',
      status: 'Unpaid',
      amount: '$1.22',
    },
    {
      orderId: '85',
      customer: 'Zachery Powers',
      date: '15-07-21',
      country: 'Lesotho',
      status: 'Unpaid',
      amount: '$9.17',
    },
    {
      orderId: '86',
      customer: 'Griffin Knowles',
      date: '13-08-20',
      country: 'Libya',
      status: 'Paid',
      amount: '$98.94',
    },
    {
      orderId: '87',
      customer: 'Yuli Wheeler',
      date: '16-06-20',
      country: 'San Marino',
      status: 'Unpaid',
      amount: '$78.86',
    },
    {
      orderId: '88',
      customer: 'Garrett Bryant',
      date: '09-04-20',
      country: "Côte D'Ivoire (Ivory Coast)",
      status: 'Unpaid',
      amount: '$70.97',
    },
    {
      orderId: '89',
      customer: 'Hyatt Morse',
      date: '10-03-20',
      country: 'Jersey',
      status: 'Paid',
      amount: '$84.41',
    },
    {
      orderId: '90',
      customer: 'Bradley Dominguez',
      date: '11-06-20',
      country: 'Myanmar',
      status: 'Unpaid',
      amount: '$97.88',
    },
    {
      orderId: '91',
      customer: 'Hayes Norton',
      date: '25-10-20',
      country: 'Falkland Islands',
      status: 'Unpaid',
      amount: '$48.18',
    },
    {
      orderId: '92',
      customer: 'Zahir Sexton',
      date: '09-06-20',
      country: 'Somalia',
      status: 'Unpaid',
      amount: '$6.06',
    },
    {
      orderId: '93',
      customer: 'Burton Duffy',
      date: '12-07-20',
      country: 'Antarctica',
      status: 'Unpaid',
      amount: '$56.97',
    },
    {
      orderId: '94',
      customer: 'Vladimir House',
      date: '03-09-19',
      country: 'Mexico',
      status: 'Unpaid',
      amount: '$12.91',
    },
    {
      orderId: '95',
      customer: 'Timon Fletcher',
      date: '20-04-21',
      country: 'Somalia',
      status: 'Paid',
      amount: '$52.38',
    },
    {
      orderId: '96',
      customer: 'Bernard Love',
      date: '11-02-21',
      country: 'Japan',
      status: 'Unpaid',
      amount: '$72.35',
    },
    {
      orderId: '97',
      customer: 'Damian Gomez',
      date: '14-02-20',
      country: 'Antarctica',
      status: 'Paid',
      amount: '$47.64',
    },
    {
      orderId: '98',
      customer: 'Yuli Richards',
      date: '22-04-21',
      country: 'Morocco',
      status: 'Unpaid',
      amount: '$65.10',
    },
    {
      orderId: '99',
      customer: 'Yardley Rasmussen',
      date: '25-09-20',
      country: 'Bahamas',
      status: 'Paid',
      amount: '$33.97',
    },
    {
      orderId: '100',
      customer: 'Grant Cunningham',
      date: '13-03-20',
      country: 'Indonesia',
      status: 'Unpaid',
      amount: '$44.85',
    },
  ];
  selections = new Set<Order>();

  constructor() {}

  ngOnInit(): void {}

  allRowsSelected() {
    return this.selections.size === this.dataSource.length;
  }

  toggleAll(event: MdbCheckboxChange): void {
    if (event.checked) {
      this.dataSource.forEach((row: Order) => {
        this.select(row);
      });
    } else {
      this.dataSource.forEach((row: Order) => {
        this.deselect(row);
      });
    }
  }

  toggleSelection(event: MdbCheckboxChange, value: Order) {
    if (event.checked) {
      this.select(value);
    } else {
      this.deselect(value);
    }
  }

  select(value: Order): void {
    if (!this.selections.has(value)) {
      this.selections.add(value);
    }
  }

  deselect(value: Order): void {
    if (this.selections.has(value)) {
      this.selections.delete(value);
    }
  }

  search(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.table.search(searchTerm);
  }
}
