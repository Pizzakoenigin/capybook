import { Component, OnInit } from '@angular/core';
import ChartDatalabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss'],
})
export class SeoComponent implements OnInit {
  plugins = [ChartDatalabels];

  chartDevicesOptions = {
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
          let dataArr = this.dataChartDevices1[0].data;
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
              size: '9',
            },
          },
        },
      },
    },
  };

  // Chart devices 1
  dataChartDevices1 = [
    {
      label: 'Traffic',
      data: [2112, 2343, 2545],
      backgroundColor: [
        'rgba(63, 81, 181, 0.5)',
        'rgba(77, 182, 172, 0.5)',
        'rgba(66, 133, 244, 0.5)',
      ],
    },
  ];

  labelsChartDevices = ['Desktop', 'Mobile', 'Tablet'];

  // Chart devices 2
  dataChartDevices2 = [
    {
      label: 'Traffic',
      data: [2112, 2943, 1545],
      backgroundColor: [
        'rgba(63, 81, 181, 0.5)',
        'rgba(77, 182, 172, 0.5)',
        'rgba(66, 133, 244, 0.5)',
      ],
    },
  ];

  optionsChartPagesAndQueries = {
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: false,
      }
    },
  };

  labelsChartPagesAndQueries = [
    '06.08.2020',
    '07.08.2020',
    '08.08.2020',
    '09.08.2020',
    '10.08.2020',
    '11.08.2020',
    '12.08.2020',
  ];

  dataChartPagesAndQueries = [
    {
      label: 'Unique pages',
      data: [25, 49, 40, 21, 56, 75, 30],
    },
    {
      label: 'Unique queries',
      data: [58, 18, 30, 59, 46, 77, 90],
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#33b5e5',
      pointBorderColor: '#33b5e5',
      pointBackgroundColor: '#33b5e5',
    },
  ];

  optionsChartImpressionsAndClicks = {
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: false,
      },
    },
  };

  labelsChartImpressionsAndClicks = [
    '06.08.2020',
    '07.08.2020',
    '08.08.2020',
    '09.08.2020',
    '10.08.2020',
    '11.08.2020',
    '12.08.2020',
    '13.08.2020',
    '14.08.2020',
    '15.08.2020',
    '16.08.2020',
    '17.08.2020',
    '18.08.2020',
    '19.08.2020',
  ];

  dataChartImpressionsAndClicks = [
    {
      label: 'Impressions',
      data: [
        125, 449, 340, 521, 256, 475, 130, 125, 449, 340, 521, 256, 475, 130,
      ],
    },
    {
      label: 'Clicks',
      data: [
        358, 518, 130, 759, 246, 377, 190, 358, 518, 130, 759, 246, 377, 190,
      ],
      backgroundColor: 'rgba(66, 133, 244, 0.0)',
      borderColor: '#33b5e5',
      pointBorderColor: '#33b5e5',
      pointBackgroundColor: '#33b5e5',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
