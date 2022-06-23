import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TextChart } from 'src/app/shared/textChart.enum';
import { IPoint } from 'src/app/shared/interfaces/ipoint';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  points: IPoint[] = [];
  types: any[] = [];

  uniqeTypes: any[] = [];
  countTypes: any[] = [];
  dataLablesByType: any[] = [];
  dataTypes: any[] = [];

  dataTypesByTotalPrice: any[] = [];
  dataPriceByType: any[] = [];


  barChartPlugins = [ChartDataLabels];
  barChartType = 'bar';
  barChartLegend = false;
  barChartLabels: any[] = [];

  constructor(protected api: ApiService) {}

  ngOnInit(): void {
    this.loadPoints();
  }

  loadPoints() {
    this.api.getPoints('points').subscribe((data) => {
      const points = data.map((item) => {
        return {
          ...item,
          date_from: new Date(item.date_from),
          date_to: new Date(item.date_to),
        }
      })
      this.points = points;
      this.getTypesData();
      this.barChartLabels = this.uniqeTypes;
      this.getTotalPrice();
    })
  }

  getTypesData() {
    const types = this.points.map((item) => item.type);
    this.uniqeTypes = [...new Set(types)];
    this.countTypes = this.uniqeTypes.reduce((accum: any, elem) => {
      accum.push({
        lable: elem,
        count: types.filter((item) => item === elem).length
      })
      return accum
    }, [])

    this.dataTypes = this.countTypes.map((item) => item.count);
    this.dataLablesByType = this.countTypes.map((item) => item.lable);
  }

  getTotalPrice() {
    const basePrices = this.points.map((item) => {
      return {
        type: item.type,
        basePrice: item.base_price
      }
    })

    const data = this.uniqeTypes.map((item) => {
      return {
        lable: item,
        totalPrice: basePrices.reduce((accum, elem) => {
          if (item === elem.type) {
            accum = accum + elem.basePrice
          }
          return accum
        }, 0)
      }
    })

    this.dataPriceByType = data.map((item) => item.totalPrice);
    this.dataTypesByTotalPrice = data.map((item) => item.lable);

  }

  setBarChartOptions(value: string) {
    return {
      scaleShowVerticalLines: false,
      responsive: true,
      indexAxis: 'y',
      plugins: {
        title: {
            display: true,
            text: value,
            position: 'left',
            font: {
              weight: 'bold',
              size: 18
            }
        }
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: function (value: any) {
            return `€ ${value}`
          }
        },
      }
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: true,
          ticks: {
            display: true
          }
        }
      },
    };
  }

  setTypeBarChartData() {
    return [
      {
        data: this.dataTypes,
        label: TextChart.TYPE,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      },
    ]
  }

  setMoneyBarChartData() {
    return [
      {
        data: this.dataPriceByType,
        label: TextChart.MONEY,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }
    ]
  }


}
