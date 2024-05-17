import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import ChartDatalabels from 'chartjs-plugin-datalabels';

interface Product {
  productId: number;
  quantity: number;
  purchases: number;
  delta: number;
  productRevenue: string;
  deltaPercentage: string;
  buyToDetailsPercentage: string;
}

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce1.component.html',
  styleUrls: ['./ecommerce1.component.scss'],
})
export class Ecommerce1Component implements OnInit {
  productOptions = [
    { label: 'Product 1', value: '1' },
    { label: 'Product 2', value: '2' },
    { label: 'Product 3', value: '3' },
    { label: 'Product 4', value: '4' },
    { label: 'Product 5', value: '5' },
  ];

  dateOptions = [
    { label: 'Today', value: '1' },
    { label: 'Yesterday', value: '2' },
    { label: 'Last 7 days', value: '3' },
    { label: 'Last 28 days', value: '4' },
    { label: 'Last 90 days', value: '5' },
  ];

  selectProductControl = new UntypedFormControl('1');
  selectDateControl = new UntypedFormControl('3');

  plugins = [ChartDatalabels];

  shoppingFunnelChartOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true,
          drawBorder: true,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    legend: {
      display: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        formatter: (value: number) => {
          let sum = 0;
          // Assign the data to the variable and format it according to your needs
          let dataArr = this.shoppingFunnelChartData[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + '%';
          return percentage;
        },
        color: '#4f4f4f',
        labels: {
          title: {
            font: {
              size: '13',
            },
            anchor: 'end',
            align: 'right',
          },
        },
      },
    },
  };

  shoppingFunnelChartData = [
    {
      data: [2112, 343, 45],
      barPercentage: 1.24,
    },
  ];

  shoppingFunnelChartLabels = ['Product views', 'Checkout', 'Purchases'];

  productRevenueChartOptions = {
    scales: {
      y: {
        ticks: {
          display: false,
        },
      },
      y1: {
        position: 'left',
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          beginAtZero: true,
          callback: function (value: number) {
            return '$' + value;
          },
        },
      },
      y2: {
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  productRevenueChartData = [
    {
      label: 'Product revenue $',
      yAxisID: 'y1',
      data: [211, 234, 254, 342, 236, 198, 98],
      order: 1,
    },
    {
      label: 'Unique purchases',
      yAxisID: 'y2',
      data: [52, 42, 69, 60, 45, 23, 89],
      type: 'line',
      order: 0,
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#94DFD7',
      borderWidth: 2,
      pointBorderColor: '#94DFD7',
      pointBackgroundColor: '#94DFD7',
      lineTension: 0.0,
    },
  ];

  productRevenueChartLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday ',
  ];

  revenueSourcesChartOptions = {
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (value: number) {
            return '$' + value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        formatter: (value: number) => {
          let sum = 0;
          let dataArr = this.revenueSourcesChartData[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + '%';
          return percentage;
        },
        color: '#4f4f4f',
        labels: {
          title: {
            font: {
              size: '13',
            },
            anchor: 'end',
            align: 'top',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (value: any) {
            return `$ ${value.parsed.y}`;
          },
        },
      },
    },
  };

  revenueSourcesChartData = [
    {
      data: [2112, 1343, 545, 324],
    },
  ];

  revenueSourcesChartLabels = ['Google', 'YouTube', 'Facebook', 'Twitter'];

  marketingSourcesChartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
        },
      },
      datalabels: {
        formatter: (value: number) => {
          let sum = 0;
          let dataArr = this.marketingSourcesChartData[0].data;
          dataArr.map((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + '%';
          return percentage;
        },
        color: 'white',
        labels: {
          title: {
            font: {
              size: '13',
            },
          },
        },
      },
    },
  };

  marketingSourcesChartData = [
    {
      label: 'Traffic',
      data: [8112, 5343, 3545],
      backgroundColor: [
        'rgba(63, 81, 181, 0.5)',
        'rgba(77, 182, 172, 0.5)',
        'rgba(66, 133, 244, 0.5)',
      ],
    },
  ];

  marketingSourcesChartLabels = ['Organic search', 'Direct', 'Social'];

  headers = [
    { value: 'productId', label: 'Product ID' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'purchases', label: 'Purchases' },
    { value: 'delta', label: 'Δ' },
    { value: 'productRevenue', label: 'Product revenue' },
    { value: 'deltaPercentage', label: '%Δ' },
    { value: 'buyToDetailsPercentage', label: 'Buy-to-details %' },
  ];

  dataSource: Product[] = [
    {
      productId: 123,
      quantity: 21,
      purchases: 9,
      delta: 2,
      productRevenue: '$448.29',
      deltaPercentage: '112.54%',
      buyToDetailsPercentage: '17.55%',
    },
    {
      productId: 124,
      quantity: 42,
      purchases: 24,
      delta: 0,
      productRevenue: '$182.71',
      deltaPercentage: '59.32%',
      buyToDetailsPercentage: '37.62%',
    },
    {
      productId: 125,
      quantity: 4,
      purchases: 18,
      delta: 2,
      productRevenue: '$41.15',
      deltaPercentage: '118.58%',
      buyToDetailsPercentage: '3.40%',
    },
    {
      productId: 126,
      quantity: 37,
      purchases: 30,
      delta: 0,
      productRevenue: '$64.67',
      deltaPercentage: '65.36%',
      buyToDetailsPercentage: '10.69%',
    },
    {
      productId: 127,
      quantity: 13,
      purchases: 13,
      delta: 1,
      productRevenue: '$202.18',
      deltaPercentage: '135.11%',
      buyToDetailsPercentage: '86.85%',
    },
    {
      productId: 128,
      quantity: 2,
      purchases: 25,
      delta: 1,
      productRevenue: '$22.29',
      deltaPercentage: '75.34%',
      buyToDetailsPercentage: '78.13%',
    },
    {
      productId: 129,
      quantity: 38,
      purchases: 5,
      delta: 3,
      productRevenue: '$21.42',
      deltaPercentage: '34.96%',
      buyToDetailsPercentage: '3.14%',
    },
    {
      productId: 130,
      quantity: 23,
      purchases: 2,
      delta: 2,
      productRevenue: '$362.59',
      deltaPercentage: '159.01%',
      buyToDetailsPercentage: '0.88%',
    },
    {
      productId: 131,
      quantity: 10,
      purchases: 26,
      delta: 1,
      productRevenue: '$223.64',
      deltaPercentage: '199.88%',
      buyToDetailsPercentage: '38.05%',
    },
    {
      productId: 132,
      quantity: 43,
      purchases: 34,
      delta: 2,
      productRevenue: '$148.31',
      deltaPercentage: '36.15%',
      buyToDetailsPercentage: '13.58%',
    },
    {
      productId: 133,
      quantity: 21,
      purchases: 10,
      delta: 0,
      productRevenue: '$293.35',
      deltaPercentage: '142.13%',
      buyToDetailsPercentage: '59.93%',
    },
    {
      productId: 134,
      quantity: 17,
      purchases: 12,
      delta: 2,
      productRevenue: '$325.35',
      deltaPercentage: '145.78%',
      buyToDetailsPercentage: '22.33%',
    },
    {
      productId: 135,
      quantity: 18,
      purchases: 26,
      delta: 1,
      productRevenue: '$425.38',
      deltaPercentage: '86.88%',
      buyToDetailsPercentage: '8.39%',
    },
    {
      productId: 136,
      quantity: 24,
      purchases: 14,
      delta: 3,
      productRevenue: '$175.65',
      deltaPercentage: '188.03%',
      buyToDetailsPercentage: '6.04%',
    },
    {
      productId: 137,
      quantity: 44,
      purchases: 18,
      delta: 2,
      productRevenue: '$492.13',
      deltaPercentage: '27.94%',
      buyToDetailsPercentage: '96.88%',
    },
    {
      productId: 138,
      quantity: 40,
      purchases: 34,
      delta: 2,
      productRevenue: '$474.20',
      deltaPercentage: '165.88%',
      buyToDetailsPercentage: '75.91%',
    },
    {
      productId: 139,
      quantity: 1,
      purchases: 26,
      delta: 2,
      productRevenue: '$291.67',
      deltaPercentage: '23.56%',
      buyToDetailsPercentage: '98.18%',
    },
    {
      productId: 140,
      quantity: 1,
      purchases: 23,
      delta: 0,
      productRevenue: '$409.04',
      deltaPercentage: '59.10%',
      buyToDetailsPercentage: '12.43%',
    },
    {
      productId: 141,
      quantity: 41,
      purchases: 26,
      delta: 2,
      productRevenue: '$145.37',
      deltaPercentage: '60.38%',
      buyToDetailsPercentage: '16.67%',
    },
    {
      productId: 142,
      quantity: 29,
      purchases: 8,
      delta: 1,
      productRevenue: '$88.48',
      deltaPercentage: '132.66%',
      buyToDetailsPercentage: '99.17%',
    },
    {
      productId: 143,
      quantity: 42,
      purchases: 33,
      delta: 2,
      productRevenue: '$153.96',
      deltaPercentage: '16.81%',
      buyToDetailsPercentage: '2.54%',
    },
    {
      productId: 144,
      quantity: 25,
      purchases: 24,
      delta: 3,
      productRevenue: '$484.25',
      deltaPercentage: '199.82%',
      buyToDetailsPercentage: '6.29%',
    },
    {
      productId: 145,
      quantity: 44,
      purchases: 19,
      delta: 0,
      productRevenue: '$133.35',
      deltaPercentage: '169.73%',
      buyToDetailsPercentage: '14.36%',
    },
    {
      productId: 146,
      quantity: 34,
      purchases: 24,
      delta: 2,
      productRevenue: '$345.58',
      deltaPercentage: '187.76%',
      buyToDetailsPercentage: '78.83%',
    },
    {
      productId: 147,
      quantity: 26,
      purchases: 28,
      delta: 1,
      productRevenue: '$151.04',
      deltaPercentage: '192.89%',
      buyToDetailsPercentage: '55.87%',
    },
    {
      productId: 148,
      quantity: 16,
      purchases: 18,
      delta: 1,
      productRevenue: '$273.32',
      deltaPercentage: '184.14%',
      buyToDetailsPercentage: '77.91%',
    },
    {
      productId: 149,
      quantity: 11,
      purchases: 24,
      delta: 1,
      productRevenue: '$186.84',
      deltaPercentage: '73.08%',
      buyToDetailsPercentage: '54.91%',
    },
    {
      productId: 150,
      quantity: 45,
      purchases: 25,
      delta: 0,
      productRevenue: '$286.30',
      deltaPercentage: '164.72%',
      buyToDetailsPercentage: '25.93%',
    },
    {
      productId: 151,
      quantity: 24,
      purchases: 22,
      delta: 3,
      productRevenue: '$44.99',
      deltaPercentage: '72.07%',
      buyToDetailsPercentage: '92.68%',
    },
    {
      productId: 152,
      quantity: 16,
      purchases: 20,
      delta: 0,
      productRevenue: '$434.77',
      deltaPercentage: '167.60%',
      buyToDetailsPercentage: '18.78%',
    },
    {
      productId: 153,
      quantity: 44,
      purchases: 33,
      delta: 0,
      productRevenue: '$241.04',
      deltaPercentage: '38.81%',
      buyToDetailsPercentage: '39.98%',
    },
    {
      productId: 154,
      quantity: 17,
      purchases: 15,
      delta: 3,
      productRevenue: '$196.36',
      deltaPercentage: '180.25%',
      buyToDetailsPercentage: '54.47%',
    },
    {
      productId: 155,
      quantity: 10,
      purchases: 34,
      delta: 1,
      productRevenue: '$441.65',
      deltaPercentage: '87.35%',
      buyToDetailsPercentage: '80.55%',
    },
    {
      productId: 156,
      quantity: 22,
      purchases: 2,
      delta: 3,
      productRevenue: '$404.08',
      deltaPercentage: '159.30%',
      buyToDetailsPercentage: '55.65%',
    },
    {
      productId: 157,
      quantity: 29,
      purchases: 23,
      delta: 0,
      productRevenue: '$176.42',
      deltaPercentage: '116.25%',
      buyToDetailsPercentage: '19.23%',
    },
    {
      productId: 158,
      quantity: 21,
      purchases: 1,
      delta: 0,
      productRevenue: '$256.70',
      deltaPercentage: '180.01%',
      buyToDetailsPercentage: '47.55%',
    },
    {
      productId: 159,
      quantity: 27,
      purchases: 20,
      delta: 0,
      productRevenue: '$375.41',
      deltaPercentage: '30.42%',
      buyToDetailsPercentage: '23.45%',
    },
    {
      productId: 160,
      quantity: 33,
      purchases: 25,
      delta: 3,
      productRevenue: '$313.54',
      deltaPercentage: '108.37%',
      buyToDetailsPercentage: '6.57%',
    },
    {
      productId: 161,
      quantity: 42,
      purchases: 14,
      delta: 2,
      productRevenue: '$328.28',
      deltaPercentage: '193.06%',
      buyToDetailsPercentage: '18.86%',
    },
    {
      productId: 162,
      quantity: 13,
      purchases: 23,
      delta: 3,
      productRevenue: '$159.28',
      deltaPercentage: '75.18%',
      buyToDetailsPercentage: '11.20%',
    },
    {
      productId: 163,
      quantity: 31,
      purchases: 2,
      delta: 1,
      productRevenue: '$259.08',
      deltaPercentage: '17.79%',
      buyToDetailsPercentage: '65.96%',
    },
    {
      productId: 164,
      quantity: 28,
      purchases: 22,
      delta: 1,
      productRevenue: '$426.61',
      deltaPercentage: '120.66%',
      buyToDetailsPercentage: '85.42%',
    },
    {
      productId: 165,
      quantity: 19,
      purchases: 16,
      delta: 2,
      productRevenue: '$269.72',
      deltaPercentage: '191.67%',
      buyToDetailsPercentage: '56.66%',
    },
    {
      productId: 166,
      quantity: 31,
      purchases: 7,
      delta: 0,
      productRevenue: '$412.03',
      deltaPercentage: '72.91%',
      buyToDetailsPercentage: '94.83%',
    },
    {
      productId: 167,
      quantity: 26,
      purchases: 4,
      delta: 0,
      productRevenue: '$279.67',
      deltaPercentage: '184.87%',
      buyToDetailsPercentage: '75.28%',
    },
    {
      productId: 168,
      quantity: 38,
      purchases: 31,
      delta: 0,
      productRevenue: '$385.86',
      deltaPercentage: '24.37%',
      buyToDetailsPercentage: '12.64%',
    },
    {
      productId: 169,
      quantity: 17,
      purchases: 7,
      delta: 2,
      productRevenue: '$63.91',
      deltaPercentage: '118.32%',
      buyToDetailsPercentage: '16.15%',
    },
    {
      productId: 170,
      quantity: 24,
      purchases: 22,
      delta: 2,
      productRevenue: '$418.11',
      deltaPercentage: '194.73%',
      buyToDetailsPercentage: '21.31%',
    },
    {
      productId: 171,
      quantity: 25,
      purchases: 30,
      delta: 1,
      productRevenue: '$79.84',
      deltaPercentage: '175.77%',
      buyToDetailsPercentage: '80.91%',
    },
    {
      productId: 172,
      quantity: 37,
      purchases: 7,
      delta: 0,
      productRevenue: '$94.17',
      deltaPercentage: '68.17%',
      buyToDetailsPercentage: '28.84%',
    },
    {
      productId: 173,
      quantity: 23,
      purchases: 7,
      delta: 2,
      productRevenue: '$51.40',
      deltaPercentage: '42.51%',
      buyToDetailsPercentage: '51.99%',
    },
    {
      productId: 174,
      quantity: 44,
      purchases: 8,
      delta: 0,
      productRevenue: '$481.79',
      deltaPercentage: '42.39%',
      buyToDetailsPercentage: '21.23%',
    },
    {
      productId: 175,
      quantity: 27,
      purchases: 2,
      delta: 1,
      productRevenue: '$464.96',
      deltaPercentage: '14.03%',
      buyToDetailsPercentage: '71.42%',
    },
    {
      productId: 176,
      quantity: 9,
      purchases: 8,
      delta: 0,
      productRevenue: '$456.77',
      deltaPercentage: '35.47%',
      buyToDetailsPercentage: '29.23%',
    },
    {
      productId: 177,
      quantity: 13,
      purchases: 10,
      delta: 2,
      productRevenue: '$393.63',
      deltaPercentage: '135.96%',
      buyToDetailsPercentage: '27.17%',
    },
    {
      productId: 178,
      quantity: 9,
      purchases: 9,
      delta: 2,
      productRevenue: '$472.77',
      deltaPercentage: '144.47%',
      buyToDetailsPercentage: '96.86%',
    },
    {
      productId: 179,
      quantity: 16,
      purchases: 30,
      delta: 0,
      productRevenue: '$398.08',
      deltaPercentage: '22.40%',
      buyToDetailsPercentage: '20.55%',
    },
    {
      productId: 180,
      quantity: 25,
      purchases: 34,
      delta: 0,
      productRevenue: '$228.47',
      deltaPercentage: '128.91%',
      buyToDetailsPercentage: '49.39%',
    },
    {
      productId: 181,
      quantity: 28,
      purchases: 24,
      delta: 0,
      productRevenue: '$261.91',
      deltaPercentage: '98.72%',
      buyToDetailsPercentage: '47.21%',
    },
    {
      productId: 182,
      quantity: 13,
      purchases: 33,
      delta: 3,
      productRevenue: '$252.99',
      deltaPercentage: '32.71%',
      buyToDetailsPercentage: '63.10%',
    },
    {
      productId: 183,
      quantity: 14,
      purchases: 30,
      delta: 2,
      productRevenue: '$224.74',
      deltaPercentage: '137.10%',
      buyToDetailsPercentage: '41.33%',
    },
    {
      productId: 184,
      quantity: 1,
      purchases: 30,
      delta: 1,
      productRevenue: '$252.26',
      deltaPercentage: '99.49%',
      buyToDetailsPercentage: '13.51%',
    },
    {
      productId: 185,
      quantity: 31,
      purchases: 9,
      delta: 2,
      productRevenue: '$223.09',
      deltaPercentage: '118.81%',
      buyToDetailsPercentage: '27.53%',
    },
    {
      productId: 186,
      quantity: 43,
      purchases: 22,
      delta: 0,
      productRevenue: '$48.90',
      deltaPercentage: '26.04%',
      buyToDetailsPercentage: '51.45%',
    },
    {
      productId: 187,
      quantity: 37,
      purchases: 6,
      delta: 0,
      productRevenue: '$318.10',
      deltaPercentage: '99.73%',
      buyToDetailsPercentage: '75.86%',
    },
    {
      productId: 188,
      quantity: 14,
      purchases: 27,
      delta: 2,
      productRevenue: '$209.26',
      deltaPercentage: '20.59%',
      buyToDetailsPercentage: '72.29%',
    },
    {
      productId: 189,
      quantity: 43,
      purchases: 9,
      delta: 0,
      productRevenue: '$384.09',
      deltaPercentage: '8.86%',
      buyToDetailsPercentage: '27.94%',
    },
    {
      productId: 190,
      quantity: 37,
      purchases: 6,
      delta: 0,
      productRevenue: '$374.42',
      deltaPercentage: '175.92%',
      buyToDetailsPercentage: '11.88%',
    },
    {
      productId: 191,
      quantity: 37,
      purchases: 20,
      delta: 0,
      productRevenue: '$361.86',
      deltaPercentage: '46.65%',
      buyToDetailsPercentage: '50.08%',
    },
    {
      productId: 192,
      quantity: 3,
      purchases: 24,
      delta: 2,
      productRevenue: '$194.17',
      deltaPercentage: '145.60%',
      buyToDetailsPercentage: '51.01%',
    },
    {
      productId: 193,
      quantity: 33,
      purchases: 1,
      delta: 0,
      productRevenue: '$467.07',
      deltaPercentage: '175.79%',
      buyToDetailsPercentage: '17.64%',
    },
    {
      productId: 194,
      quantity: 18,
      purchases: 10,
      delta: 1,
      productRevenue: '$475.56',
      deltaPercentage: '57.07%',
      buyToDetailsPercentage: '72.85%',
    },
    {
      productId: 195,
      quantity: 7,
      purchases: 22,
      delta: 1,
      productRevenue: '$412.53',
      deltaPercentage: '174.03%',
      buyToDetailsPercentage: '42.28%',
    },
    {
      productId: 196,
      quantity: 20,
      purchases: 23,
      delta: 3,
      productRevenue: '$132.04',
      deltaPercentage: '71.93%',
      buyToDetailsPercentage: '9.82%',
    },
    {
      productId: 197,
      quantity: 31,
      purchases: 23,
      delta: 0,
      productRevenue: '$89.61',
      deltaPercentage: '51.00%',
      buyToDetailsPercentage: '64.26%',
    },
    {
      productId: 198,
      quantity: 11,
      purchases: 4,
      delta: 1,
      productRevenue: '$161.92',
      deltaPercentage: '31.70%',
      buyToDetailsPercentage: '51.51%',
    },
    {
      productId: 199,
      quantity: 34,
      purchases: 17,
      delta: 2,
      productRevenue: '$288.24',
      deltaPercentage: '155.64%',
      buyToDetailsPercentage: '80.52%',
    },
    {
      productId: 200,
      quantity: 14,
      purchases: 8,
      delta: 1,
      productRevenue: '$492.15',
      deltaPercentage: '105.02%',
      buyToDetailsPercentage: '91.67%',
    },
    {
      productId: 201,
      quantity: 19,
      purchases: 13,
      delta: 0,
      productRevenue: '$295.88',
      deltaPercentage: '147.76%',
      buyToDetailsPercentage: '51.82%',
    },
    {
      productId: 202,
      quantity: 14,
      purchases: 14,
      delta: 0,
      productRevenue: '$442.03',
      deltaPercentage: '2.37%',
      buyToDetailsPercentage: '63.23%',
    },
    {
      productId: 203,
      quantity: 43,
      purchases: 23,
      delta: 2,
      productRevenue: '$91.59',
      deltaPercentage: '85.70%',
      buyToDetailsPercentage: '56.46%',
    },
    {
      productId: 204,
      quantity: 6,
      purchases: 31,
      delta: 1,
      productRevenue: '$271.90',
      deltaPercentage: '52.35%',
      buyToDetailsPercentage: '34.57%',
    },
    {
      productId: 205,
      quantity: 25,
      purchases: 32,
      delta: 1,
      productRevenue: '$363.69',
      deltaPercentage: '130.85%',
      buyToDetailsPercentage: '63.04%',
    },
    {
      productId: 206,
      quantity: 18,
      purchases: 22,
      delta: 1,
      productRevenue: '$296.75',
      deltaPercentage: '34.37%',
      buyToDetailsPercentage: '34.00%',
    },
    {
      productId: 207,
      quantity: 35,
      purchases: 11,
      delta: 2,
      productRevenue: '$447.56',
      deltaPercentage: '192.33%',
      buyToDetailsPercentage: '70.81%',
    },
    {
      productId: 208,
      quantity: 25,
      purchases: 26,
      delta: 2,
      productRevenue: '$126.01',
      deltaPercentage: '149.90%',
      buyToDetailsPercentage: '11.23%',
    },
    {
      productId: 209,
      quantity: 26,
      purchases: 26,
      delta: 2,
      productRevenue: '$81.56',
      deltaPercentage: '65.17%',
      buyToDetailsPercentage: '19.00%',
    },
    {
      productId: 210,
      quantity: 36,
      purchases: 17,
      delta: 3,
      productRevenue: '$462.68',
      deltaPercentage: '173.03%',
      buyToDetailsPercentage: '57.81%',
    },
    {
      productId: 211,
      quantity: 30,
      purchases: 4,
      delta: 3,
      productRevenue: '$62.55',
      deltaPercentage: '82.38%',
      buyToDetailsPercentage: '16.23%',
    },
    {
      productId: 212,
      quantity: 39,
      purchases: 32,
      delta: 0,
      productRevenue: '$152.69',
      deltaPercentage: '175.26%',
      buyToDetailsPercentage: '77.08%',
    },
    {
      productId: 213,
      quantity: 26,
      purchases: 32,
      delta: 3,
      productRevenue: '$408.57',
      deltaPercentage: '80.71%',
      buyToDetailsPercentage: '68.45%',
    },
    {
      productId: 214,
      quantity: 41,
      purchases: 30,
      delta: 1,
      productRevenue: '$169.70',
      deltaPercentage: '154.79%',
      buyToDetailsPercentage: '35.07%',
    },
    {
      productId: 215,
      quantity: 42,
      purchases: 16,
      delta: 2,
      productRevenue: '$99.86',
      deltaPercentage: '69.91%',
      buyToDetailsPercentage: '11.05%',
    },
    {
      productId: 216,
      quantity: 35,
      purchases: 31,
      delta: 1,
      productRevenue: '$127.80',
      deltaPercentage: '7.89%',
      buyToDetailsPercentage: '98.83%',
    },
    {
      productId: 217,
      quantity: 3,
      purchases: 23,
      delta: 2,
      productRevenue: '$147.81',
      deltaPercentage: '38.74%',
      buyToDetailsPercentage: '51.48%',
    },
    {
      productId: 218,
      quantity: 32,
      purchases: 5,
      delta: 1,
      productRevenue: '$201.46',
      deltaPercentage: '111.46%',
      buyToDetailsPercentage: '50.59%',
    },
    {
      productId: 219,
      quantity: 38,
      purchases: 34,
      delta: 1,
      productRevenue: '$475.83',
      deltaPercentage: '126.78%',
      buyToDetailsPercentage: '40.13%',
    },
    {
      productId: 220,
      quantity: 14,
      purchases: 27,
      delta: 2,
      productRevenue: '$48.21',
      deltaPercentage: '191.19%',
      buyToDetailsPercentage: '78.24%',
    },
    {
      productId: 221,
      quantity: 35,
      purchases: 8,
      delta: 3,
      productRevenue: '$342.09',
      deltaPercentage: '68.43%',
      buyToDetailsPercentage: '27.41%',
    },
    {
      productId: 222,
      quantity: 16,
      purchases: 10,
      delta: 1,
      productRevenue: '$255.18',
      deltaPercentage: '101.63%',
      buyToDetailsPercentage: '78.90%',
    },
  ];

  constructor() {}

  ngOnInit(): void {
  }
}
