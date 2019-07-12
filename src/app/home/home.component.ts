import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';
import { WeatherService } from '../weather.service';
import {Chart } from 'chart.js';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    chart = [];

    constructor(private userService: UserService, private _weather: WeatherService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this._weather.dailyForecast()
      .subscribe(res => {
        console.log(res)
        let temp_max = res['list'].map(res => res.main.temp_max);
        let temp_min = res['list'].map(res => res.main.temp_min);
        let alldates = res['list'].map(res => res.dt)

let weatherDates = []
alldates.forEach((res) => {
    let jsdate = new Date(res * 1000)
    weatherDates.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }))


    this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: weatherDates,
          datasets: [
            { 
              data: temp_max,
              borderColor: "#3cba9f",
              fill: false
            },
            { 
              data: temp_min,
              borderColor: "#ffcc00",
              fill: false
            },
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });

})
      })
    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
}