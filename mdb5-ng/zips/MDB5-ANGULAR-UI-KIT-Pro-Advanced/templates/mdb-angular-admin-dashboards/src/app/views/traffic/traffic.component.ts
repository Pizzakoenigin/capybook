import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import ChartDatalabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss'],
})
export class TrafficComponent implements OnInit {
  dateOptions = [
    { label: 'Today', value: '1' },
    { label: 'Yesterday', value: '2' },
    { label: 'Last 7 days', value: '3' },
    { label: 'Last 28 days', value: '4' },
    { label: 'Last 90 days', value: '5' },
  ];

  selectDateControl = new UntypedFormControl('3');

  userChartData = [
    {
      label: 'Current period',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'Previous period',
      data: [28, 48, 40, 19, 86, 27, 90],
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#33b5e5',
      pointBorderColor: '#33b5e5',
      pointBackgroundColor: '#33b5e5',
    },
  ];
  userChartLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday ',
  ];

  pageViewChartData = [
    {
      label: 'Current period',
      data: [25, 49, 40, 21, 56, 75, 30],
    },
    {
      label: 'Previous period',
      data: [58, 18, 30, 59, 46, 77, 90],
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#33b5e5',
      pointBorderColor: '#33b5e5',
      pointBackgroundColor: '#33b5e5',
    },
  ];
  pageViewsChartLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday ',
  ];

  averageTimeChartData = [
    {
      label: 'Current period',
      data: [431, 123, 435, 123, 345, 234, 124],
    },
    {
      label: 'Previous period',
      data: [654, 234, 123, 432, 533, 422, 222],
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#33b5e5',
      pointBorderColor: '#33b5e5',
      pointBackgroundColor: '#33b5e5',
    },
  ];
  averageTimeChartLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday ',
  ];

  bounceRateChartData = [
    {
      label: 'Current period',
      data: [41, 12, 35, 13, 45, 34, 12],
    },
    {
      label: 'Previous period',
      data: [65, 24, 13, 43, 33, 42, 22],
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#33b5e5',
      pointBorderColor: '#33b5e5',
      pointBackgroundColor: '#33b5e5',
    },
  ];
  bounceRateChartLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday ',
  ];

  plugins = [ChartDatalabels];

  pieChartOptions = {
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
          let dataArr = this.pieChartCurrentData[0].data;
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

  pieChartCurrentData = [
    {
      label: 'Traffic',
      data: [502355, 423545],
      backgroundColor: ['rgba(66, 133, 244, 0.6)', 'rgba(77, 182, 172, 0.6)'],
    },
  ];
  pieChartCurrentLabels = ['New visitor', 'Returning visitor'];

  pieChartPreviousOptions = {};
  pieChartPreviousData = [
    {
      label: 'Traffic',
      data: [402355, 523545],
      backgroundColor: ['rgba(66, 133, 244, 0.6)', 'rgba(77, 182, 172, 0.6)'],
    },
  ];
  pieChartPreviousLabels = ['New visitor', 'Returning visitor'];

  constructor() {}

  ngOnInit(): void {}
}
