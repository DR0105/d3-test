import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnChanges {

  @Input() public data?: { value: number, date: string }[];

  private width = 1200;
  private height = 700;
  private margin = 50;
  public svg: any;
  public svgInner: any;
  public yScale: any;
  public xScale: any;
  public xAxis: any;
  public yAxis: any;
  public lineGroup: any;


  constructor(public chartElem: ElementRef) { }

  public ngOnChanges(changes: any): void {
    if (changes.hasOwnProperty('data') && this.data) {
      console.log(this.data)
      this.initializeChart();
      this.drawChart();

      window.addEventListener('resize', () => this.drawChart());
    }
  }

  private initializeChart(): void {
    this.svg = d3
      .select(this.chartElem.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this.height)
    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(this.data!, d => d.value)!, d3.min(this.data!, d => d.value)!])
      .range([0, this.height - 2 * this.margin]);

    this.yAxis = this.svgInner
      .append('g')
      .style('transform', 'translate(' + (this.width - 3 * this.margin) + 'px,  0)')
      .style("stroke-dasharray", ("3, 3"));


    this.xScale = d3.scaleTime().domain(<Date[]>d3.extent(this.data!, d => new Date(d.date)));

    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'white')
      .style('stroke-width', '3px')

    this.svgInner.append("text")
      .attr("font-family", "Roboto")
      .style('transform', 'translate(' + (this.width - 3 * this.margin) + 'px, ' + -10 + 'px)')
      .style('fill', 'white')
      .text("Gastos");

    this.svgInner.append("text")
      .attr("font-family", "Roboto")
      .style('transform', 'translate(' + ((this.width - 3 * this.margin)) / 2 + 'px, ' + ((this.height - 2 * this.margin) + 40) + 'px)')
      .style('fill', 'white')
      .text("Días del mes");
  }

  private drawChart(): void {
    // this.width = this.chartElem.nativeElement.getBoundingClientRect().width;
    this.svg.attr('width', this.width);

    this.xScale.range([this.margin, this.width - 3 * this.margin]);
    const xAxis = d3
      .axisBottom<Date>(this.xScale)
      .ticks(10)
      .tickFormat(d3.timeFormat('%d /%m / %Y'));

    this.xAxis.call(xAxis);

    this.xAxis.selectAll("line")
      .style("stroke", "white");

    this.xAxis.selectAll("path")
      .style("stroke", "white");

    this.xAxis.selectAll("text")
      .style("fill", "white");

    const yAxis = d3
      .axisRight(this.yScale);

    this.yAxis.call(yAxis);
    this.yAxis.selectAll("line")
      .style("stroke", "white");

    this.yAxis.selectAll("path")
      .style("stroke", "white");

    this.yAxis.selectAll("text")
      .style("fill", "white");

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveLinear);


    const points: [number, number][] = this.data!.map(d => [
      this.xScale(new Date(d.date)),
      this.yScale(d.value),
    ]);
    this.lineGroup.attr('d', line(points));

    const xAxisGrid = d3.axisBottom<Date>(this.xScale).tickSize(this.height - 2 * this.margin).ticks(10).tickFormat(d3.timeFormat(""));
    const yAxisGrid = d3.axisRight<Date>(this.yScale).tickSize(this.width - 4 * this.margin).tickFormat(d3.timeFormat(""));

    const xFinalGrid = this.svgInner.append('g')
      .style("stroke-dasharray", ("3, 3"))
      .call(xAxisGrid);
    xFinalGrid.selectAll("line")
      .style("stroke", "white");

    xFinalGrid.selectAll("path")
      .style("stroke", "white");

    const yFinalGrid = this.svgInner.append('g')
      .style('transform', 'translate(' + this.margin + 'px, 0)')
      .call(yAxisGrid);
    yFinalGrid.selectAll("line")
      .style("stroke", "white");

    yFinalGrid.selectAll("path")
      .style("stroke", "white");

    this.svgInner.selectAll(".dot")
      .data(this.data)
      .enter().append("circle") // Uses the enter().append() method
      .attr("cx", (d: any) => this.xScale(new Date(d.date)))
      .attr("cy", (d: any) => this.yScale(d.value))
      .attr("r", 5)
      .style("fill", "white")
  }

}
