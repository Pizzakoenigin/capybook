import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import ChartDatalabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-ecommerce1',
  templateUrl: './ecommerce2.component.html',
  styleUrls: ['./ecommerce2.component.scss'],
})
export class Ecommerce2Component implements OnInit {
  dateOptions = [
    { label: 'Today', value: '1' },
    { label: 'Yesterday', value: '2' },
    { label: 'Last 7 days', value: '3' },
    { label: 'Last 28 days', value: '4' },
    { label: 'Last 90 days', value: '5' },
  ];

  selectDateControl = new UntypedFormControl('3');

  usersSessionsChartData = [
    {
      label: 'Users',
      data: [650, 590, 800, 810, 560, 550, 400],
    },
    {
      label: 'Sessions',
      data: [750, 690, 900, 910, 660, 750, 500],
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#33b5e5',
      pointBorderColor: '#33b5e5',
      pointBackgroundColor: '#33b5e5',
    },
  ];
  usersSessionsChartLabels = [
    '20 Sep',
    '21 Sep',
    '22 Sep',
    '23 Sep',
    '24 Sep',
    '25 Sep',
    '26 Sep',
  ];

  revenueConversionChartOptions = {
    scales: {
      y: {
        ticks: {
          display: false,
        },
      },
      y1: {
        position: 'left',
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
  revenueConversionChartData = [
    {
      label: 'Transactions',
      yAxisID: 'y1',
      data: [21, 23, 25, 34, 23, 19, 9],
      order: 2,
    },
    {
      label: 'Conversion rate %',

      yAxisID: 'y2',
      data: [1.5, 2, 0.5, 3, 1.2, 4, 3.4],
      type: 'line',
      order: 1,
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#94DFD7',
      borderWidth: 2,
      pointBorderColor: '#94DFD7',
      pointBackgroundColor: '#94DFD7',
      lineTension: 0.0,
    },
  ];
  revenueConversionChartLabels = [
    '20 Sep',
    '21 Sep',
    '22 Sep',
    '23 Sep',
    '24 Sep',
    '25 Sep',
    '26 Sep',
  ];

  siteHealthChartOptions = {
    scales: {
      y: {
        ticks: {
          display: false,
        },
      },
      y1: {
        position: 'left',
        ticks: {
          beginAtZero: true,
          callback: function (value: number) {
            return value + ' ' + '%';
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
  siteHealthChartData = [
    {
      label: 'Bounce rate',
      yAxisID: 'y1',
      data: [51, 53, 55, 54, 53, 59, 59],
      order: 2,
    },
    {
      label: 'Avg. Page Load Time (sec)',
      yAxisID: 'y2',
      data: [1.5, 2, 0.5, 3, 1.2, 4, 3.4],
      type: 'line',
      order: 1,
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#94DFD7',
      borderWidth: 2,
      pointBorderColor: '#94DFD7',
      pointBackgroundColor: '#94DFD7',
      lineTension: 0.0,
    },
  ];
  siteHealthChartLabels = [
    '20 Sep',
    '21 Sep',
    '22 Sep',
    '23 Sep',
    '24 Sep',
    '25 Sep',
    '26 Sep',
  ];

  devicePerformanceChartOptions = {
    scales: {
      y: {
        stacked: false,
      },
      ticks: {
        beginAtZero: true,
      },
      x: {
        stacked: false,
      },
    },
  };
  devicePerformanceChartData = [
    {
      label: 'Users',
      data: [510, 653, 255],
    },
    {
      label: 'Page views',
      data: [1251, 1553, 1355],
      backgroundColor: '#94DFD7',
      borderColor: '#94DFD7',
    },
  ];
  devicePerformanceChartLabels = ['Desktop', 'Mobile', 'Tablet'];

  transactionsChartOptions = {
    scales: {
      y: {
        ticks: {
          display: false,
        },
      },
      y1: {
        display: true,
        position: 'left',
        id: 'y1',
      },
      y2: {
        display: true,
        position: 'right',
        id: 'y2',
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          beginAtZero: true,
          callback: function (value: number) {
            return value + ' ' + '%';
          },
        },
      },
      x: {
        stacked: false,
      },
    },
  };
  transactionsChartData = [
    {
      label: 'Transactions',
      data: [51, 65, 25],
      yAxisID: 'y1',
    },
    {
      label: 'Conversion rate %',
      data: [0.2, 0.8, 0.4],
      yAxisID: 'y2',
      backgroundColor: '#94DFD7',
      borderColor: '#94DFD7',
    },
  ];
  transactionsChartLabels = ['Desktop', 'Mobile', 'Tablet'];

  plugins = [ChartDatalabels];

  sessionsChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        formatter: (value: number) => {
          let sum = 0;
          let dataArr = this.sessionsChartData[0].data;
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
              size: '14',
            },
          },
        },
      },
    },
  };
  sessionsChartData = [
    {
      label: 'Traffic',
      data: [3230, 4531, 1832],
      backgroundColor: [
        'rgba(63, 81, 181, 0.5)',
        'rgba(77, 182, 172, 0.5)',
        'rgba(66, 133, 244, 0.5)',
      ],
    },
  ];
  sessionsChartLabels = ['Desktop', 'Mobile', 'Tablet'];

  constructor() {}

  ngOnInit(): void {}
}
