import * as d3 from 'd3';
import scrollama from 'scrollama';
import '../main.css';

// ─── STEPS ────────────────────────────────────────────────────────────────────
// Each step has a `text` shown in the scroll panel and a `data` array of
// { label, value } objects that drive the bar chart.
// Edit these to use your own data — add/remove steps or change the numbers.
// ──────────────────────────────────────────────────────────────────────────────
const steps = [
  {
    data: [
      { label: 'Apple',  value: 12 },
      { label: 'Banana', value:  5 },
      { label: 'Cherry', value:  8 },
      { label: 'Mango',  value:  3 },
    ],
  },
  {
    data: [
      { label: 'Apple',  value: 18 },
      { label: 'Banana', value: 14 },
      { label: 'Cherry', value:  9 },
      { label: 'Mango',  value:  6 },
    ],
  },
  {
    data: [
      { label: 'Apple',  value: 20 },
      { label: 'Banana', value: 16 },
      { label: 'Cherry', value: 10 },
      { label: 'Mango',  value: 22 },
    ],
  },
  {
    data: [
      { label: 'Apple',  value: 25 },
      { label: 'Banana', value: 20 },
      { label: 'Cherry', value: 14 },
      { label: 'Mango',  value: 30 },
    ],
  },
];
// ──────────────────────────────────────────────────────────────────────────────

// ─── CHART SETUP ──────────────────────────────────────────────────────────────
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width  = 400 - margin.left - margin.right;
const height = 360 - margin.top  - margin.bottom;

const svg = d3.select('#d3-scrolly')
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand().range([0, width]).padding(0.3);

const y = d3.scaleLinear().range([height, 0]);
const color = d3.scaleOrdinal(d3.schemeTableau10);

const xAxis = svg.append('g').attr('transform', `translate(0,${height})`);
const yAxis = svg.append('g');

function update(stepIndex) {
  const { data } = steps[stepIndex];

  x.domain(data.map((d) => d.label));
  y.domain([0, d3.max(data, (d) => d.value) * 1.15]);

  xAxis.transition().duration(500).call(d3.axisBottom(x));
  yAxis.transition().duration(500).call(d3.axisLeft(y).ticks(5));

  svg.selectAll('rect.bar')
    .data(data, (d) => d.label)
    .join(
      (enter) =>
        enter
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => x(d.label))
          .attr('width', x.bandwidth())
          .attr('y', height)
          .attr('height', 0)
          .attr('fill', (d) => color(d.label))
          .attr('rx', 3),
      (update) => update,
      (exit) => exit.transition().duration(400).attr('y', height).attr('height', 0).remove()
    )
    .transition()
    .duration(600)
    .attr('x', (d) => x(d.label))
    .attr('width', x.bandwidth())
    .attr('y', (d) => y(d.value))
    .attr('height', (d) => height - y(d.value))
    .attr('fill', (d) => color(d.label));
}

// ─── SCROLLAMA ────────────────────────────────────────────────────────────────
update(0);

const scroller = scrollama();

scroller
  .setup({
    step: '.step',
    offset: 0.6,  // trigger when step is 60% down the viewport
  })
  .onStepEnter(({ element, index }) => {
    document.querySelectorAll('.step').forEach((s) => s.classList.remove('is-active'));
    element.classList.add('is-active');
    update(index);
  });

window.addEventListener('resize', scroller.resize);
